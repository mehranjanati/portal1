# 🎨 shadcn-svelte Integration Guide

## 📋 Overview

**shadcn-svelte** یک کتابخانه UI component برای Svelte است که می‌تونید به Nexus Portal اضافه کنید.

**مزایا:**
- ✅ 50+ component آماده
- ✅ Accessible (WCAG compliant)
- ✅ Customizable themes
- ✅ Dark mode support
- ✅ TypeScript support
- ✅ Copy & paste (نه npm install!)

**سایت:** https://www.shadcn-svelte.com  
**GitHub:** https://github.com/huntabyte/shadcn-svelte (8,000+ stars)

---

## 🚀 نصب و راه‌اندازی

### Step 1: نصب CLI

```bash
npx shadcn-svelte@latest init
```

این دستور سوالاتی می‌پرسه:
- Which style would you like to use? → **Default**
- Which color would you like to use as base color? → **Slate**
- Where is your global CSS file? → **src/app.css**
- Where is your tailwind.config located? → **tailwind.config.js**
- Configure the import alias for components? → **$lib/components**
- Configure the import alias for utils? → **$lib/utils**

---

### Step 2: اضافه کردن Components

```bash
# اضافه کردن Button
npx shadcn-svelte@latest add button

# اضافه کردن Card
npx shadcn-svelte@latest add card

# اضافه کردن Dialog (Modal)
npx shadcn-svelte@latest add dialog

# اضافه کردن Input
npx shadcn-svelte@latest add input

# اضافه کردن همه components
npx shadcn-svelte@latest add --all
```

این دستورات فایل‌های component رو توی `src/lib/components/ui/` کپی می‌کنن.

---

## 📁 ساختار فایل‌ها

بعد از نصب:

```
src/
├── lib/
│   ├── components/
│   │   └── ui/
│   │       ├── button/
│   │       │   ├── button.svelte
│   │       │   └── index.ts
│   │       ├── card/
│   │       │   ├── card.svelte
│   │       │   ├── card-header.svelte
│   │       │   ├── card-content.svelte
│   │       │   └── index.ts
│   │       ├── dialog/
│   │       └── ...
│   └── utils.ts
└── app.css
```

---

## 💻 استفاده در Nexus Portal

### مثال 1: Button Component

**قبل (خودمون می‌ساختیم):**
```svelte
<!-- src/lib/components/ui/Button.svelte -->
<script lang="ts">
  // 50+ خط کد برای button...
</script>
```

**بعد (با shadcn-svelte):**
```bash
npx shadcn-svelte@latest add button
```

```svelte
<!-- استفاده -->
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
</script>

<Button variant="default">Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>
```

---

### مثال 2: Card Component (برای Trading Alerts)

```svelte
<script lang="ts">
  import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
</script>

<Card>
  <CardHeader>
    <CardTitle>BTC/USD - BUY Signal</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Price: $45,234.56</p>
    <p>Confidence: 85%</p>
    <Button variant="default">Approve Trade</Button>
  </CardContent>
</Card>
```

---

### مثال 3: Dialog (Modal) برای Trade Approval

```svelte
<script lang="ts">
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  
  let open = $state(false);
</script>

<Button onclick={() => open = true}>Approve Trade</Button>

<Dialog bind:open>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Approve Trade</DialogTitle>
    </DialogHeader>
    
    <div>
      <p>Symbol: BTC/USD</p>
      <p>Action: BUY</p>
      <p>Price: $45,234.56</p>
    </div>
    
    <DialogFooter>
      <Button variant="outline" onclick={() => open = false}>Cancel</Button>
      <Button variant="default">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### مثال 4: Form Components (برای Settings)

```bash
npx shadcn-svelte@latest add form input label
```

```svelte
<script lang="ts">
  import { Label } from '$lib/components/ui/label';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
</script>

<form>
  <div class="space-y-4">
    <div>
      <Label for="name">Display Name</Label>
      <Input id="name" placeholder="John Doe" />
    </div>
    
    <div>
      <Label for="email">Email</Label>
      <Input id="email" type="email" placeholder="john@example.com" />
    </div>
    
    <Button type="submit">Save Changes</Button>
  </div>
</form>
```

---

### مثال 5: DataTable (برای Trading History)

```bash
npx shadcn-svelte@latest add table
```

```svelte
<script lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$lib/components/ui/table';
  
  const alerts = [
    { symbol: 'BTC', strategy: 'BUY', price: 45234, status: 'Approved' },
    { symbol: 'ETH', strategy: 'SELL', price: 3200, status: 'Pending' },
  ];
