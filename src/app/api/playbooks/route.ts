import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Built-in playbooks that are available to all users
const builtInPlaybooks = [
  {
    id: 'builtin-security-hardening',
    name: 'Security Hardening',
    description: 'Automatically fix common security vulnerabilities including SQL injection, XSS, and hardcoded secrets.',
    category: 'SECURITY_HARDENING',
    rules: {
      patterns: ['sql-injection', 'xss', 'hardcoded-secrets', 'insecure-crypto'],
      severity: ['critical', 'high'],
    },
    isBuiltIn: true,
    isPublic: true,
  },
  {
    id: 'builtin-dead-code-removal',
    name: 'Dead Code Removal',
    description: 'Identify and safely remove unused functions, imports, variables, and unreachable code.',
    category: 'DEAD_CODE_REMOVAL',
    rules: {
      patterns: ['unused-imports', 'unused-variables', 'unreachable-code', 'unused-functions'],
    },
    isBuiltIn: true,
    isPublic: true,
  },
  {
    id: 'builtin-dependency-update',
    name: 'Dependency Update',
    description: 'Update outdated dependencies to their latest stable versions with automatic compatibility checks.',
    category: 'DEPENDENCY_UPDATE',
    rules: {
      updateStrategy: 'minor',
      skipBreaking: true,
      runTests: true,
    },
    isBuiltIn: true,
    isPublic: true,
  },
  {
    id: 'builtin-code-modernization',
    name: 'Code Modernization',
    description: 'Convert legacy code patterns to modern equivalents (ES6+, async/await, etc).',
    category: 'CODE_MODERNIZATION',
    rules: {
      patterns: ['var-to-const', 'callbacks-to-promises', 'class-to-function'],
    },
    isBuiltIn: true,
    isPublic: true,
  },
  {
    id: 'builtin-soc2-compliance',
    name: 'SOC2 Compliance',
    description: 'Ensure codebase meets SOC2 compliance requirements for logging, encryption, and access control.',
    category: 'COMPLIANCE',
    rules: {
      standards: ['soc2-type2'],
      controls: ['logging', 'encryption', 'access-control'],
    },
    isBuiltIn: true,
    isPublic: true,
  },
  {
    id: 'builtin-performance-optimization',
    name: 'Performance Optimization',
    description: 'Identify and fix common performance issues like N+1 queries, memory leaks, and inefficient algorithms.',
    category: 'PERFORMANCE',
    rules: {
      patterns: ['n-plus-one', 'memory-leak', 'inefficient-loop'],
    },
    isBuiltIn: true,
    isPublic: true,
  },
  {
    id: 'builtin-architecture-refactor',
    name: 'Architecture Refactoring',
    description: 'Refactor code to follow clean architecture patterns and SOLID principles.',
    category: 'ARCHITECTURE_REFACTOR',
    rules: {
      patterns: ['extract-interface', 'dependency-injection', 'single-responsibility'],
    },
    isBuiltIn: true,
    isPublic: true,
  },
]

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

    let customPlaybooks: typeof builtInPlaybooks = []

    if (user && user.workspaces.length > 0) {
      const workspaceId = user.workspaces[0].workspaceId

      // Get custom playbooks for this workspace
      const dbPlaybooks = await prisma.playbook.findMany({
        where: {
          OR: [
            { workspaceId },
            { isPublic: true, isBuiltIn: false },
          ],
        },
        orderBy: { createdAt: 'desc' },
      })

      customPlaybooks = dbPlaybooks.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        rules: p.rules as Record<string, unknown>,
        isBuiltIn: p.isBuiltIn,
        isPublic: p.isPublic,
      }))
    }

    // Combine built-in and custom playbooks
    const playbooks = [...builtInPlaybooks, ...customPlaybooks]

    return NextResponse.json({ playbooks })
  } catch (error) {
    console.error('Error fetching playbooks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch playbooks' },
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
    const { name, description, category, rules, isPublic } = body

    if (!name || !description || !category || !rules) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user's workspace
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        workspaces: true,
      },
    })

    if (!user || user.workspaces.length === 0) {
      return NextResponse.json(
        { error: 'No workspace found' },
        { status: 400 }
      )
    }

    const workspaceId = user.workspaces[0].workspaceId

    const playbook = await prisma.playbook.create({
      data: {
        workspaceId,
        name,
        description,
        category,
        rules,
        isBuiltIn: false,
        isPublic: isPublic || false,
      },
    })

    return NextResponse.json({ playbook }, { status: 201 })
  } catch (error) {
    console.error('Error creating playbook:', error)
    return NextResponse.json(
      { error: 'Failed to create playbook' },
      { status: 500 }
    )
  }
}
