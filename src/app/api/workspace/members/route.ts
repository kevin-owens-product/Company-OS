import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: true,
      },
    })

    if (!user || user.workspaces.length === 0) {
      return NextResponse.json({ members: [] })
    }

    const workspaceId = user.workspaces[0].workspaceId

    const members = await prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ members })
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, role = 'MEMBER' } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if current user is owner or admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: {
          where: {
            role: { in: ['OWNER', 'ADMIN'] },
          },
        },
      },
    })

    if (!currentUser || currentUser.workspaces.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const workspaceId = currentUser.workspaces[0].workspaceId

    // Find or create user by email
    let invitedUser = await prisma.user.findUnique({
      where: { email },
    })

    if (!invitedUser) {
      // Create placeholder user - they can claim the account when they sign up
      invitedUser = await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0],
        },
      })
    }

    // Check if user is already a member
    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: invitedUser.id,
          workspaceId,
        },
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this workspace' },
        { status: 400 }
      )
    }

    // Add member
    const member = await prisma.workspaceMember.create({
      data: {
        userId: invitedUser.id,
        workspaceId,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    // In a real app, send invitation email here

    return NextResponse.json({ member }, { status: 201 })
  } catch (error) {
    console.error('Error adding member:', error)
    return NextResponse.json(
      { error: 'Failed to add member' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      )
    }

    // Check if current user is owner or admin
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: {
          where: {
            role: { in: ['OWNER', 'ADMIN'] },
          },
        },
      },
    })

    if (!currentUser || currentUser.workspaces.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const workspaceId = currentUser.workspaces[0].workspaceId

    // Get the member to remove
    const memberToRemove = await prisma.workspaceMember.findUnique({
      where: { id: memberId },
    })

    if (!memberToRemove || memberToRemove.workspaceId !== workspaceId) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // Can't remove owner
    if (memberToRemove.role === 'OWNER') {
      return NextResponse.json(
        { error: 'Cannot remove workspace owner' },
        { status: 400 }
      )
    }

    await prisma.workspaceMember.delete({
      where: { id: memberId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing member:', error)
    return NextResponse.json(
      { error: 'Failed to remove member' },
      { status: 500 }
    )
  }
}
