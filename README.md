# Healthcare Doctor-Patient Translation Application

A real-time translation web application designed to facilitate communication between English-speaking doctors and Spanish-speaking patients in healthcare settings.

## 🌟 Project Overview

This application enables seamless, real-time communication between doctors and patients who speak different languages. Built with modern web technologies, it provides instant translation, audio recording capabilities, and conversation management features to improve healthcare communication.

**Live Demo:** https://nao-medichat.vercel.app/

**Key Highlights:**
- Real-time bidirectional translation (English ↔ Spanish)
- Audio recording and playback capabilities
- Two-user system with role-based access (Doctor/Patient)
- Instant message synchronization using WebSocket technology
- Persistent conversation history

## ✅ Features Attempted and Completed

### Core Features (Fully Implemented)
- ✅ **Real-time Two-User Communication System**
  - Doctor and patient can communicate simultaneously in separate browser sessions
  - Instant message synchronization without page refresh
  - Supabase Realtime (WebSocket-based) for sub-second latency

- ✅ **Automatic AI Translation**
  - Messages automatically translated between English and Spanish
  - OpenAI GPT-4o-mini API integration
  - Context-aware translations preserving medical terminology
  - Shows both original and translated text for clarity

- ✅ **Role-Based Access System**
  - Users select role (Doctor/Patient) at conversation start
  - Role determines input/output language automatically
  - Doctor: Types English → Patient sees Spanish
  - Patient: Types Spanish → Doctor sees English

- ✅ **Conversation Pairing System**
  - Unique conversation codes (e.g., CONV-ABC123)
  - Multiple users can join same conversation using shared code
  - No authentication required for quick access

- ✅ **Audio Recording & Playback**
  - Record audio messages directly from browser
  - MediaRecorder API with automatic format detection (WebM/MP4)
  - Visual recording timer with 2-minute maximum
  - Custom audio player with play/pause and progress bar
  - Audio stored as Base64 in database

- ✅ **Persistent Message Storage**
  - All messages saved to PostgreSQL database
  - Conversation history preserved across sessions
  - Supports both text and audio messages

- ✅ **Real-time Updates**
  - Supabase Realtime for instant message delivery
  - No polling required
  - Bi-directional synchronization

- ✅ **Responsive Design**
  - Mobile-friendly interface
  - TailwindCSS for consistent styling
  - Works on all modern browsers

### Backend API Routes (Implemented)
- ✅ `POST /api/conversations` - Create new conversation
- ✅ `GET /api/conversations/code/[code]` - Find conversation by code
- ✅ `POST /api/messages` - Create and translate message
- ✅ `GET /api/messages?conversationId=xxx` - Get conversation messages
- ✅ `POST /api/summarize` - Generate AI summary (implemented but not integrated in UI)
- ✅ `POST /api/search` - Search messages (implemented but not integrated in UI)

### Features Partially Complete
- 🔄 **AI Conversation Summary**
  - Backend API fully functional
  - UI panel component exists but not fully integrated
  - Can extract medical points (symptoms, diagnoses, medications)

- 🔄 **Search Functionality**
  - Backend full-text search implemented
  - Search bar component not integrated in main UI

### Features Not Implemented
- ❌ **Speech-to-Text Transcription**: Audio recording works but not transcribed/translated
- ❌ **Video Call Integration**
- ❌ **Multi-language Support** (only EN/ES implemented)
- ❌ **Export Conversation as PDF**
- ❌ **User Authentication** (intentionally omitted for MVP simplicity)
- ❌ **HIPAA Compliance Features**

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: TailwindCSS v3.4.1
- **Components**: shadcn/ui (Button, etc.)
- **Icons**: Lucide React
- **Real-time**: Supabase Realtime Client (@supabase/supabase-js v2.49.1)
- **Audio**: Web MediaRecorder API (native browser API)

### Backend
- **Runtime**: Next.js API Routes (Node.js)
- **Database**: PostgreSQL (hosted on Supabase)
- **ORM**: Prisma v6.2.1
- **AI/Translation**: OpenAI API v4.77.3 (GPT-4o-mini model)
- **Real-time Broadcasting**: Supabase Realtime (postgres_changes events)

