import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
    typescript: true,
})

export const PLANS = {
    STARTER: {
          priceId: process.env.STRIPE_STARTER_PRICE_ID,
          name: 'Starter',
          price: 29,
          features: ['Up to 5 users', 'Basic analytics', 'Email support'],
    },
    PROFESSIONAL: {
          priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID,
          name: 'Professional',
          price: 99,
          features: ['Unlimited users', 'Advanced analytics', 'Priority support', 'API access'],
    },
    ENTERPRISE: {
          priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
          name: 'Enterprise',
          price: 299,
          features: ['Everything in Pro', 'Custom integrations', 'Dedicated support', 'SLA'],
    },
}
