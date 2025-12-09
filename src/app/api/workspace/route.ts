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
        workspaces: {
          include: {
            workspace: {
              include: {
                members: {
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
                },
                _count: {
                  select: {
                    codebases: true,
                    playbooks: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!user || user.workspaces.length === 0) {
      return NextResponse.json({ workspace: null })
    }

    const workspace = user.workspaces[0].workspace

    return NextResponse.json({ workspace, role: user.workspaces[0].role })
  } catch (error) {
    console.error('Error fetching workspace:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workspace' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: {
          where: {
            role: { in: ['OWNER', 'ADMIN'] },
          },
        },
      },
    })

    if (!user || user.workspaces.length === 0) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const workspaceId = user.workspaces[0].workspaceId

    // Check if slug is already taken
    if (slug) {
      const existing = await prisma.workspace.findFirst({
        where: {
          slug,
          id: { not: workspaceId },
        },
      })

      if (existing) {
        return NextResponse.json(
          { error: 'Workspace URL is already taken' },
          { status: 400 }
        )
      }
    }

    const workspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
      },
    })

    return NextResponse.json({ workspace })
  } catch (error) {
    console.error('Error updating workspace:', error)
    return NextResponse.json(
      { error: 'Failed to update workspace' },
      { status: 500 }
    )
  }
}
