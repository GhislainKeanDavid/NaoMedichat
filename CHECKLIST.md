# Pre-Flight Checklist ✈️

Use this checklist to ensure everything is set up correctly before running the application.

## 📋 Environment Setup

### Node.js & NPM
- [ ] Node.js 18+ installed
  ```bash
  node --version  # Should show v18.x.x or higher
  ```
- [ ] NPM is working
  ```bash
  npm --version   # Should show 8.x.x or higher
  ```

### PostgreSQL Database
- [ ] PostgreSQL installed
- [ ] PostgreSQL service is running
- [ ] Can connect to PostgreSQL
  ```bash
  psql -U postgres  # Test connection
  ```
- [ ] Database created
  ```bash
  # Inside psql
  CREATE DATABASE healthcare_translator;
  ```

### OpenAI API
- [ ] Have an OpenAI account
- [ ] API key generated at https://platform.openai.com/api-keys
- [ ] API key has available credits
- [ ] Tested API key (optional):
  ```bash
  curl https://api.openai.com/v1/models \
    -H "Authorization: Bearer sk-your-key-here"
  ```

## 📦 Project Setup

### Installation
- [ ] Cloned/downloaded the project
- [ ] Navigated to project directory
  ```bash
  cd healthcare-translator
  ```
- [ ] Installed dependencies
  ```bash
  npm install
  ```
- [ ] No installation errors

### Environment Variables
- [ ] Created `.env.local` file
  ```bash
  cp .env.example .env.local  # Mac/Linux
  copy .env.example .env.local  # Windows
  ```
- [ ] Added `OPENAI_API_KEY` to `.env.local`
- [ ] Added `DATABASE_URL` to `.env.local`
  - Format: `postgresql://username:password@localhost:5432/healthcare_translator`
  - Replace `username`, `password` with your PostgreSQL credentials
- [ ] (Optional) Set `NEXT_PUBLIC_APP_URL`

### Database Migration
- [ ] Ran Prisma migration
  ```bash
  npx prisma migrate dev --name init
  ```
- [ ] Migration completed successfully
- [ ] Prisma Client generated
  ```bash
  npx prisma generate
  ```
- [ ] Can access Prisma Studio
  ```bash
  npx prisma studio  # Opens http://localhost:5555
  ```

## 🧪 Verification Tests

### Start Development Server
- [ ] Server starts without errors
  ```bash
  npm run dev
  ```
- [ ] No TypeScript compilation errors
- [ ] Can access http://localhost:3000
- [ ] Home page loads correctly

### Browser Compatibility
- [ ] Chrome/Edge: Working ✓
- [ ] Firefox: Working ✓
- [ ] Safari: Working ✓
- [ ] Mobile browser: Working ✓

### Feature Testing

#### Create Conversation
- [ ] Click "New Conversation" button
- [ ] Redirected to chat page
- [ ] URL is `/chat/[some-uuid]`

#### Send Doctor Message
- [ ] Select "Doctor (EN → ES)" role
- [ ] Type: "Hello, how are you feeling today?"
- [ ] Click Send button
- [ ] Message appears in chat
- [ ] Translation to Spanish appears
- [ ] No errors in console

#### Send Patient Message
- [ ] Select "Patient (ES → EN)" role
- [ ] Type: "Me siento bien, gracias"
- [ ] Click Send button
- [ ] Message appears in chat
- [ ] Translation to English appears
- [ ] No errors in console

#### Audio Recording
- [ ] Click microphone icon
- [ ] Browser asks for microphone permission
- [ ] Grant microphone permission
- [ ] Recording indicator shows (red square button)
- [ ] Speak for 5 seconds
- [ ] Click stop button
- [ ] Message with audio appears
- [ ] Can play audio back
- [ ] Audio plays correctly

#### Generate Summary
- [ ] Send at least 3-4 messages
- [ ] Click "Summary" button
- [ ] Summary panel opens
- [ ] Click "Generate Summary"
- [ ] Summary generates (may take 5-10 seconds)
- [ ] Medical points extracted (if applicable)
- [ ] No errors

