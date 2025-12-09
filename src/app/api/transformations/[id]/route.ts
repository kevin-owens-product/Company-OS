import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const transformation = await prisma.transformation.findUnique({
      where: { id },
      include: {
        codebase: true,
        playbook: true,
        approvals: true,
      },
    })

    if (!transformation) {
      return NextResponse.json(
        { error: 'Transformation not found' },
        { status: 404 }
      )
    }

    // Verify user has access
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: true,
      },
    })

    const hasAccess = user?.workspaces.some(
      (w) => w.workspaceId === transformation.codebase.workspaceId
    )

    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ transformation })
  } catch (error) {
    console.error('Error fetching transformation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transformation' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    const transformation = await prisma.transformation.findUnique({
      where: { id },
      include: {
        codebase: true,
      },
    })

    if (!transformation) {
      return NextResponse.json(
        { error: 'Transformation not found' },
        { status: 404 }
      )
    }

    // Verify user has access
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: true,
      },
    })

    const hasAccess = user?.workspaces.some(
      (w) => w.workspaceId === transformation.codebase.workspaceId
    )

    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    let updatedTransformation

    switch (action) {
      case 'approve':
        if (transformation.status !== 'PENDING_APPROVAL') {
          return NextResponse.json(
            { error: 'Transformation is not pending approval' },
            { status: 400 }
          )
        }

        // Create approval record
        await prisma.transformationApproval.create({
          data: {
            transformationId: id,
            approverId: user!.id,
            status: 'APPROVED',
          },
        })

        updatedTransformation = await prisma.transformation.update({
          where: { id },
          data: {
            status: 'APPROVED',
            currentStep: 'Approved, queued for execution',
          },
        })
        break

      case 'reject':
        if (transformation.status !== 'PENDING_APPROVAL') {
          return NextResponse.json(
            { error: 'Transformation is not pending approval' },
            { status: 400 }
          )
        }

        await prisma.transformationApproval.create({
          data: {
            transformationId: id,
            approverId: user!.id,
            status: 'REJECTED',
            comment: body.comment,
          },
        })

        updatedTransformation = await prisma.transformation.update({
          where: { id },
          data: {
            status: 'CANCELLED',
            currentStep: 'Rejected by reviewer',
          },
        })
        break

      case 'pause':
        if (!['PLANNING', 'EXECUTING'].includes(transformation.status)) {
          return NextResponse.json(
            { error: 'Transformation cannot be paused in current state' },
            { status: 400 }
          )
        }

        updatedTransformation = await prisma.transformation.update({
          where: { id },
          data: {
            status: 'CANCELLED',
            currentStep: 'Paused by user',
          },
        })
        break

      case 'resume':
        if (transformation.status !== 'CANCELLED') {
          return NextResponse.json(
            { error: 'Only paused transformations can be resumed' },
            { status: 400 }
          )
        }

        updatedTransformation = await prisma.transformation.update({
          where: { id },
          data: {
            status: 'EXECUTING',
            currentStep: 'Resumed execution',
          },
        })
        break

      case 'retry':
        if (transformation.status !== 'FAILED') {
          return NextResponse.json(
            { error: 'Only failed transformations can be retried' },
            { status: 400 }
          )
        }

        updatedTransformation = await prisma.transformation.update({
          where: { id },
          data: {
            status: 'PLANNING',
            progress: 0,
            currentStep: 'Retrying transformation',
            error: null,
          },
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ transformation: updatedTransformation })
  } catch (error) {
    console.error('Error updating transformation:', error)
    return NextResponse.json(
      { error: 'Failed to update transformation' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const transformation = await prisma.transformation.findUnique({
      where: { id },
      include: {
        codebase: true,
      },
    })

    if (!transformation) {
      return NextResponse.json(
        { error: 'Transformation not found' },
        { status: 404 }
      )
    }

    // Verify user has access
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: true,
      },
    })

    const hasAccess = user?.workspaces.some(
      (w) => w.workspaceId === transformation.codebase.workspaceId
    )

    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.transformation.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting transformation:', error)
    return NextResponse.json(
      { error: 'Failed to delete transformation' },
      { status: 500 }
    )
  }
}
