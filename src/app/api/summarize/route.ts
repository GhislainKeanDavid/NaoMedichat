import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSummary } from '@/lib/openai'

// POST /api/summarize - Generate or update AI summary
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId } = body

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 }
      )
    }

    // Get all messages for the conversation
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'asc' },
    })

    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages found for this conversation' },
        { status: 404 }
      )
    }

    // Generate summary using OpenAI
    const { summary, medicalPoints } = await generateSummary(messages)

    // Check if summary already exists
    const existingSummary = await prisma.summary.findFirst({
      where: { conversationId },
    })

    let summaryRecord

    if (existingSummary) {
      // Update existing summary
      summaryRecord = await prisma.summary.update({
        where: { id: existingSummary.id },
        data: {
          content: summary,
          medicalPoints,
        },
      })
    } else {
      // Create new summary
      summaryRecord = await prisma.summary.create({
        data: {
          conversationId,
          content: summary,
          medicalPoints,
        },
      })
    }

    return NextResponse.json(summaryRecord)
  } catch (error) {
    console.error('Error generating summary:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}

// GET /api/summarize?conversationId=xxx - Get summaries for a conversation
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId is required' },
        { status: 400 }
      )
    }

    const summaries = await prisma.summary.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(summaries)
  } catch (error) {
    console.error('Error fetching summaries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch summaries' },
      { status: 500 }
    )
  }
}