#### Search
- [ ] Return to home page
- [ ] Type search term in search box
- [ ] Conversation appears if match found
- [ ] Can click to open conversation

#### Persistence
- [ ] Refresh browser page
- [ ] Messages still appear
- [ ] Can send new messages
- [ ] Navigate away and back
- [ ] Conversation history preserved

## 🔍 Common Issues

### Issue: "Database connection failed"
**Fix**:
1. Check PostgreSQL is running
2. Verify `DATABASE_URL` in `.env.local`
3. Ensure database exists
4. Test connection: `psql -U your_user -d healthcare_translator`

### Issue: "OpenAI API error"
**Fix**:
1. Verify `OPENAI_API_KEY` is correct
2. Check API key has credits
3. Ensure no extra spaces in key
4. Try generating a new API key

### Issue: "Module not found"
**Fix**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: "Port 3000 already in use"
**Fix**:
```bash
# Kill process on port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
PORT=3001 npm run dev
```

### Issue: "Prisma Client not generated"
**Fix**:
```bash
npx prisma generate
```

### Issue: "Audio not recording"
**Fix**:
1. Check browser permissions
2. Try HTTPS (required for production)
3. Test microphone in other apps
4. Try different browser

## 🎯 Production Readiness

### Before Deploying
- [ ] All features tested locally
- [ ] No console errors
- [ ] Environment variables documented
- [ ] Database schema finalized
- [ ] `.env.local` NOT committed to git
- [ ] `.gitignore` includes sensitive files

### Deployment Prerequisites
- [ ] Vercel account created
- [ ] Production database ready (Vercel Postgres or other)
- [ ] OpenAI API key for production
- [ ] Custom domain (optional)

### After Deployment
- [ ] Production site accessible
- [ ] Can create conversations
- [ ] Translations working
- [ ] Audio recording works (HTTPS)
- [ ] Summaries generating
- [ ] No errors in Vercel logs

## 📱 Mobile Testing

### iOS Safari
- [ ] Page loads
- [ ] Can create conversation
- [ ] Can send messages
- [ ] Translations work
- [ ] Audio recording works
- [ ] Audio playback works
- [ ] Touch targets are large enough

### Android Chrome
- [ ] Page loads
- [ ] Can create conversation
- [ ] Can send messages
- [ ] Translations work
- [ ] Audio recording works
- [ ] Audio playback works
- [ ] Touch targets are large enough

## 🚀 Performance Checks

### Load Times
- [ ] Home page loads < 2 seconds
- [ ] Chat page loads < 2 seconds
- [ ] Messages send < 5 seconds
- [ ] Translations complete < 5 seconds
- [ ] Summary generates < 15 seconds

### Database
- [ ] Queries complete quickly
- [ ] No connection pool errors
- [ ] Migrations applied correctly

### API
- [ ] OpenAI API responding
- [ ] No rate limit errors
- [ ] Reasonable response times

## ✅ Final Checklist

Before considering setup complete:

- [ ] ✅ All dependencies installed
- [ ] ✅ Environment variables configured
- [ ] ✅ Database created and migrated
- [ ] ✅ Development server starts
- [ ] ✅ Can create conversations
- [ ] ✅ Doctor messages translate EN → ES
- [ ] ✅ Patient messages translate ES → EN
- [ ] ✅ Audio recording works
- [ ] ✅ Audio playback works
- [ ] ✅ Summaries generate correctly
- [ ] ✅ Search finds conversations
- [ ] ✅ Data persists after refresh
- [ ] ✅ No console errors
- [ ] ✅ Mobile responsive

## 🎉 You're Ready!

If all items are checked, you're ready to:
1. Use the application locally
2. Customize it for your needs
3. Deploy to production

**Need help?** Check:
- [SETUP.md](./SETUP.md) - Detailed setup guide
- [README.md](./README.md) - Full documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment

---

**Happy translating! 🏥🌍**
