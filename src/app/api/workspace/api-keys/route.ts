import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateApiKey } from '@/lib/utils'

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
      return NextResponse.json({ apiKeys: [] })
    }

    const workspaceId = user.workspaces[0].workspaceId

    const apiKeys = await prisma.apiKey.findMany({
      where: { workspaceId },
      select: {
        id: true,
        name: true,
        key: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Mask the keys for security
    const maskedKeys = apiKeys.map((k) => ({
      ...k,
      key: k.key.slice(0, 7) + '...' + k.key.slice(-4),
    }))

    return NextResponse.json({ apiKeys: maskedKeys })
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
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
    const { name, expiresIn } = body

    if (!name) {
      return NextResponse.json(
        { error: 'API key name is required' },
        { status: 400 }
      )
    }

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

    // Generate unique API key
    const key = generateApiKey()

    // Calculate expiration date if provided
    let expiresAt: Date | null = null
    if (expiresIn) {
      expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn))
    }

    const apiKey = await prisma.apiKey.create({
      data: {
        workspaceId,
        name,
        key,
        expiresAt,
      },
    })

    // Return the full key only on creation
    return NextResponse.json(
      {
        apiKey: {
          id: apiKey.id,
          name: apiKey.name,
          key: apiKey.key, // Full key only shown once
          expiresAt: apiKey.expiresAt,
          createdAt: apiKey.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating API key:', error)
    return NextResponse.json(
      { error: 'Failed to create API key' },
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
    const keyId = searchParams.get('keyId')

    if (!keyId) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      )
    }

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

    // Verify the key belongs to this workspace
    const apiKey = await prisma.apiKey.findUnique({
      where: { id: keyId },
    })

    if (!apiKey || apiKey.workspaceId !== workspaceId) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 })
    }

    await prisma.apiKey.delete({
      where: { id: keyId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting API key:', error)
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    )
  }
}
