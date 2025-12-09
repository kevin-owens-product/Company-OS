import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const codebaseId = searchParams.get('codebaseId')

    // Get user's workspace
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: true,
      },
    })

    if (!user || user.workspaces.length === 0) {
      return NextResponse.json({ analyses: [], findings: [] })
    }

    const workspaceId = user.workspaces[0].workspaceId

    // Get codebases for this workspace
    const codebases = await prisma.codebase.findMany({
      where: { workspaceId },
      select: { id: true },
    })

    const codebaseIds = codebases.map((c) => c.id)

    // Filter by specific codebase if provided
    const whereClause = codebaseId
      ? { codebaseId, codebase: { workspaceId } }
      : { codebaseId: { in: codebaseIds } }

    const analyses = await prisma.analysis.findMany({
      where: whereClause,
      include: {
        codebase: {
          select: { name: true },
        },
        findings: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get all findings across analyses
    const findings = await prisma.finding.findMany({
      where: {
        analysis: {
          codebaseId: codebaseId || { in: codebaseIds },
        },
      },
      include: {
        analysis: {
          include: {
            codebase: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json({ analyses, findings })
  } catch (error) {
    console.error('Error fetching analyses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
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
    const { codebaseId, type = 'FULL' } = body

    if (!codebaseId) {
      return NextResponse.json(
        { error: 'Missing codebaseId' },
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

    // Create new analysis
    const analysis = await prisma.analysis.create({
      data: {
        codebaseId,
        type,
        status: 'RUNNING',
        startedAt: new Date(),
      },
    })

    // Update codebase status
    await prisma.codebase.update({
      where: { id: codebaseId },
      data: {
        status: 'ANALYZING',
        lastScanAt: new Date(),
      },
    })

    // In a real app, this would trigger an async analysis job
    // For demo, we'll simulate by creating some mock findings after a delay

    // Simulate async analysis completion
    setTimeout(async () => {
      try {
        // Generate mock findings
        const mockFindings = [
          {
            analysisId: analysis.id,
            severity: 'HIGH' as const,
            type: 'SECURITY' as const,
            title: 'Potential SQL Injection',
            description: 'User input is used directly in SQL query without proper sanitization.',
            file: 'src/db/queries.ts',
            line: 45,
            remediation: 'Use parameterized queries or an ORM to prevent SQL injection.',
          },
          {
            analysisId: analysis.id,
            severity: 'MEDIUM' as const,
            type: 'TECH_DEBT' as const,
            title: 'Unused Import',
            description: 'Module is imported but never used.',
            file: 'src/utils/helpers.ts',
            line: 3,
            remediation: 'Remove unused import to improve code clarity.',
          },
        ]

        await prisma.finding.createMany({
          data: mockFindings,
        })

        await prisma.analysis.update({
          where: { id: analysis.id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
            results: {
              totalIssues: mockFindings.length,
              critical: 0,
              high: 1,
              medium: 1,
              low: 0,
            },
          },
        })

        await prisma.codebase.update({
          where: { id: codebaseId },
          data: {
            status: 'READY',
            riskScore: 65,
            techDebtScore: 45,
            securityScore: 78,
          },
        })
      } catch (e) {
        console.error('Error completing analysis:', e)
      }
    }, 5000)

    return NextResponse.json({ analysis }, { status: 201 })
  } catch (error) {
    console.error('Error creating analysis:', error)
    return NextResponse.json(
      { error: 'Failed to create analysis' },
      { status: 500 }
    )
  }
}
