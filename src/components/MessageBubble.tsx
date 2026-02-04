'use client'

import { Message } from '@/types'
import AudioPlayer from './AudioPlayer'
import { User, Stethoscope } from 'lucide-react'

interface MessageBubbleProps {
  message: Message
  currentUserRole: 'DOCTOR' | 'PATIENT'
}

export default function MessageBubble({ message, currentUserRole }: MessageBubbleProps) {
  const isMyMessage = message.role === currentUserRole
  const isDoctor = message.role === 'DOCTOR'

  return (
    <div className={`flex gap-3 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isDoctor ? 'bg-blue-100' : 'bg-green-100'
        }`}
      >
        {isDoctor ? (
          <Stethoscope className="w-5 h-5 text-blue-600" />
        ) : (
          <User className="w-5 h-5 text-green-600" />
        )}
      </div>

      <div className={`flex-1 ${isMyMessage ? 'text-right' : 'text-left'}`}>
        <div
          className={`inline-block max-w-[90%] sm:max-w-[80%] rounded-lg p-3 sm:p-4 ${
            isMyMessage
              ? 'bg-blue-600 text-white'
              : isDoctor
              ? 'bg-blue-50 text-blue-900'
              : 'bg-green-50 text-green-900'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase opacity-75">
              {isMyMessage ? 'You' : message.role}
            </span>
            <span className="text-xs opacity-60">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {message.originalText && (
            <div className="mb-2">
              <div className={`text-xs mb-1 ${isMyMessage ? 'opacity-75' : 'opacity-60'}`}>
                {isMyMessage ? 'Your message' : 'Original'} ({message.originalLang.toUpperCase()}):
              </div>
              <div className={isMyMessage ? 'font-medium' : ''}>{message.originalText}</div>
            </div>
          )}

          {message.translatedText && !isMyMessage && (
            <div className="mb-2 pt-2 border-t border-current opacity-75">
              <div className="text-xs mb-1 opacity-75">
                Translation ({message.targetLang.toUpperCase()}):
              </div>
              <div className="italic">{message.translatedText}</div>
            </div>
          )}

          {message.audioData && message.audioMimeType && (
            <div className="mt-2">
              <AudioPlayer
                audioData={message.audioData}
                audioMimeType={message.audioMimeType}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
