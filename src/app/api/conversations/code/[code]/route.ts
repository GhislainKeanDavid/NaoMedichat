import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/conversations/code/[code] - Find conversation by code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const conversation = await prisma.conversation.findUnique({
      where: { code },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Error finding conversation:', error)
    return NextResponse.json(
      { error: 'Failed to find conversation' },
      { status: 500 }
    )
  }
}
