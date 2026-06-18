# Nexus Portal - Backend Architecture

## Overview
This prompt describes the **minimal backend infrastructure** required for Nexus Portal's AI chat feature. The frontend is a pure SPA (Single Page Application) that runs entirely in the browser.

---

## Requirements

### Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js or Fastify (lightweight)
- **AI SDK**: Vercel AI SDK v4.1.17
- **LLM Provider**: OpenAI (gpt-4-turbo)
- **Deployment**: Vercel Serverless Functions

### Environment Variables
```env
OPENAI_API_KEY=sk-...
NODE_ENV=production
```

---

## API Endpoints

### 1. POST /api/chat
**Purpose**: Stream AI responses using Vercel AI SDK

**Request Body**:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Build me a todo app"
    }
  ]
}
```

**Response**: Server-Sent Events (SSE) stream with AI chunks

**Implementation**:
```typescript
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
    const { messages } = await request.json();

    const result = streamText({
        model: openai('gpt-4-turbo'),
        messages,
        system: 'You are VoltAgent, a helpful AI assistant specialized in building applications.',
    });

    return result.toDataStreamResponse();
}
```

---

## Security Requirements

### API Key Protection
- ✅ **NEVER** expose `OPENAI_API_KEY` to frontend
- ✅ All AI requests must go through backend
- ✅ Use Vercel environment variables (encrypted)

### Rate Limiting (Optional but Recommended)
```typescript
// Simple rate limiter
const rateLimits = new Map();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const userLimit = rateLimits.get(ip) || { count: 0, resetAt: now + 60000 };
    
    if (now > userLimit.resetAt) {
        userLimit.count = 0;
        userLimit.resetAt = now + 60000;
    }
    
    if (userLimit.count >= 10) {
        return false; // Exceeded 10 requests/minute
    }
    
    userLimit.count++;
    rateLimits.set(ip, userLimit);
    return true;
}
```

---

## File Structure
```
project/
├── src/
│   └── routes/
│       └── api/
│           └── chat/
│               └── +server.ts  ← Your only backend file
├── package.json
└── .env.local  ← API keys here
```

---

## Deployment Instructions (Vercel)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy
```bash
vercel --prod
```

### Step 4: Add Environment Variable
```bash
vercel env add OPENAI_API_KEY
# Paste your key when prompted
```

---

## Testing Locally

### 1. Create `.env.local`
```env
OPENAI_API_KEY=sk-your-key-here
```

### 2. Run Dev Server
```bash
npm run dev
```

### 3. Test API
```bash
curl -X POST http://localhost:5173/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

---

## Expected Behavior
- **Frontend**: Pure SPA, all pages render in browser
- **Backend**: Only `/api/chat` runs on server (Vercel Edge Function)
- **OpenAI**: Streams tokens in real-time to frontend
- **Security**: API key never leaves server

---

## Cost Estimate (Vercel)
- **Hosting**: Free (up to 100GB bandwidth)
- **Serverless Functions**: Free (up to 100GB-hours)
- **OpenAI API**: Pay-as-you-go (~$0.01 per request)

**Total**: ~$0/month for low traffic

---

## Frontend Integration
The SPA connects to `/api/chat` using `@ai-sdk/svelte`:

```typescript
import { useChat } from 'ai/svelte';

const { messages, input, handleSubmit } = useChat({
    api: '/api/chat'
});
```

---

## Summary
This backend is **minimal by design**:
- ✅ One endpoint: `/api/chat`
- ✅ One dependency: Vercel AI SDK
- ✅ Zero server management (serverless)
- ✅ Scales automatically with Vercel

The frontend remains a **pure SPA** with no SSR, no server-side routing, and full client-side rendering.
