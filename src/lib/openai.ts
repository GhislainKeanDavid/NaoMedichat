import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string,
  role: 'DOCTOR' | 'PATIENT'
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a professional medical translator. Translate the following ${sourceLang} text to ${targetLang}.
This is a conversation between a ${role.toLowerCase()} and medical staff.
Preserve medical terminology accuracy and maintain a professional, empathetic tone.
Only return the translation, no explanations or additional text.`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    temperature: 0.3,
  })

  return completion.choices[0]?.message?.content || text
}

export async function generateSummary(messages: Array<{
  role: string
  originalText: string | null
  translatedText: string | null
}>): Promise<{ summary: string; medicalPoints: any }> {
  const conversationText = messages
    .map(
      (m) =>
        `${m.role}: ${m.originalText || ''} (Translation: ${m.translatedText || ''})`
    )
    .join('\n')

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a medical conversation analyzer. Generate a concise summary of the doctor-patient conversation below.
Extract and structure the following medical information in JSON format:
- symptoms: array of reported symptoms
- diagnoses: array of mentioned diagnoses
- medications: array of prescribed or discussed medications
- followUps: array of follow-up instructions or appointments

Respond with a JSON object containing:
{
  "summary": "Brief 2-3 sentence summary of the conversation",
  "medicalPoints": {
    "symptoms": [],
    "diagnoses": [],
    "medications": [],
    "followUps": []
  }
}`,
      },
      {
        role: 'user',
        content: conversationText,
      },
    ],
    temperature: 0.5,
    response_format: { type: 'json_object' },
  })

  const result = JSON.parse(completion.choices[0]?.message?.content || '{}')
  return {
    summary: result.summary || 'No summary available',
    medicalPoints: result.medicalPoints || {},
  }
}
