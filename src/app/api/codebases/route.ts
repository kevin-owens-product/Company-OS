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

    // Get user's workspace
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: {
          include: {
            workspace: true,
          },
        },
      },
    })

    if (!user || user.workspaces.length === 0) {
      return NextResponse.json({ codebases: [] })
    }

    const workspaceId = user.workspaces[0].workspaceId

    const codebases = await prisma.codebase.findMany({
      where: { workspaceId },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ codebases })
  } catch (error) {
    console.error('Error fetching codebases:', error)
    return NextResponse.json(
      { error: 'Failed to fetch codebases' },
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
    const { name, description, provider, repoUrl, branch } = body

    if (!name || !provider || !repoUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user's workspace
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: {
          include: {
            workspace: true,
          },
        },
      },
    })

    if (!user || user.workspaces.length === 0) {
      return NextResponse.json(
        { error: 'No workspace found' },
        { status: 400 }
      )
    }

    const workspaceId = user.workspaces[0].workspaceId

    const codebase = await prisma.codebase.create({
      data: {
        workspaceId,
        name,
        description,
        provider,
        repoUrl,
        branch: branch || 'main',
        status: 'PENDING',
      },
    })

    // In a real app, trigger an async analysis job here
    // For now, simulate by updating status after creation
    await prisma.codebase.update({
      where: { id: codebase.id },
      data: { status: 'ANALYZING' },
    })

    return NextResponse.json({ codebase }, { status: 201 })
  } catch (error) {
    console.error('Error creating codebase:', error)
    return NextResponse.json(
      { error: 'Failed to create codebase' },
      { status: 500 }
    )
  }
}
