'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Send, Loader2, FileText } from 'lucide-react'
import { Message } from '@/types'
import MessageBubble from './MessageBubble'
import AudioRecorder from './AudioRecorder'
import SummaryPanel from './SummaryPanel'
import { Button } from './ui/button'
import { supabase } from '@/lib/supabase'

interface ChatInterfaceProps {
  conversationId: string
}

export default function ChatInterface({ conversationId }: ChatInterfaceProps) {
  const searchParams = useSearchParams()
  const role = (searchParams.get('role') as 'DOCTOR' | 'PATIENT') || 'DOCTOR'
  const conversationCode = searchParams.get('code') || ''

  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [inputText, setInputText] = useState('')
  const [showSummary, setShowSummary] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
    setupRealtimeSubscription()
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const setupRealtimeSubscription = () => {
    console.log('Setting up subscription for conversation:', conversationId)

    const channel = supabase
      .channel(`conversation:${conversationId}`, {
        config: {
          broadcast: { self: true }
        }
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
        },
        (payload) => {
          console.log('✅ Realtime message received (ANY message):', payload)
          const newMessage = payload.new as Message

          // Only add if it matches our conversation
          if (newMessage.conversationId !== conversationId) {
            console.log('Message from different conversation, ignoring')
            return
          }

          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMessage.id)) {
              console.log('Duplicate message, ignoring')
              return prev
            }
            console.log('Adding new message to state')
            return [...prev, newMessage]
          })
        }
      )
      .subscribe((status, err) => {
        console.log('📡 Subscription status:', status)
        if (err) {
          console.error('❌ Subscription error:', err)
        }
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to conversation:', conversationId)
        }
      })

    return () => {
      console.log('Cleaning up subscription')
      supabase.removeChannel(channel)
    }
  }

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`)
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (audioData?: string, audioMimeType?: string) => {
    if (!inputText.trim() && !audioData) return

    setSending(true)
    try {
      const originalLang = role === 'DOCTOR' ? 'en' : 'es'
      const targetLang = role === 'DOCTOR' ? 'es' : 'en'

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          role,
          originalText: inputText.trim() || null,
          originalLang,
          targetLang,
          audioData,
          audioMimeType,
        }),
      })

      if (response.ok) {
        setInputText('')
        // Message will be added via real-time subscription
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleRecordingComplete = (audioData: string, mimeType: string) => {
    sendMessage(audioData, mimeType)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getRoleDisplay = () => {
    return role === 'DOCTOR' ? '🩺 Doctor' : '🧑‍⚕️ Patient'
  }

  const getRoleColor = () => {
    return role === 'DOCTOR' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
  }

  return (
    <div className="flex flex-col h-screen bg-transparent">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-4xl mx-auto">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getRoleColor()}`}>
                You are: {getRoleDisplay()}
              </span>
              <span className="text-xs sm:text-sm text-gray-600">
                Code: <span className="font-mono font-semibold">{conversationCode}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            onClick={() => setShowSummary(true)}
            variant="outline"
            className="flex items-center gap-2 text-xs sm:text-sm"
          >
            <FileText className="w-4 h-4" />
            Summary
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {loading && messages.length === 0 ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">No messages yet</p>
              <p className="text-sm text-gray-400">
                Start the conversation by typing a message below
              </p>
              <p className="text-sm text-gray-400 mt-4">
                {role === 'DOCTOR'
                  ? 'You will type in English → Patient sees Spanish'
                  : 'You will type in Spanish → Doctor sees English'}
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} currentUserRole={role} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Type your message in ${role === 'DOCTOR' ? 'English' : 'Spanish'}...`}
              disabled={sending}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!inputText.trim() || sending}
              size="icon"
              className="rounded-full"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {showSummary && (
        <SummaryPanel
          conversationId={conversationId}
          onClose={() => setShowSummary(false)}
        />
      )}
    </div>
  )
}
