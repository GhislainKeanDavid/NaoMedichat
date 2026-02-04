import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/search - Search across conversations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query || query.trim() === '') {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Search in both original and translated text
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            originalText: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            translatedText: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        conversation: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 50,
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error searching messages:', error)
    return NextResponse.json(
      { error: 'Failed to search messages' },
      { status: 500 }
    )
  }
}
