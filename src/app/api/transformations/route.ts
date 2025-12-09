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
      return NextResponse.json({ transformations: [] })
    }

    const workspaceId = user.workspaces[0].workspaceId

    // Get all codebases for this workspace
    const codebases = await prisma.codebase.findMany({
      where: { workspaceId },
      select: { id: true },
    })

    const codebaseIds = codebases.map((c) => c.id)

    const transformations = await prisma.transformation.findMany({
      where: {
        codebaseId: { in: codebaseIds },
      },
      include: {
        codebase: {
          select: { name: true },
        },
        playbook: {
          select: { name: true },
        },
        approvals: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ transformations })
  } catch (error) {
    console.error('Error fetching transformations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transformations' },
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
    const {
      codebaseId,
      playbookId,
      oversightLevel = 'REVIEW',
      createPR = true,
      dryRun = false,
      config,
    } = body

    if (!codebaseId || !playbookId) {
      return NextResponse.json(
        { error: 'Missing required fields: codebaseId and playbookId' },
        { status: 400 }
      )
    }

    // Verify user has access to the codebase
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: true,
      },
    })

    const codebase = await prisma.codebase.findUnique({
      where: { id: codebaseId },
    })

    if (!codebase) {
      return NextResponse.json(
        { error: 'Codebase not found' },
        { status: 404 }
      )
    }

    const hasAccess = user?.workspaces.some(
      (w) => w.workspaceId === codebase.workspaceId
    )

    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if playbook exists (or is built-in)
    let playbook = await prisma.playbook.findUnique({
      where: { id: playbookId },
    })

    // If playbook doesn't exist in DB, check if it's a built-in playbook
    if (!playbook && playbookId.startsWith('builtin-')) {
      // Create a record for the built-in playbook
      const builtInNames: Record<string, string> = {
        'builtin-security-hardening': 'Security Hardening',
        'builtin-dead-code-removal': 'Dead Code Removal',
        'builtin-dependency-update': 'Dependency Update',
        'builtin-code-modernization': 'Code Modernization',
        'builtin-soc2-compliance': 'SOC2 Compliance',
        'builtin-performance-optimization': 'Performance Optimization',
        'builtin-architecture-refactor': 'Architecture Refactoring',
      }

      playbook = await prisma.playbook.create({
        data: {
          id: playbookId,
          name: builtInNames[playbookId] || 'Built-in Playbook',
          description: 'Built-in playbook',
          category: 'CUSTOM',
          rules: {},
          isBuiltIn: true,
          isPublic: true,
        },
      })
    }

    if (!playbook) {
      return NextResponse.json(
        { error: 'Playbook not found' },
        { status: 404 }
      )
    }

    const transformation = await prisma.transformation.create({
      data: {
        codebaseId,
        playbookId: playbook.id,
        status: 'PLANNING',
        progress: 0,
        currentStep: 'Initializing transformation',
        oversightLevel,
        createPR,
        dryRun,
        config: config || {},
        startedAt: new Date(),
      },
      include: {
        codebase: {
          select: { name: true },
        },
        playbook: {
          select: { name: true },
        },
      },
    })

    // In a real app, this would trigger an async job to execute the transformation
    // For demo purposes, we'll simulate progress updates

    return NextResponse.json({ transformation }, { status: 201 })
  } catch (error) {
    console.error('Error creating transformation:', error)
    return NextResponse.json(
      { error: 'Failed to create transformation' },
      { status: 500 }
    )
  }
}