### Infrastructure & Deployment
- **Hosting**: Vercel (planned)
- **Database**: Supabase PostgreSQL
- **Environment Management**: Vercel Environment Variables
- **Version Control**: Git/GitHub

### Database Schema (Prisma)
```prisma
model Conversation {
  id        String    @id @default(uuid())
  code      String    @unique @default(cuid())  // For user pairing
  title     String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  messages  Message[]
  summaries Summary[]
}

model Message {
  id              String       @id @default(uuid())
  conversationId  String
  role            Role         // DOCTOR or PATIENT
  originalText    String?
  translatedText  String?
  originalLang    String
  targetLang      String
  audioData       String?      // Base64 encoded
  audioMimeType   String?
  timestamp       DateTime     @default(now())
  conversation    Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
}

enum Role {
  DOCTOR
  PATIENT
}
```

## 🤖 AI Tools and Resources Leveraged

### AI Development Assistance
1. **Claude Sonnet 4.5** (via Claude Code CLI)
   - **Usage**: Primary development assistant for 95%+ of code generation
   - **Tasks Performed**:
     - Full-stack application architecture and design
     - Component-based frontend development
     - API route implementation
     - Database schema design and Prisma configuration
     - Real-time messaging system architecture
     - Debugging complex issues (Realtime subscription, database permissions)
     - Code refactoring and optimization
     - TypeScript type definitions
   - **Impact**: Accelerated development from estimated 12 hours to ~4 hours of actual work

2. **OpenAI GPT-4o-mini API**
   - **Usage**: Production feature (translation engine)
   - **Implementation**:
     - Real-time message translation (English ↔ Spanish)
     - Custom system prompts for healthcare context
     - Medical terminology preservation
     - Contextual translation accuracy
   - **Cost**: ~$0.001 per message translation (very cost-effective)

### Documentation & Learning Resources
- **Next.js 16 Documentation** - App Router patterns, API routes, TypeScript integration
- **Supabase Documentation** - Realtime setup, postgres_changes events, RLS configuration
- **Prisma Documentation** - Schema design, migrations, Prisma Client API
- **TailwindCSS Documentation** - Utility-first CSS, responsive design patterns
- **shadcn/ui Documentation** - Component patterns and customization
- **MDN Web Docs** - MediaRecorder API, Web Audio API, FileReader API
- **OpenAI API Documentation** - Chat completions, system prompts, best practices

### Development Methodology
- **AI-Assisted Workflow**:
  1. Described features and requirements to Claude
  2. Claude generated implementation plan
  3. Claude wrote code with best practices
  4. Iterative debugging with AI guidance
  5. Real-time problem-solving collaboration

