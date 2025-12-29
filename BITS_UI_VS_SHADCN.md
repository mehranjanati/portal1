# 🧩 bits-ui vs shadcn-svelte - راهنمای انتخاب

## 📋 خلاصه

**bits-ui** و **shadcn-svelte** هر دو از یک سازنده هستند (@huntabyte) ولی تفاوت‌های مهمی دارند.

---

## 🔍 تفاوت‌ها

### bits-ui (Headless)
**چیه:** Headless components - فقط logic و accessibility، بدون style

**مزایا:**
- ✅ کنترل کامل روی styling
- ✅ خیلی flexible
- ✅ سبک‌تر (کمتر code)
- ✅ می‌تونی هر design system که بخوای بسازی

**معایب:**
- ❌ باید خودت همه style‌ها رو بنویسی
- ❌ زمان‌برتر
- ❌ نیاز به دانش CSS/TailwindCSS بیشتر

**نصب:**
```bash
npm install bits-ui
```

**مثال:**
```svelte
<script lang="ts">
  import { Dialog } from 'bits-ui';
</script>

<!-- بدون style - باید خودت اضافه کنی -->
<Dialog.Root>
  <Dialog.Trigger class="your-custom-button-class">
    Open Dialog
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay class="your-custom-overlay-class" />
    <Dialog.Content class="your-custom-content-class">
      <Dialog.Title class="your-custom-title-class">
        Title
      </Dialog.Title>
      <Dialog.Description>
        Description
      </Dialog.Description>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

---

### shadcn-svelte (Styled)
**چیه:** Pre-styled components - bits-ui + TailwindCSS styling

**مزایا:**
- ✅ آماده و styled
- ✅ سریع (copy & paste)
- ✅ Design system آماده
- ✅ Dark mode built-in
- ✅ Customizable (می‌تونی تغییر بدی)

**معایب:**
- ❌ کمتر flexible از bits-ui
- ❌ سنگین‌تر (بیشتر code)
- ❌ باید TailwindCSS داشته باشی

**نصب:**
```bash
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add dialog
```

**مثال:**
```svelte
<script lang="ts">
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
</script>

<!-- با style کامل - آماده استفاده -->
<Dialog.Root>
  <Dialog.Trigger asChild let:builder>
    <Button builders={[builder]}>Open Dialog</Button>
  </Dialog.Trigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <p>Description</p>
  </DialogContent>
</Dialog.Root>
```

---

## 🎯 کدوم رو انتخاب کنیم؟

### سناریو 1: شروع سریع پروژه
**انتخاب:** shadcn-svelte ⭐
```
چرا؟
- می‌خوای سریع شروع کنی
- نیازی به design از صفر نیست
- Design system آماده کافیه
```

### سناریو 2: Design System خاص
**انتخاب:** bits-ui
```
چرا؟
- Design system خاص خودت رو داری
- می‌خوای کنترل کامل داشته باشی
- وقت کافی برای styling داری
```

### سناریو 3: Hybrid (بهترین برای Nexus Portal) 🎯
**انتخاب:** shadcn-svelte + bits-ui
```
چرا؟
- shadcn-svelte برای basic components (Button, Card, Input)
- bits-ui برای custom components (Trading alerts, File tree)
- بهترین ترکیب سرعت و flexibility
```

---

## 🏗️ پیشنهاد برای Nexus Portal

### استراتژی Hybrid:

#### Layer 1: shadcn-svelte (Foundation)
استفاده برای:
- ✅ Button, Input, Textarea
- ✅ Card, Dialog, Sheet
- ✅ Form components (Label, Checkbox, Radio)
- ✅ Table, Alert, Toast

```bash
npx shadcn-svelte@latest add button card dialog input form table alert
```

#### Layer 2: bits-ui (Custom Components)
استفاده برای:
- ✅ Trading alert cards (نیاز به custom styling)
- ✅ File tree (builder page)
- ✅ Custom dropdowns
- ✅ Advanced interactions

```bash
npm install bits-ui
```

#### Layer 3: Custom Components (Specific Logic)
ساخت از صفر برای:
- ✅ Code editor (builder page)
- ✅ Chat messages (streaming)
- ✅ WebSocket status indicators
- ✅ Real-time charts

---

## 📦 مثال: Trading Alert Card

### با shadcn-svelte (سریع):
```svelte
<script lang="ts">
  import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
</script>

<Card>
  <CardHeader>
    <CardTitle class="flex items-center justify-between">
      BTC/USD
      <Badge variant="default">BUY</Badge>
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p class="text-2xl font-bold">$45,234.56</p>
    <p class="text-sm text-muted-foreground">Confidence: 85%</p>
    <Button class="w-full mt-4">Approve Trade</Button>
  </CardContent>
</Card>
```

### با bits-ui (flexible):
```svelte
<script lang="ts">
  import { Dialog } from 'bits-ui';
  
  // Custom styling با TailwindCSS یا CSS خودت
</script>

