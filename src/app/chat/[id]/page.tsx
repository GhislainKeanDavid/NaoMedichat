'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import ChatInterface from '@/components/ChatInterface'
import { Button } from '@/components/ui/button'

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.id as string

  return (
    <div
      className="h-screen overflow-hidden flex flex-col bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: 'url(/background.png)' }}
    >
      <div className="bg-white border-b px-4 py-2 flex items-center gap-4">
        <Button
          onClick={() => router.push('/')}
          variant="ghost"
          size="icon"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <span className="text-sm text-gray-600">Back to conversations</span>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <ChatInterface conversationId={conversationId} />
      </div>
    </div>
  )
}
