export type Role = 'DOCTOR' | 'PATIENT'

export interface Message {
  id: string
  conversationId: string
  role: Role
  originalText: string | null
  translatedText: string | null
  originalLang: string
  targetLang: string
  audioData: string | null
  audioMimeType: string | null
  timestamp: Date
}

export interface Conversation {
  id: string
  title: string | null
  createdAt: Date
  updatedAt: Date
  messages?: Message[]
}

export interface Summary {
  id: string
  conversationId: string
  content: string
  medicalPoints: {
    symptoms?: string[]
    diagnoses?: string[]
    medications?: string[]
    followUps?: string[]
  } | null
  createdAt: Date
}