<div class="trading-alert-card">
  <div class="alert-header">
    <h3>BTC/USD</h3>
    <span class="badge-buy">BUY</span>
  </div>
  <div class="alert-content">
    <p class="price">$45,234.56</p>
    <p class="confidence">Confidence: 85%</p>
    
    <Dialog.Root>
      <Dialog.Trigger class="approve-button">
        Approve Trade
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="dialog-overlay" />
        <Dialog.Content class="dialog-content">
          <!-- Custom dialog content -->
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </div>
</div>

<style>
  .trading-alert-card {
    /* Custom styles */
  }
  .approve-button {
    /* Custom button style */
  }
</style>
```

---

## 🎨 Design System Strategy

### برای Nexus Portal:

```
1. Base Layer: shadcn-svelte
   - Button, Card, Input, Dialog
   - Form components
   - Table, Alert

2. Custom Layer: bits-ui + Custom CSS
   - Trading components
   - Builder components
   - Chat components

3. Theme Layer: CSS Variables
   - Colors
   - Typography
   - Spacing
```

---

## 📊 مقایسه عملی

| ویژگی | bits-ui | shadcn-svelte | پیشنهاد برای Nexus |
|-------|---------|---------------|-------------------|
| **سرعت توسعه** | کند ⏱️ | سریع ⚡ | shadcn-svelte |
| **Flexibility** | خیلی زیاد 🎨 | متوسط 🎨 | bits-ui برای custom |
| **حجم کد** | کم 📦 | زیاد 📦 | Hybrid |
| **Learning Curve** | سخت 📚 | آسان 📖 | shadcn-svelte اول |
| **Customization** | کامل ✨ | محدود ✨ | Hybrid |
| **Dark Mode** | خودت بساز 🌙 | Built-in 🌙 | shadcn-svelte |
| **Accessibility** | Built-in ♿ | Built-in ♿ | هر دو |

---

## 🚀 Migration Path

### Week 1: shadcn-svelte Setup
```bash
# نصب shadcn-svelte
npx shadcn-svelte@latest init

# اضافه کردن basic components
npx shadcn-svelte@latest add button card input dialog form
```

### Week 2: Basic Pages با shadcn-svelte
- Login page
- Settings page
- Dashboard (basic widgets)

### Week 3: نصب bits-ui برای Custom Components
```bash
npm install bits-ui
```

### Week 4: Custom Components با bits-ui
- Trading alert cards
- File tree (builder)
- Custom dropdowns

### Week 5: Integration & Polish
- ترکیب shadcn-svelte + bits-ui
- Theme customization
- Dark mode

---

## 💡 Best Practices

### 1. شروع با shadcn-svelte
```svelte
<!-- استفاده از shadcn-svelte برای basic components -->
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card } from '$lib/components/ui/card';
</script>
```

### 2. استفاده از bits-ui برای Custom
```svelte
<!-- استفاده از bits-ui وقتی نیاز به custom styling داری -->
<script lang="ts">
  import { Dialog } from 'bits-ui';
</script>

<Dialog.Root>
  <!-- Custom styled dialog -->
</Dialog.Root>
```

### 3. ترکیب هر دو
```svelte
<script lang="ts">
  // shadcn-svelte برای Button
  import { Button } from '$lib/components/ui/button';
  
  // bits-ui برای Dialog (custom styled)
  import { Dialog } from 'bits-ui';
</script>

<Dialog.Root>
  <Dialog.Trigger asChild let:builder>
    <!-- استفاده از Button shadcn-svelte -->
    <Button builders={[builder]}>Open</Button>
  </Dialog.Trigger>
  <Dialog.Content class="custom-dialog">
    <!-- Custom content -->
  </Dialog.Content>
</Dialog.Root>
```

---

## 📚 منابع

### bits-ui:
- **سایت:** https://www.bits-ui.com
- **GitHub:** https://github.com/huntabyte/bits-ui
- **Docs:** https://www.bits-ui.com/docs

### shadcn-svelte:
- **سایت:** https://www.shadcn-svelte.com
- **GitHub:** https://github.com/huntabyte/shadcn-svelte
- **Docs:** https://www.shadcn-svelte.com/docs

---

## ✅ نتیجه‌گیری

### برای Nexus Portal:

**استراتژی پیشنهادی: Hybrid** 🎯

```
1. شروع با shadcn-svelte
   - سریع
   - آماده
   - Design system

2. اضافه کردن bits-ui برای custom components
   - Flexible
   - کنترل کامل
   - Custom styling

3. Custom components برای logic خاص
   - Code editor
   - Chat streaming
   - WebSocket indicators
```

**زمان توسعه:**
- shadcn-svelte only: 2 هفته
- bits-ui only: 4 هفته
- Hybrid: 3 هفته (بهترین ترکیب)

**کیفیت:**
- shadcn-svelte only: خوب ✅
- bits-ui only: عالی ⭐
- Hybrid: عالی ⭐⭐

---

**پیشنهاد نهایی:** شروع با shadcn-svelte، بعد اضافه کردن bits-ui برای custom components! 🚀
