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

    const codebase = await prisma.codebase.findUnique({
      where: { id },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            findings: true,
          },
        },
        transformations: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            playbook: true,
          },
        },
        workspace: true,
      },
    })

    if (!codebase) {
      return NextResponse.json(
        { error: 'Codebase not found' },
        { status: 404 }
      )
    }

    // Verify user has access to this codebase's workspace
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: true,
      },
    })

    const hasAccess = user?.workspaces.some(
      (w) => w.workspaceId === codebase.workspaceId
    )

    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ codebase })
  } catch (error) {
    console.error('Error fetching codebase:', error)
    return NextResponse.json(
      { error: 'Failed to fetch codebase' },
      { status: 500 }
    )
  }
}

export async function PUT(
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
    const { name, description, branch } = body

    // Verify codebase exists and user has access
    const existing = await prisma.codebase.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Codebase not found' },
        { status: 404 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: true,
      },
    })

    const hasAccess = user?.workspaces.some(
      (w) => w.workspaceId === existing.workspaceId
    )

    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const codebase = await prisma.codebase.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(branch && { branch }),
      },
    })

    return NextResponse.json({ codebase })
  } catch (error) {
    console.error('Error updating codebase:', error)
    return NextResponse.json(
      { error: 'Failed to update codebase' },
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

    // Verify codebase exists and user has access
    const existing = await prisma.codebase.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Codebase not found' },
        { status: 404 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: true,
      },
    })

    const hasAccess = user?.workspaces.some(
      (w) => w.workspaceId === existing.workspaceId
    )

    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.codebase.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting codebase:', error)
    return NextResponse.json(
      { error: 'Failed to delete codebase' },
      { status: 500 }
    )
  }
}