</script>

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Symbol</TableHead>
      <TableHead>Strategy</TableHead>
      <TableHead>Price</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {#each alerts as alert}
      <TableRow>
        <TableCell>{alert.symbol}</TableCell>
        <TableCell>{alert.strategy}</TableCell>
        <TableCell>${alert.price}</TableCell>
        <TableCell>{alert.status}</TableCell>
      </TableRow>
    {/each}
  </TableBody>
</Table>
```

---

## 🎨 Theming & Customization

### تغییر Theme

**فایل:** `src/app.css`

```css
@layer base {
  :root {
    /* Colors */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    
    /* برای Nexus Portal می‌تونید این رنگ‌ها رو تغییر بدید */
    --primary: 217 91% 60%; /* Blue for trading */
    --destructive: 0 84% 60%; /* Red for sell */
    --success: 142 76% 36%; /* Green for buy */
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... */
  }
}
```

---

### Custom Variants

می‌تونید variant های جدید اضافه کنید:

```svelte
<!-- src/lib/components/ui/button/button.svelte -->
<script lang="ts">
  const variants = {
    default: '...',
    destructive: '...',
    // اضافه کردن variant جدید برای trading
    buy: 'bg-green-600 text-white hover:bg-green-700',
    sell: 'bg-red-600 text-white hover:bg-red-700',
  };
</script>
```

استفاده:
```svelte
<Button variant="buy">Approve Buy</Button>
<Button variant="sell">Approve Sell</Button>
```

---

## 📦 Components پیشنهادی برای Nexus Portal

### برای Trading Page:
```bash
npx shadcn-svelte@latest add card button badge table alert
```

### برای Builder Page:
```bash
npx shadcn-svelte@latest add textarea select tabs code-block
```

### برای Chat Page:
```bash
npx shadcn-svelte@latest add input button scroll-area avatar
```

### برای Agents Page:
```bash
npx shadcn-svelte@latest add card dialog form checkbox switch
```

### برای Settings Page:
```bash
npx shadcn-svelte@latest add form input label select switch
```

### برای Dashboard:
```bash
npx shadcn-svelte@latest add card button badge separator
```

---

## 🔄 مقایسه: Custom vs shadcn-svelte

### Custom Components (قبل):
```
✅ کنترل کامل
✅ سبک‌تر (کمتر dependency)
❌ زمان‌بر (باید همه رو بسازی)
❌ نیاز به testing زیاد
❌ نیاز به accessibility manual
```

### shadcn-svelte (بعد):
```
✅ سریع (copy & paste)
✅ Accessible (WCAG compliant)
✅ Tested (توسط community)
✅ Customizable (می‌تونی تغییر بدی)
✅ Dark mode built-in
❌ کمی سنگین‌تر
❌ باید style رو یاد بگیری
```

---

## 🎯 پیشنهاد برای Nexus Portal

### استراتژی Hybrid:

1. **استفاده از shadcn-svelte برای:**
   - Button, Card, Input, Dialog
   - Form components
   - Table, DataTable
   - Alert, Toast

2. **Custom components برای:**
   - Trading alert cards (نیاز به logic خاص)
   - File tree (builder page)
   - Code editor (builder page)
   - Chat messages (نیاز به streaming)

---

## 📋 Migration Plan

### Week 1: نصب و Setup
- [ ] نصب shadcn-svelte CLI
- [ ] اضافه کردن basic components (button, card, input)
- [ ] تست در یک صفحه (مثلاً Settings)

### Week 2: Replace Components
- [ ] جایگزینی Button components
- [ ] جایگزینی Card components
- [ ] جایگزینی Form components

### Week 3: Advanced Components
- [ ] اضافه کردن Dialog برای modals
- [ ] اضافه کردن Table برای trading history
- [ ] اضافه کردن Toast برای notifications

### Week 4: Theming
- [ ] تنظیم theme برای Nexus Portal
- [ ] اضافه کردن dark mode
- [ ] تست accessibility

---

## 🚀 Quick Start

```bash
# 1. نصب shadcn-svelte
npx shadcn-svelte@latest init

# 2. اضافه کردن components مورد نیاز
npx shadcn-svelte@latest add button card dialog input form table

# 3. استفاده در components
```

```svelte
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent } from '$lib/components/ui/card';
</script>

<Card>
  <CardContent>
    <h2>Trading Alert</h2>
    <Button>Approve</Button>
  </CardContent>
</Card>
```

---

## 📚 منابع

- **سایت رسمی:** https://www.shadcn-svelte.com
- **GitHub:** https://github.com/huntabyte/shadcn-svelte
- **Documentation:** https://www.shadcn-svelte.com/docs
- **Components:** https://www.shadcn-svelte.com/docs/components
- **Examples:** https://www.shadcn-svelte.com/examples

---

## ✅ نتیجه‌گیری

**shadcn-svelte** یک انتخاب عالی برای Nexus Portal است چون:
- ✅ صرفه‌جویی در وقت توسعه
- ✅ کیفیت بالا و production-ready
- ✅ Accessible و WCAG compliant
- ✅ Customizable برای theme شما
- ✅ Community بزرگ و active

**پیشنهاد:** از shadcn-svelte برای basic components استفاده کنید و برای components خاص (مثل trading alerts، file tree) custom بسازید.

---

**آماده برای شروع؟** 🚀

```bash
npx shadcn-svelte@latest init
```
