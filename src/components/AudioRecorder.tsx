'use client'

import { useState, useRef } from 'react'
import { Mic, Square } from 'lucide-react'
import { Button } from './ui/button'

interface AudioRecorderProps {
  onRecordingComplete: (audioData: string, mimeType: string) => void
}

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4'

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64data = reader.result as string
          onRecordingComplete(base64data, mimeType)
        }
        reader.readAsDataURL(blob)

        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 120) { // 2 minutes max
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-2">
      {isRecording ? (
        <>
          <Button
            onClick={stopRecording}
            variant="destructive"
            size="icon"
            className="rounded-full"
          >
            <Square className="w-5 h-5" />
          </Button>
          <span className="text-sm text-red-600 font-medium animate-pulse">
            Recording: {formatTime(recordingTime)}
          </span>
        </>
      ) : (
        <Button
          onClick={startRecording}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <Mic className="w-5 h-5" />
        </Button>
      )}
    </div>
  )
}
