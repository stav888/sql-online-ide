import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

// Mock in-memory storage for demo purposes
// In production, use Redis or a database
const sharedQueries = new Map<string, {
  id: string
  shortId: string
  query: string
  state?: unknown
  createdAt: Date
  expiresAt?: Date
}>()

export async function POST(request: NextRequest) {
  try {
    const { query, state, expirationHours } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    const id = nanoid()
    const shortId = nanoid(8) // Shorter ID for the URL
    const createdAt = new Date()
    const expiresAt = expirationHours 
      ? new Date(Date.now() + expirationHours * 60 * 60 * 1000)
      : undefined

    const sharedQuery = {
      id,
      shortId,
      query: query.trim(),
      state,
      createdAt,
      expiresAt
    }

    sharedQueries.set(shortId, sharedQuery)

    const baseUrl = request.headers.get('origin') || 'http://localhost:3000'
    const shareUrl = `${baseUrl}/s/${shortId}`

    return NextResponse.json({
      success: true,
      shareUrl,
      shortId,
      expiresAt: expiresAt?.toISOString(),
      message: 'Query shared successfully'
    })

  } catch (error) {
    console.error('Share error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create share link',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shortId = searchParams.get('id')

    if (!shortId) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 }
      )
    }

    const sharedQuery = sharedQueries.get(shortId)

    if (!sharedQuery) {
      return NextResponse.json(
        { error: 'Shared query not found' },
        { status: 404 }
      )
    }

    // Check if expired
    if (sharedQuery.expiresAt && sharedQuery.expiresAt < new Date()) {
      sharedQueries.delete(shortId)
      return NextResponse.json(
        { error: 'Shared query has expired' },
        { status: 410 }
      )
    }

    return NextResponse.json({
      success: true,
      query: sharedQuery.query,
      state: sharedQuery.state,
      createdAt: sharedQuery.createdAt.toISOString(),
      expiresAt: sharedQuery.expiresAt?.toISOString()
    })

  } catch (error) {
    console.error('Get shared query error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to retrieve shared query',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}