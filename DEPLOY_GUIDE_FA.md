# 🚀 راهنمای نهایی دیپلوی Nexus Portal (SPA + AI)

## ✅ وضعیت فعلی پروژه
پروژه شما الان تبدیل به یک **SPA خالص** شده است:
- ✅ SSR غیرفعال (`ssr = false`)
- ✅ Prerender غیرفعال (`prerender = false`)
- ✅ همه رندرینگ در مرورگر (`csr = true`)
- ✅ فقط یک API endpoint: `/api/chat`

---

## 📋 مراحل دیپلوی روی Vercel

### مرحله 1️⃣: نصب Vercel CLI
```bash
npm install -g vercel
```

### مرحله 2️⃣: وارد شدن به Vercel
```bash
vercel login
```
یک صفحه مرورگر باز می‌شود → با ایمیل یا GitHub خود وارد شوید.

---

### مرحله 3️⃣: دیپلوی اولیه (تست)
```bash
vercel
```
**سوالات احتمالی:**
- **Set up and deploy?** → `Y` (بله)
- **Which scope?** → حساب خودتان را انتخاب کنید
- **Link to existing project?** → `N` (خیر - پروژه جدید)
- **What's your project's name?** → `nexus-portal` (یا هر اسم دلخواه)
- **In which directory is your code?** → `.` (همین مسیر)

Vercel خودکار SvelteKit را تشخیص می‌دهد و دیپلوی می‌کند.

---

### مرحله 4️⃣: افزودن API Key OpenAI
```bash
vercel env add OPENAI_API_KEY
```

**سوالات:**
- **What's the value?** → کلید OpenAI خود را paste کنید (مثل `sk-proj-...`)
- **Add to which environment?** → `Production` را انتخاب کنید

---

### مرحله 5️⃣: دیپلوی نهایی (Production)
```bash
vercel --prod
```

✅ **تمام!** پروژه شما دیپلوی شد.

---

## 🌐 دسترسی به سایت

پس از دیپلوی، Vercel یک URL به شما می‌دهد:
```
https://nexus-portal.vercel.app
```

🎉 سایت شما **به صورت SPA** اجرا می‌شود و چت هوش مصنوعی کار می‌کند!

---

## 🔐 امنیت API Key

### ✅ امن (در Vercel):
```typescript
// src/routes/api/chat/+server.ts
import { env } from '$env/dynamic/private';

const openai = createOpenAI({
    apiKey: env.OPENAI_API_KEY  // ✅ این روی سرور اجرا می‌شود
});
```

### ❌ نا امن (هرگز این کار را نکنید):
```typescript
// ❌ NEVER DO THIS
const openai = createOpenAI({
    apiKey: 'sk-...'  // کلید در کد فرانت‌اند = خطرناک!
});
```

---

## 📁 ساختار نهایی پروژه

```
nexus-portal/
├── Frontend (SPA) 🖥️
│   ├── src/routes/(app)/+page.svelte
│   ├── src/routes/(app)/chat/+page.svelte
│   └── همه صفحات در مرورگر رندر می‌شوند ✅
│
├── Backend (فقط 1 فایل) ⚙️
│   └── src/routes/api/chat/+server.ts
│       └── این روی Vercel Edge Function اجرا می‌شود ✅
│
└── Config
    ├── svelte.config.js (adapter-auto)
    └── src/routes/+layout.ts (ssr=false)
```

---

## 🧪 تست Local قبل از دیپلوی

### 1. ایجاد فایل `.env.local`
```env
OPENAI_API_KEY=sk-your-real-key-here
```

### 2. اجرای Dev Server
```bash
npm run dev
```

### 3. تست چت
1. به `http://localhost:5173` بروید
2. به صفحه `/chat` بروید
3. یک پیام بفرستید به AI
4. باید پاسخ استریم شود ✅

---

## 💰 هزینه‌ها

**Vercel (رایگان):**
- ✅ 100GB bandwidth ماهانه
- ✅ 100GB-hours serverless functions
- ✅ SSL رایگان
- ✅ CDN جهانی

**OpenAI:**
- GPT-4 Turbo: ~$0.01 per 1K tokens
- تخمین: $5-10 ماهانه برای ترافیک متوسط

---

## 🔄 به‌روزرسانی پروژه (بعد از تغییرات)

```bash
git add .
git commit -m "update: ..."
git push origin main
vercel --prod
```

یا اگر Vercel را به GitHub متصل کنید، خودکار دیپلوی می‌شود!

---

## 🆘 عیب‌یابی

### مشکل 1: "Cannot find module @sveltejs/adapter-auto"
```bash
npm install -D @sveltejs/adapter-auto
```

### مشکل 2: "/api/chat returns 500"
- بررسی کنید `OPENAI_API_KEY` در Vercel تنظیم شده باشد:
  ```bash
  vercel env ls
  ```

### مشکل 3: "Build Failed"
```bash
npm run build
# خطا را بخوانید و رفع کنید
```

---

## 📚 منابع مفید

- [Vercel Docs](https://vercel.com/docs)
- [SvelteKit Deployment](https://kit.svelte.dev/docs/adapter-vercel)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)

---

## ✨ خلاصه معماری نهایی

| بخش | تکنولوژی | محل اجرا |
|-----|---------|----------|
| Frontend | SvelteKit (SPA mode) | مرورگر کاربر 🖥️ |
| Backend API | SvelteKit API Routes | Vercel Edge Functions ☁️ |
| Database | - | - |
| AI | OpenAI GPT-4 | Vercel Function → OpenAI API 🤖 |

---

🎉 **پروژه شما آماده است!**
- ✅ 100% SPA (بدون SSR)
- ✅ API امن روی Vercel
- ✅ هزینه رایگان تا ترافیک بالا
