# Quick Setup Guide

This guide will help you get the Healthcare Translator application running locally in under 10 minutes.

## Prerequisites Checklist

Before starting, make sure you have:

- [ ] Node.js 18+ installed ([Download here](https://nodejs.org/))
- [ ] PostgreSQL installed and running ([Download here](https://www.postgresql.org/download/))
- [ ] OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- [ ] Git installed (optional, for version control)

## Quick Start (5 Steps)

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Prisma, OpenAI SDK, and TailwindCSS.

### Step 2: Set Up Environment Variables

Copy the example environment file:

```bash
# On Mac/Linux
cp .env.example .env.local

# On Windows
copy .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# OpenAI API Key (required)
OPENAI_API_KEY=sk-your-actual-key-here

# Database URL (required)
# Replace 'user', 'password', and 'healthcare_translator' with your PostgreSQL credentials
DATABASE_URL="postgresql://user:password@localhost:5432/healthcare_translator"

# App URL (optional for local dev)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Create Database

Create a PostgreSQL database for the application:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE healthcare_translator;

# Exit PostgreSQL
\q
```

Or using a GUI tool like pgAdmin, create a new database named `healthcare_translator`.

### Step 4: Run Database Migrations

Set up the database schema:

```bash
npx prisma migrate dev --name init
```

This will:
- Create all necessary tables (Conversation, Message, Summary)
- Generate the Prisma Client
- Set up the database structure

### Step 5: Start Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

🎉 **You're ready to go!**

## Testing the Application

### 1. Create Your First Conversation

1. Open http://localhost:3000
2. Click "New Conversation"
3. You'll be redirected to the chat interface

### 2. Send Messages

**As a Doctor (English → Spanish):**
1. Click "Doctor (EN → ES)" button
2. Type: "Hello, how are you feeling today?"
3. Click Send
4. You'll see the English message and Spanish translation

**As a Patient (Spanish → English):**
1. Click "Patient (ES → EN)" button
2. Type: "Me duele la cabeza"
3. Click Send
4. You'll see the Spanish message and English translation

### 3. Record Audio

1. Click the microphone icon
2. Allow microphone access when prompted
3. Speak your message
4. Click the stop button (red square)
5. Audio will be sent and attached to your message

### 4. Generate Summary

1. Click the "Summary" button in the top right
2. Click "Generate Summary"
3. Wait a few seconds for AI to analyze the conversation
4. View extracted symptoms, diagnoses, medications, and follow-ups

## Troubleshooting

### "Database connection failed"

**Problem**: Cannot connect to PostgreSQL

**Solutions**:
1. Verify PostgreSQL is running:
   ```bash
   # On Mac/Linux
   sudo service postgresql status

   # On Windows (in Services)
   Look for "PostgreSQL" service
   ```

2. Check your `DATABASE_URL` in `.env.local`
   - Username correct?
   - Password correct?
   - Database exists?
   - Port is 5432?

3. Test connection manually:
   ```bash
   psql -U your_username -d healthcare_translator
   ```

### "OpenAI API Error"

**Problem**: Translation or summary generation fails

**Solutions**:
1. Verify your `OPENAI_API_KEY` is correct in `.env.local`
2. Check you have available credits at https://platform.openai.com/usage
3. Test your API key:
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_KEY_HERE"
   ```

### "Microphone not working"

**Problem**: Audio recording doesn't start

**Solutions**:
1. Check browser permissions:
   - Chrome: Click the lock icon in address bar → Microphone → Allow
   - Firefox: Click the shield icon → Permissions → Microphone → Allow
2. Verify no other application is using the microphone
3. Try a different browser (Chrome works best)

### "Port 3000 is already in use"

**Problem**: Development server won't start

**Solutions**:
1. Stop other applications using port 3000
2. Or run on a different port:
   ```bash
   PORT=3001 npm run dev
   ```

### "Prisma Client not generated"

**Problem**: Build fails with Prisma errors

**Solution**:
```bash
npx prisma generate
```

## Database Management

### View Database in GUI

Launch Prisma Studio to view and edit your database:

```bash
npm run db:studio
```

This opens a web interface at http://localhost:5555 where you can:
- View all conversations, messages, and summaries
- Edit data directly
- Delete test data
- Export data

### Reset Database

To start fresh with a clean database:

```bash
npx prisma migrate reset
```

**Warning**: This deletes all data!

### Backup Database

```bash
# Export database
pg_dump -U your_username healthcare_translator > backup.sql

# Import database
psql -U your_username healthcare_translator < backup.sql
```

## Development Tools

### Format Code

If you want to add code formatting:

```bash
npm install -D prettier
echo '{ "semi": false, "singleQuote": true }' > .prettierrc
npx prettier --write .
```

### Type Checking

Check for TypeScript errors:

```bash
npx tsc --noEmit
```

### Database Schema Changes

When you modify `prisma/schema.prisma`:

```bash
# Create a new migration
npx prisma migrate dev --name your_migration_name

# Or push changes without migration (development only)
npx prisma db push
```

## Next Steps

### Add Authentication

For production use, add user authentication:
- NextAuth.js: https://next-auth.js.org/
- Clerk: https://clerk.com/
- Auth0: https://auth0.com/

### Deploy to Production

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Vercel deployment instructions.

### Customize Translations

Edit `src/lib/openai.ts` to:
- Change translation models (GPT-4, GPT-3.5)
- Adjust temperature for creativity
- Modify system prompts
- Add more languages

### Improve UI

The UI uses TailwindCSS and is fully customizable:
- Edit colors in `tailwind.config.js`
- Modify components in `src/components/`
- Add new UI components from [shadcn/ui](https://ui.shadcn.com/)

## Configuration Options

### Change Translation Languages

Edit `src/components/ChatInterface.tsx`:

```typescript
const originalLang = role === 'DOCTOR' ? 'en' : 'es'
const targetLang = role === 'DOCTOR' ? 'es' : 'en'
```

Change to your preferred languages (e.g., 'fr' for French, 'zh' for Chinese).

### Adjust Polling Interval

Edit the polling interval in `src/components/ChatInterface.tsx`:

```typescript
pollingRef.current = setInterval(() => {
  fetchMessages(true)
}, 3000) // Change 3000 to desired milliseconds
```

### Modify Audio Quality

Edit `src/components/AudioRecorder.tsx` to change recording settings:

```typescript
const mediaRecorder = new MediaRecorder(stream, {
  mimeType,
  audioBitsPerSecond: 128000 // Adjust bitrate
})
```

## Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Prisma Documentation**: https://www.prisma.io/docs
- **OpenAI API Documentation**: https://platform.openai.com/docs
- **TailwindCSS Documentation**: https://tailwindcss.com/docs

## Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review error messages in browser console (F12)
3. Check server logs in terminal
4. Search GitHub issues
5. Open a new issue with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)

## Performance Tips

### For Faster Development

1. **Use Turbo**: Enable turbopack in Next.js 14+:
   ```bash
   npm run dev -- --turbo
   ```

2. **Disable Polling**: Comment out polling in ChatInterface during development:
   ```typescript
   // startPolling() // Disable for faster dev
   ```

3. **Use Mock Data**: Create mock API responses during UI development

### For Production

1. **Enable Caching**: Add caching headers to API routes
2. **Optimize Images**: Use Next.js Image component
3. **Bundle Analysis**:
   ```bash
   npm install -D @next/bundle-analyzer
   ```

## License

MIT - See LICENSE file for details