- **Key Debugging Sessions with AI**:
  - Database connection issues (Supabase pooler configuration)
  - Supabase Realtime subscription troubleshooting (schema sync, NOTIFY command)
  - Row-level security permissions (Error 401: Unauthorized in Realtime payload)
  - Next.js 15+ compatibility (Promise-based params)
  - TypeScript path alias resolution (@/* imports)
  - TailwindCSS v4 → v3 downgrade

## ⚠️ Known Limitations, Trade-offs, and Unfinished Parts

### Known Limitations

1. **No Speech-to-Text Transcription**
   - Audio messages can be recorded and played back
   - BUT audio is not transcribed or translated
   - Would require additional API (OpenAI Whisper, Google Speech-to-Text)

2. **No User Authentication**
   - Anyone with conversation code can join
   - Intentional design for MVP simplicity
   - Not suitable for production without auth

3. **No Message History Management**
   - Cannot edit or delete messages once sent
   - No conversation list view (only accessible via direct link)
   - No conversation deletion capability

4. **Base64 Audio Storage in Database**
   - Audio stored directly in PostgreSQL as Base64
   - Works for MVP but not scalable for production
   - Large audio files increase database size significantly
   - Should migrate to blob storage (S3, Azure Blob) for production

5. **No Rate Limiting**
   - API routes unprotected
   - Could be abused with automated requests
   - Would need rate limiting middleware for production

6. **No HIPAA Compliance**
   - Not encrypted end-to-end
   - No audit logging
   - No data retention policies
   - NOT suitable for real healthcare use without major security overhaul

7. **Limited Error Handling**
   - Some API errors don't provide user feedback
   - Network failures may not be gracefully handled

### Architectural Trade-offs

1. **Supabase Session Pooler vs Transaction Pooler**
   - **Chose**: Session pooler (port 5432)
   - **Why**: Simpler Prisma integration, supports all PostgreSQL features
   - **Trade-off**: Lower concurrency limits vs transaction pooler
   - **Impact**: Fine for MVP, but would need transaction pooler for high traffic

2. **Supabase Realtime vs Custom WebSocket Server**
   - **Chose**: Supabase Realtime (managed service)
   - **Why**: Zero server maintenance, built-in scaling, simpler implementation
   - **Trade-off**: Vendor lock-in, less control over WebSocket behavior
   - **Impact**: Faster development, but migration would be complex

3. **Base64 Audio Storage vs Blob Storage**
   - **Chose**: Base64 in PostgreSQL
   - **Why**: Simpler implementation, no additional service setup
   - **Trade-off**: Database bloat, slower queries, higher costs at scale
   - **Impact**: Perfect for MVP/demo, but would need S3 for production

4. **No Audio Transcription**
   - **Chose**: Store audio only, no transcription
   - **Why**: Focused on text translation quality, avoided additional API costs
   - **Trade-off**: Audio messages not searchable or translatable
   - **Impact**: Feature gap, but audio works as voice memo

5. **Disabled Row-Level Security (RLS)**
   - **Chose**: Disabled RLS, granted anon SELECT permissions
   - **Why**: Simplified Realtime setup, faster development
   - **Trade-off**: Anyone can read all messages via direct database access
   - **Impact**: Security risk for production, but acceptable for demo

6. **No Conversation List UI**
   - **Chose**: Direct conversation access via code only
   - **Why**: Time constraint, focused on core two-user communication
   - **Trade-off**: Poor UX for finding past conversations
   - **Impact**: Users must bookmark or save conversation URLs

### Unfinished Features

1. **Summary Feature UI**
   - ✅ Backend API endpoint fully functional (`POST /api/summarize`)
   - ✅ SummaryPanel component exists
   - ❌ Not integrated into ChatInterface UI
   - **Time needed**: ~30 minutes to complete

2. **Search Feature UI**
   - ✅ Backend API endpoint implemented (`POST /api/search`)
   - ✅ SearchBar component exists
   - ❌ No search results display page
   - **Time needed**: ~1 hour to complete

3. **Conversation List Page**
   - ❌ No home page listing conversations
   - ❌ No conversation metadata (title, last message preview)
   - **Time needed**: ~1.5 hours to complete

4. **Error Handling & User Feedback**
   - ❌ Limited toast notifications for errors
   - ❌ No retry mechanisms for failed requests
   - **Time needed**: ~1 hour to complete

5. **Loading States**
   - ✅ Present for initial message fetch
   - ✅ Present for sending messages
   - ❌ Missing for some state transitions
   - **Time needed**: ~30 minutes to complete

### Known Bugs
- ✅ None currently identified in core features (all major bugs resolved during development)

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works)
- OpenAI API key

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-username]/healthcare-translator.git
   cd healthcare-translator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create `.env.local` and `.env` files:
   ```env
   # OpenAI
   OPENAI_API_KEY=sk-your-openai-key

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   ```

5. **Configure Supabase Realtime**

   Run in Supabase SQL Editor:
   ```sql
   -- Add tables to Realtime publication
   ALTER PUBLICATION supabase_realtime ADD TABLE "Message";

   -- Grant permissions
   GRANT USAGE ON SCHEMA public TO anon;
   GRANT SELECT ON "Message" TO anon;
   GRANT SELECT ON "Conversation" TO anon;

   -- Disable RLS (for development)
   ALTER TABLE "Message" DISABLE ROW LEVEL SECURITY;
   ALTER TABLE "Conversation" DISABLE ROW LEVEL SECURITY;

   -- Refresh Realtime
   NOTIFY pgrst, 'reload schema';
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Test the application**
   - Open `http://localhost:3000` in two browser windows
   - Window 1: Select "Doctor", generate conversation code
   - Window 2: Select "Patient", enter same code
   - Send messages and verify real-time translation

## 🌐 Deployment to Vercel

### Step-by-Step Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

3. **Add Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`:
     - `OPENAI_API_KEY`
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `DATABASE_URL`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Vercel provides a production URL

5. **Verify Deployment**
   - Visit the Vercel URL
   - Test conversation creation and real-time messaging
   - Check Vercel logs for any errors

## 📸 How to Use

### Starting a Conversation

1. **User 1 (Doctor)**:
   - Visit the application URL
   - Select "Doctor" role
   - Click "Generate Conversation Code"
   - Copy the code (e.g., CONV-YU7Y77)
   - Click "Start Conversation"

2. **User 2 (Patient)**:
   - Visit the same application URL
   - Select "Patient" role
   - Paste the conversation code
   - Click "Start Conversation"

3. **Communication**:
   - Doctor types in English → Patient sees Spanish translation
   - Patient types in Spanish → Doctor sees English translation
   - Both users can also record audio messages
   - Messages appear in real-time without refresh

### Audio Recording

1. Click the microphone button
2. Allow microphone access (first time only)
3. Speak your message (max 2 minutes)
4. Click the red stop button
5. Audio message is automatically sent and appears in both windows
6. Click play button to listen

## 📋 Project Structure

```
healthcare-translator/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── conversations/
│   │   │   │   ├── route.ts
│   │   │   │   └── code/[code]/route.ts
│   │   │   ├── messages/route.ts
│   │   │   ├── search/route.ts
│   │   │   └── summarize/route.ts
│   │   ├── chat/[id]/         # Chat page
│   │   │   └── page.tsx
│   │   ├── page.tsx           # Role selection page
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── AudioPlayer.tsx
│   │   ├── AudioRecorder.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── SummaryPanel.tsx
│   │   └── ui/button.tsx
│   ├── lib/
│   │   ├── openai.ts          # OpenAI API integration
│   │   ├── prisma.ts          # Prisma client
│   │   ├── supabase.ts        # Supabase client
│   │   └── utils.ts
│   └── types/index.ts
├── .env.local
├── .gitignore
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🔒 Security Considerations

**⚠️ IMPORTANT**: This is a demonstration project and is **NOT production-ready** for actual healthcare use.

**What's Missing for Production**:
- ✅ User authentication and authorization
- ✅ Row-Level Security (RLS) policies
- ✅ End-to-end encryption
- ✅ HIPAA compliance measures (audit logs, data retention, BAA agreements)
- ✅ Rate limiting and DDoS protection
- ✅ Input sanitization beyond basic validation
- ✅ CORS configuration for specific domains
- ✅ Content Security Policy (CSP) headers
- ✅ SSL/TLS enforcement (Vercel provides this automatically)

**Current Security Posture**:
- ✅ HTTPS enforced by Vercel
- ✅ Environment variables secured
- ❌ No authentication (anyone can access any conversation)
- ❌ No encryption of messages in database
- ❌ RLS disabled for development simplicity

## 📄 License

MIT License

## 🙏 Acknowledgments

- Built with extensive assistance from **Claude AI** (Anthropic) via Claude Code CLI
- **OpenAI** for GPT-4o-mini translation capabilities
- **Supabase** for PostgreSQL hosting and Realtime infrastructure
- **Vercel** for hosting and deployment platform
- **shadcn/ui** for React component patterns

---

**Developed as part of a technical assessment/challenge**

For questions or issues, please open an issue in the repository.
