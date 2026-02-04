# Deployment Guide - Vercel

This guide will walk you through deploying the Healthcare Translator application to Vercel.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- GitHub/GitLab/Bitbucket account (for repository hosting)
- OpenAI API key

## Step-by-Step Deployment

### 1. Prepare Your Repository

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Push to GitHub/GitLab/Bitbucket:
```bash
git remote add origin <your-repository-url>
git push -u origin main
```

### 2. Set Up Vercel Postgres

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on the "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Choose a database name (e.g., "healthcare-translator-db")
6. Select your preferred region
7. Click "Create"

### 3. Get Database Connection String

1. After creating the database, go to the "Settings" tab of your database
2. Under "Connection String", find the `.env.local` tab
3. Copy the `DATABASE_URL` value (it will look like `postgres://...`)
4. Save this for the next step

### 4. Deploy to Vercel

#### Option A: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your repository from GitHub/GitLab/Bitbucket
4. Configure your project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next
5. Add Environment Variables:
   - Click "Environment Variables"
   - Add the following variables:
     ```
     OPENAI_API_KEY=sk-your-openai-key
     DATABASE_URL=postgres://your-database-url
     NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
     ```
6. Click "Deploy"

#### Option B: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? `healthcare-translator`
   - In which directory is your code located? `./`
   - Want to override the settings? **N**

5. Add environment variables:
```bash
vercel env add OPENAI_API_KEY
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_APP_URL
```

6. Deploy to production:
```bash
vercel --prod
```

### 5. Run Database Migrations

After your first deployment, you need to run database migrations:

1. In your Vercel project dashboard, go to "Settings" → "Environment Variables"
2. Make sure `DATABASE_URL` is set
3. In your local terminal, run:
```bash
# Set the DATABASE_URL to your production database
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy
```

Alternatively, you can add a migration script to run automatically after deployment:

1. Create a file `scripts/migrate.sh`:
```bash
#!/bin/bash
npx prisma migrate deploy
```

2. Make it executable:
```bash
chmod +x scripts/migrate.sh
```

3. Update your Vercel build settings to run this after build (in vercel.json):
```json
{
  "buildCommand": "npm run build && npx prisma migrate deploy"
}
```

### 6. Verify Deployment

1. Visit your deployed URL (e.g., `https://healthcare-translator.vercel.app`)
2. Create a test conversation
3. Send a message and verify translation works
4. Test audio recording
5. Generate a summary

### 7. Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update `NEXT_PUBLIC_APP_URL` environment variable to your custom domain

## Connecting Vercel Postgres to Your Project

### Automatic Setup

1. In Vercel dashboard, go to your project
2. Click "Storage" tab
3. Click "Connect Store"
4. Select your Postgres database
5. Click "Connect"
6. Vercel will automatically add the `DATABASE_URL` environment variable

### Manual Setup

If you created the database separately:

1. Get the connection string from your Postgres database
2. Go to project "Settings" → "Environment Variables"
3. Add `DATABASE_URL` with your connection string

## Environment Variables Reference

All environment variables needed for production:

```env
# Required
OPENAI_API_KEY=sk-your-openai-api-key-here
DATABASE_URL=postgres://user:password@host:5432/database

# Optional but recommended
NEXT_PUBLIC_APP_URL=https://your-production-url.vercel.app
```

## Troubleshooting

### Build Failures

**Issue**: Build fails with Prisma errors

**Solution**: Make sure Prisma Client is generated during build:
- The `postinstall` script in package.json should run `prisma generate`
- Check build logs in Vercel dashboard

**Issue**: Module not found errors

**Solution**:
- Verify all dependencies are in `dependencies`, not `devDependencies`
- Run `npm install` locally to verify package.json is correct

### Database Connection Issues

**Issue**: Cannot connect to database

**Solution**:
- Verify `DATABASE_URL` is correctly set in Vercel environment variables
- Check that database allows connections from Vercel's IP addresses
- Ensure database is in the same region or supports external connections

**Issue**: Migrations not applied

**Solution**:
```bash
# Connect to production database and run migrations
DATABASE_URL="your-production-url" npx prisma migrate deploy
```

### Runtime Errors

**Issue**: OpenAI API errors

**Solution**:
- Verify `OPENAI_API_KEY` is correctly set
- Check OpenAI account has available credits
- Review API usage limits

**Issue**: Audio recording doesn't work

**Solution**:
- Ensure you're using HTTPS (Vercel provides this automatically)
- Check browser permissions for microphone access
- Verify the site is being accessed from a secure context

## Monitoring and Logs

### View Logs

1. Go to Vercel dashboard
2. Click on your project
3. Click "Deployments"
4. Click on a deployment
5. Click "View Function Logs"

### Monitor Database

1. Go to Vercel dashboard
2. Click "Storage"
3. Select your database
4. View metrics and query logs

## Scaling Considerations

### Database

- Vercel Postgres has different tiers based on:
  - Storage size
  - Concurrent connections
  - Data transfer

Upgrade if you experience:
- Connection pool exhaustion
- Slow queries
- Storage limits

### API Routes

- Vercel has default limits on:
  - Function execution time (10s for Hobby, 60s for Pro)
  - Function size
  - Request/response size

Monitor and upgrade plan if needed.

### Audio Storage

For production at scale:
- Consider moving from Base64 database storage to:
  - Vercel Blob Storage
  - AWS S3
  - Azure Blob Storage
  - Cloudinary

## Security Best Practices

1. **Environment Variables**: Never commit `.env.local` to git
2. **API Keys**: Rotate OpenAI API keys regularly
3. **Database**: Enable SSL for database connections
4. **Rate Limiting**: Implement rate limiting for API routes
5. **Authentication**: Add user authentication before production use

## Cost Optimization

1. **Vercel Postgres**: Choose appropriate tier based on usage
2. **OpenAI API**:
   - Use GPT-4o-mini instead of GPT-4 for cost savings
   - Implement caching for repeated translations
   - Set monthly spending limits in OpenAI dashboard
3. **Function Execution**:
   - Optimize API routes to reduce execution time
   - Use edge functions where possible

## Rollback Procedure

If deployment has issues:

1. Go to Vercel dashboard
2. Click "Deployments"
3. Find the last working deployment
4. Click "..." menu → "Promote to Production"

Or via CLI:
```bash
vercel rollback
```

## Continuous Deployment

Vercel automatically deploys when you push to your repository:

- **Push to `main` branch**: Deploys to production
- **Push to other branches**: Creates preview deployments

Configure in Vercel dashboard under "Settings" → "Git".

## Support

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Next.js Documentation: https://nextjs.org/docs
