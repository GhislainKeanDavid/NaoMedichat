import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { translateText } from '@/lib/openai'

// POST /api/messages - Create and translate message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      conversationId,
      role,
      originalText,
      originalLang,
      targetLang,
      audioData,
      audioMimeType,
    } = body

    // Validate required fields
    if (!conversationId || !role || !originalLang || !targetLang) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate that we have either text or audio
    if (!originalText && !audioData) {
      return NextResponse.json(
        { error: 'Must provide either text or audio' },
        { status: 400 }
      )
    }

    // Translate the text (only if text is provided)
    const translatedText = originalText
      ? await translateText(originalText, originalLang, targetLang, role)
      : null

    // Create the message
    const message = await prisma.message.create({
      data: {
        conversationId,
        role,
        originalText,
        translatedText,
        originalLang,
        targetLang,
        audioData,
        audioMimeType,
      },
    })

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    )
  }
}

// GET /api/messages?conversationId=xxx - Get messages for a conversation
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

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'asc' },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
