'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause } from 'lucide-react'
import { Button } from './ui/button'

interface AudioPlayerProps {
  audioData: string
  audioMimeType: string
}

export default function AudioPlayer({ audioData, audioMimeType }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(audioData)
    audioRef.current = audio

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
    })

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime)
    })

    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      setCurrentTime(0)
    })

    return () => {
      audio.pause()
      audio.removeEventListener('loadedmetadata', () => {})
      audio.removeEventListener('timeupdate', () => {})
      audio.removeEventListener('ended', () => {})
    }
  }, [audioData])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
      <Button
        onClick={togglePlay}
        variant="ghost"
        size="icon"
        className="rounded-full h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>
      <div className="flex-1">
        <div className="h-1 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      <span className="text-xs text-gray-600 min-w-[40px]">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  )
}
