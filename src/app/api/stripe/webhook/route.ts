import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          const userId = session.metadata?.userId

          if (userId) {
            await prisma.user.update({
              where: { id: userId },
              data: {
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                  subscription.current_period_end * 1000
                ),
              },
            })

            // Update workspace plan based on subscription
            const user = await prisma.user.findUnique({
              where: { id: userId },
              include: {
                workspaces: {
                  where: { role: 'OWNER' },
                  include: { workspace: true },
                },
              },
            })

            if (user?.workspaces[0]?.workspace) {
              const priceId = subscription.items.data[0].price.id

              let plan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' = 'STARTER'
              if (priceId === process.env.STRIPE_PROFESSIONAL_PRICE_ID) {
                plan = 'PROFESSIONAL'
              } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
                plan = 'ENTERPRISE'
              }

              await prisma.workspace.update({
                where: { id: user.workspaces[0].workspace.id },
                data: { plan },
              })
            }
          }
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          )

          await prisma.user.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
            },
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        // Handle failed payment - could send email notification, etc.
        console.log('Payment failed for invoice:', invoice.id)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        await prisma.user.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Reset user to free plan
        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
          include: {
            workspaces: {
              where: { role: 'OWNER' },
              include: { workspace: true },
            },
          },
        })

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              stripeSubscriptionId: null,
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
            },
          })

          if (user.workspaces[0]?.workspace) {
            await prisma.workspace.update({
              where: { id: user.workspaces[0].workspace.id },
              data: { plan: 'FREE' },
            })
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
