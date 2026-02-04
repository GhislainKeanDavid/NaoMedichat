'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Stethoscope, User, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Conversation {
  id: string
  code: string
  title: string | null
  updatedAt: string
  _count: {
    messages: number
  }
}

export default function Home() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<'DOCTOR' | 'PATIENT' | null>(null)
  const [conversationCode, setConversationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loadingConversations, setLoadingConversations] = useState(false)

  useEffect(() => {
    if (selectedRole === 'DOCTOR') {
      fetchConversations()
    } else {
      setConversations([])
    }
  }, [selectedRole])

  const fetchConversations = async () => {
    setLoadingConversations(true)
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (err) {
      console.error('Error fetching conversations:', err)
    } finally {
      setLoadingConversations(false)
    }
  }

  const generateCode = () => {
    const code = 'CONV-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    setConversationCode(code)
  }

  const openConversation = async (conversationId: string, code: string) => {
    if (!selectedRole) return
    router.push(`/chat/${conversationId}?role=${selectedRole}&code=${code}`)
  }

  const startConversation = async () => {
    if (!selectedRole) {
      setError('Please select your role')
      return
    }

    if (!conversationCode.trim()) {
      setError('Please enter or generate a conversation ID')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Check if conversation exists or create it
      const checkResponse = await fetch(`/api/conversations/code/${conversationCode}`)

      if (checkResponse.ok) {
        // Conversation exists, join it
        const conversation = await checkResponse.json()
        router.push(`/chat/${conversation.id}?role=${selectedRole}&code=${conversationCode}`)
      } else if (checkResponse.status === 404) {
        // Conversation doesn't exist, create it
        const createResponse = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: conversationCode }),
        })

        if (createResponse.ok) {
          const conversation = await createResponse.json()
          router.push(`/chat/${conversation.id}?role=${selectedRole}&code=${conversationCode}`)
        } else {
          setError('Failed to create conversation')
        }
      } else {
        setError('Failed to check conversation')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: 'url(/background.png)' }}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-4 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            NaoMedichat
          </h1>
          <p className="text-blue-600 font-medium italic">
            Care right where you're at
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Your Role
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedRole('DOCTOR')}
              className={`p-4 sm:p-6 rounded-lg border-2 transition-all ${
                selectedRole === 'DOCTOR'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <Stethoscope
                className={`w-12 h-12 mx-auto mb-2 ${
                  selectedRole === 'DOCTOR' ? 'text-blue-600' : 'text-gray-400'
                }`}
              />
              <div className="text-center">
                <div className="font-semibold text-gray-800">Doctor</div>
                <div className="text-xs text-gray-500 mt-1">EN → ES</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('PATIENT')}
              className={`p-4 sm:p-6 rounded-lg border-2 transition-all ${
                selectedRole === 'PATIENT'
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <User
                className={`w-12 h-12 mx-auto mb-2 ${
                  selectedRole === 'PATIENT' ? 'text-green-600' : 'text-gray-400'
                }`}
              />
              <div className="text-center">
                <div className="font-semibold text-gray-800">Patient</div>
                <div className="text-xs text-gray-500 mt-1">ES → EN</div>
              </div>
            </button>
          </div>
        </div>

        {/* Existing Conversations (Doctor Only) */}
        {selectedRole === 'DOCTOR' && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Conversations
            </label>
            {loadingConversations ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              </div>
            ) : conversations.length > 0 ? (
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onDoubleClick={() => openConversation(conv.id, conv.code)}
                    className="w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800">{conv.code}</div>
                        <div className="text-xs text-gray-500">
                          {conv._count.messages} message{conv._count.messages !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(conv.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-4 border border-gray-200 rounded-lg">
                No conversations yet. Generate a new ID below.
              </div>
            )}
          </div>
        )}

        {/* Conversation ID */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Conversation ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={conversationCode}
              onChange={(e) => setConversationCode(e.target.value.toUpperCase())}
              placeholder="Enter or generate ID"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={generateCode}
              variant="outline"
              className="whitespace-nowrap"
            >
              Generate
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Create a new ID or enter an existing one to join
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Start Button */}
        <Button
          onClick={startConversation}
          disabled={loading || !selectedRole || !conversationCode}
          className="w-full h-12 text-lg"
        >
          {loading ? (
            'Starting...'
          ) : (
            <>
              Start Conversation
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        {/* Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center mb-4">
            <strong>How to test:</strong> Open two browser windows, select different
            roles, and use the same conversation ID to test
          </p>
          <p className="text-sm text-center text-gray-600">
            Real-time translation for doctor-patient communication
          </p>
        </div>
      </div>
    </div>
  )
}
