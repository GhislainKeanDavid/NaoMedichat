'use client'

import { useState } from 'react'
import { FileText, Loader2, X } from 'lucide-react'
import { Button } from './ui/button'
import { Summary } from '@/types'

interface SummaryPanelProps {
  conversationId: string
  onClose: () => void
}

export default function SummaryPanel({ conversationId, onClose }: SummaryPanelProps) {
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateSummary = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate summary')
      }

      const data = await response.json()
      setSummary(data)
    } catch (err) {
      setError('Failed to generate summary. Please try again.')
      console.error('Error generating summary:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Conversation Summary</h2>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!summary && !loading && (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Generate an AI-powered summary of this conversation
              </p>
              <Button onClick={generateSummary}>
                Generate Summary
              </Button>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Generating summary...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {summary && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Summary</h3>
                <p className="text-gray-700">{summary.content}</p>
              </div>

              {summary.medicalPoints && (
                <div className="space-y-4">
                  {summary.medicalPoints.symptoms && summary.medicalPoints.symptoms.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Symptoms</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {summary.medicalPoints.symptoms.map((symptom, idx) => (
                          <li key={idx} className="text-gray-700">{symptom}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {summary.medicalPoints.diagnoses && summary.medicalPoints.diagnoses.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Diagnoses</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {summary.medicalPoints.diagnoses.map((diagnosis, idx) => (
                          <li key={idx} className="text-gray-700">{diagnosis}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {summary.medicalPoints.medications && summary.medicalPoints.medications.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Medications</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {summary.medicalPoints.medications.map((medication, idx) => (
                          <li key={idx} className="text-gray-700">{medication}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {summary.medicalPoints.followUps && summary.medicalPoints.followUps.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Follow-ups</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {summary.medicalPoints.followUps.map((followUp, idx) => (
                          <li key={idx} className="text-gray-700">{followUp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="text-xs text-gray-500 pt-4 border-t">
                Generated on {new Date(summary.createdAt).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
