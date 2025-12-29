# 🎨 Nexus Portal - Complete UX Flow & Page Specifications

## 📊 Overview

**Total Pages:** 7 main pages + 2 modals  
**Navigation Type:** Sidebar navigation (persistent)  
**Auth Required:** Yes (all pages except login)

---

## 🗺️ Site Map

```
Nexus Portal
│
├── 🔐 Login Page (/)
│   └── No auth required
│
├── 📊 Dashboard (/dashboard)
│   ├── Active Agents Widget
│   ├── Recent Market Alerts Widget
│   └── Quick Actions Widget
│
├── 💹 Trading Page (/trading)
│   ├── Connection Status Bar
│   ├── Market Alerts Grid
│   ├── Filter Controls
│   ├── Trading History Sidebar
│   └── [Modal] Trade Approval Modal
│
├── 🏗️ Builder Page (/builder)
│   ├── Prompt Input Panel (Left)
│   ├── File Tree Panel (Right Top)
│   └── Code Preview Panel (Right Bottom)
│
├── 💬 Chat Page (/chat)
│   ├── Message History
│   ├── Message Input
│   └── Typing Indicator
│
├── 🤖 Agents Page (/agents)
│   ├── Agent Cards Grid
│   ├── Create Agent Button
│   └── [Modal] Agent Details Modal
│
├── ⚙️ Settings Page (/settings)
│   ├── Profile Section
│   ├── Notifications Section
│   ├── Trading Preferences Section
│   └── Theme Toggle
│
└── 🚫 404 Page
    └── Not Found
```

---

## 📄 Page 1: Login Page

**Route:** `/`  
**Auth Required:** No  
**Layout:** Centered card on full-screen background

### Visual Layout
```
┌─────────────────────────────────────────┐
│                                         │
│          [Nexus Portal Logo]            │
│                                         │
│     ┌─────────────────────────┐        │
│     │                         │        │
│     │   Welcome to Nexus      │        │
│     │   Portal                │        │
│     │                         │        │
│     │   Sign in with your     │        │
│     │   Ethereum wallet       │        │
│     │                         │        │
│     │   [Connect Wallet]      │        │
│     │                         │        │
│     │   Powered by SIWE       │        │
│     │                         │        │
│     └─────────────────────────┘        │
│                                         │
└─────────────────────────────────────────┘
```

### Components

#### 1. Logo
- **Element:** Image
- **Size:** 120px x 120px
- **Position:** Top center
- **Alt text:** "Nexus Portal Logo"

#### 2. Welcome Card
- **Element:** Card component
- **Width:** 400px
- **Padding:** 2rem
- **Shadow:** Large
- **Border radius:** 1rem

#### 3. Connect Wallet Button
- **Element:** Button (primary variant)
- **Text:** "Connect Wallet"
- **Icon:** Wallet icon (left)
- **Size:** Large
- **Width:** 100%
- **States:**
  - Default: Blue background
  - Hover: Darker blue
  - Loading: Spinner + "Connecting..."
  - Disabled: Gray (if no wallet detected)

### User Flow

```mermaid
graph TD
    A[User lands on /] --> B{Has wallet?}
    B -->|No| C[Show "Install MetaMask" message]
    B -->|Yes| D[Show "Connect Wallet" button]
    D --> E[User clicks button]
    E --> F[Wallet popup appears]
    F --> G{User approves?}
    G -->|No| H[Show error message]
    G -->|Yes| I[GET /auth/nonce]
    I --> J[Sign message in wallet]
    J --> K[POST /auth/verify]
    K --> L{Verified?}
    L -->|No| M[Show error]
    L -->|Yes| N[Store JWT token]
    N --> O[Redirect to /dashboard]
```

### Interactions

| Element | Event | Action | Feedback |
|---------|-------|--------|----------|
| Connect Wallet Button | Click | Trigger wallet connection | Button shows loading spinner |
| Connect Wallet Button | Wallet connected | Request signature | Wallet popup opens |
| Connect Wallet Button | Signature received | Verify with backend | Show "Verifying..." |
| Connect Wallet Button | Verification success | Redirect to dashboard | Success toast notification |
| Connect Wallet Button | Error | Show error message | Error toast notification |

### Error States

1. **No Wallet Detected**
   - Message: "No Ethereum wallet found. Please install MetaMask."
   - Action: Show link to MetaMask download

2. **User Rejected**
   - Message: "Connection rejected. Please try again."
   - Action: Reset button to default state

3. **Verification Failed**
   - Message: "Authentication failed. Please try again."
   - Action: Reset button, allow retry

### Accessibility

- **Tab order:** Logo → Connect Button
- **Keyboard:** Enter key triggers connect
- **Screen reader:** "Connect your Ethereum wallet to sign in to Nexus Portal"
- **ARIA labels:** All interactive elements labeled

---

## 📄 Page 2: Dashboard

**Route:** `/dashboard`  
**Auth Required:** Yes  
**Layout:** 3-column grid (responsive)

### Visual Layout (Desktop)
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] Dashboard    Trading  Builder  Chat  Agents  ⚙️  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌──────────────────┐  ┌───────────┐ │
│  │   Active    │  │  Recent Market   │  │  Quick    │ │
│  │   Agents    │  │     Alerts       │  │  Actions  │ │
│  │             │  │                  │  │           │ │
│  │  🤖 Bot 1   │  │  📈 BTC $45k     │  │ [New App] │ │
│  │  Status: ✅  │  │  Strategy: BUY   │  │           │ │
│  │  ROI: 15%   │  │  Confidence: 85% │  │ [Chat]    │ │
│  │             │  │                  │  │           │ │
│  │  🤖 Bot 2   │  │  📉 ETH $3.2k    │  │ [Trading] │ │
│  │  Status: ⏸️  │  │  Strategy: SELL  │  │           │ │
│  │  ROI: 8%    │  │  Confidence: 72% │  │           │ │
│  │             │  │                  │  │           │ │
│  │ [View All]  │  │  [View All]      │  │           │ │
│  └─────────────┘  └──────────────────┘  └───────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │          System Status                           │  │
│  │  WebSocket: 🟢 Connected                         │  │
│  │  Backend: 🟢 Operational                         │  │
│  │  Last Update: 2 seconds ago                      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Components

#### 1. Navigation Bar (Persistent)
- **Element:** Horizontal nav
- **Height:** 64px
- **Background:** White (light mode) / Dark gray (dark mode)
- **Shadow:** Small
- **Items:**
  - Logo (left)
  - Dashboard (active)
  - Trading
  - Builder
  - Chat
  - Agents
  - Settings icon (right)
  - User avatar (far right)

#### 2. Active Agents Widget
- **Element:** Card
- **Width:** 33% (desktop), 100% (mobile)
- **Max items shown:** 3
- **Each agent shows:**
  - Agent icon/avatar
  - Agent name
  - Status indicator (🟢 Active, ⏸️ Paused, 🔴 Error)
  - ROI percentage
  - Quick action buttons (Pause/Resume)

**Agent Card Spec:**
```
┌─────────────────────┐
│ 🤖 Trading Bot Alpha│
│ Status: 🟢 Active   │
│ ROI: +15.3%         │
│ Trades: 127         │
│ [⏸️ Pause] [⚙️ Config]│
└─────────────────────┘
```

#### 3. Recent Market Alerts Widget
- **Element:** Card
- **Width:** 33% (desktop), 100% (mobile)
- **Max items shown:** 5
- **Each alert shows:**
  - Symbol (BTC, ETH, etc.)
  - Current price
  - Strategy (BUY/SELL/HOLD)
  - Confidence percentage
  - Timestamp
  - [Approve] button (if BUY/SELL)

**Alert Card Spec:**
```
┌─────────────────────────┐
│ BTC/USD                 │
│ $45,234.56              │
│ Strategy: BUY 📈        │
│ Confidence: 85%         │
│ 2 minutes ago           │
│ [Approve Trade]         │
└─────────────────────────┘
```

#### 4. Quick Actions Widget
- **Element:** Card
- **Width:** 33% (desktop), 100% (mobile)
- **Buttons:**
  - "Generate New App" → /builder
  - "Start Chat" → /chat
  - "View Trading" → /trading
  - "Manage Agents" → /agents

**Button Spec:**
- Size: Large
- Width: 100%
- Margin: 0.5rem between
- Icon: Left-aligned
- Text: Left-aligned

#### 5. System Status Bar
- **Element:** Info bar
- **Width:** 100%
- **Background:** Light gray
- **Shows:**
  - WebSocket status (🟢/🔴)
  - Backend status (🟢/🔴)
  - Last update timestamp

### Interactions

| Element | Event | Action | Feedback |
|---------|-------|--------|----------|
| Agent Card | Click | Open agent details modal | Modal slides in |
| Pause Button | Click | Pause agent | Status changes to ⏸️ |
| Resume Button | Click | Resume agent | Status changes to 🟢 |
| Alert Card | Click | Open alert details | Expand card |
| Approve Trade Button | Click | Open approval modal | Modal appears |
| Quick Action Button | Click | Navigate to page | Page transition |
| View All (Agents) | Click | Navigate to /agents | Page transition |
| View All (Alerts) | Click | Navigate to /trading | Page transition |

### Responsive Behavior

**Desktop (>1024px):**
- 3-column grid
- All widgets visible

**Tablet (768px - 1024px):**
- 2-column grid
- Quick Actions below

**Mobile (<768px):**
- 1-column stack
- Widgets collapse to show top 2 items
- "View All" button more prominent

---

## 📄 Page 3: Trading Page

**Route:** `/trading`  
**Auth Required:** Yes  
**Layout:** Full-width grid with sidebar

### Visual Layout
```
┌──────────────────────────────────────────────────────────┐
│ [Nav Bar]                                                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ WebSocket: 🟢 Connected | Last Alert: 5s ago       │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────────┐│
│  │ Filters & Search     │  │  Trading History         ││
│  │                      │  │                          ││
│  │ Strategy: [All ▼]    │  │  📊 Past Alerts          ││
│  │ Symbol: [____]       │  │                          ││
│  │ [Apply]              │  │  BTC - BUY - Approved    ││
│  └──────────────────────┘  │  ETH - SELL - Pending    ││
│                            │  SOL - HOLD - Ignored    ││
│  ┌─────────────────────────────────────────────────┐  ││
│  │           Market Alerts Grid                    │  ││
│  │                                                 │  ││
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐     │  ││
│  │  │ BTC      │  │ ETH      │  │ SOL      │     │  ││
│  │  │ $45.2k   │  │ $3.2k    │  │ $98.5    │     │  ││
│  │  │ BUY 📈   │  │ SELL 📉  │  │ HOLD ⏸️  │     │  ││
│  │  │ 85%      │  │ 72%      │  │ 45%      │     │  ││
│  │  │[Approve] │  │[Approve] │  │          │     │  ││
│  │  └──────────┘  └──────────┘  └──────────┘     │  ││
│  │                                                 │  ││
│  └─────────────────────────────────────────────────┘  ││
│                                                        ││
└────────────────────────────────────────────────────────┘│
```

### Components

#### 1. Connection Status Bar
- **Element:** Status bar
- **Height:** 48px
- **Background:** Green (connected) / Red (disconnected)
- **Content:**
  - WebSocket status indicator
  - Last alert timestamp
  - Reconnect button (if disconnected)

#### 2. Filters Panel
- **Element:** Card
- **Width:** 280px (desktop), 100% (mobile)
- **Fields:**
  - Strategy dropdown (All, BUY, SELL, HOLD)
  - Symbol search input
  - Date range picker
  - Apply button

#### 3. Market Alerts Grid
- **Element:** Responsive grid
- **Columns:** 3 (desktop), 2 (tablet), 1 (mobile)
- **Gap:** 1rem
- **Auto-updates:** Real-time via WebSocket

#### 4. Alert Card (Detailed)
```
┌─────────────────────────────┐
│ BTC/USD                     │
│ ─────────────────────────── │
│ Current Price: $45,234.56   │
│ Strategy: BUY 📈            │
│ Confidence: 85%             │
│ ─────────────────────────── │
│ Reason:                     │
│ "Strong upward momentum     │
│  detected. RSI oversold."   │
│ ─────────────────────────── │
│ Timestamp: 2m ago           │
│                             │
│ [Approve Trade] [Dismiss]   │
└─────────────────────────────┘
```

**Card States:**
- **Default:** White background
- **BUY:** Green left border
- **SELL:** Red left border
- **HOLD:** Gray left border
- **Approved:** Green checkmark overlay
- **Dismissed:** Faded opacity

#### 5. Trading History Sidebar
- **Element:** Scrollable list
- **Width:** 300px (desktop), hidden (mobile)
- **Shows:** Last 20 alerts
- **Each item:**
  - Symbol
  - Strategy
  - Status (Approved/Pending/Dismissed)
  - Timestamp

#### 6. Trade Approval Modal
```
┌─────────────────────────────────┐
│  Approve Trade                 │
│  ─────────────────────────────  │
│                                 │
│  Symbol: BTC/USD                │
│  Action: BUY                    │
│  Price: $45,234.56              │
│  Confidence: 85%                │
│                                 │
│  Reason:                        │
│  Strong upward momentum         │
│  detected. RSI oversold.        │
│                                 │
│  ⚠️ This will send a signal to  │
│  the Temporal workflow.         │
│                                 │
│  [Cancel]  [Confirm Approval]   │
│                                 │
└─────────────────────────────────┘
```

### Interactions

| Element | Event | Action | Feedback |
|---------|-------|--------|----------|
| Alert Card | Click | Expand to show full details | Card expands |
| Approve Button | Click | Open approval modal | Modal appears |
| Confirm Approval | Click | Send signal to backend | Success toast + card updates |
| Dismiss Button | Click | Hide alert | Card fades out |
| Filter Dropdown | Change | Filter alerts | Grid updates |
| Search Input | Type | Filter by symbol | Grid updates (debounced) |
| Reconnect Button | Click | Reconnect WebSocket | Status updates |
| History Item | Click | Scroll to alert in grid | Alert highlights |

### Real-Time Updates

**WebSocket Events:**
```javascript
// New alert arrives
{
  "type": "market_alert",
  "data": {
    "symbol": "BTC/USD",
    "price": 45234.56,
    "strategy": "BUY",
    "confidence": 85,
    "reason": "Strong upward momentum",
    "timestamp": "2025-12-29T07:30:00Z"
  }
}
```

**UI Response:**
1. New alert card appears at top of grid
2. Notification sound plays (if enabled)
3. Browser notification (if permitted)
4. If strategy is BUY/SELL, highlight card
5. Update "Last Alert" timestamp

### Accessibility

- **Keyboard navigation:** Tab through alerts, Enter to approve
- **Screen reader:** Announces new alerts
- **ARIA live region:** For real-time updates
- **Focus management:** Modal traps focus

---

## 📄 Page 4: Builder Page

**Route:** `/builder`  
**Auth Required:** Yes  
**Layout:** Split-screen (50/50)

### Visual Layout
```
┌──────────────────────────────────────────────────────────┐
│ [Nav Bar]                                                │
├──────────────────────────────────────────────────────────┤
│                          │                               │
│  Prompt Input            │  File Structure & Preview     │
│  ─────────────           │  ─────────────────────        │
│                          │                               │
│  ┌────────────────────┐  │  ┌──────────────────────┐    │
│  │ Describe your app: │  │  │ 📁 my-todo-app       │    │
│  │                    │  │  │  ├─ 📁 src           │    │
│  │ [Text area with    │  │  │  │  ├─ 📄 App.tsx    │ ◄──│
│  │  placeholder text] │  │  │  │  ├─ 📄 index.tsx  │    │
│  │                    │  │  │  ├─ 📁 components    │    │
│  │                    │  │  │  ├─ 📄 package.json  │    │
│  │                    │  │  │  └─ 📄 README.md     │    │
│  │                    │  │  └──────────────────────┘    │
│  │                    │  │                               │
│  │                    │  │  ┌──────────────────────┐    │
│  │                    │  │  │ // App.tsx           │    │
│  │                    │  │  │                      │    │
│  │                    │  │  │ import React from... │    │
│  │                    │  │  │                      │    │
│  │                    │  │  │ function App() {     │    │
│  │                    │  │  │   return (           │    │
│  │                    │  │  │     <div>...</div>   │    │
│  │                    │  │  │   );                 │    │
│  │                    │  │  │ }                    │    │
│  │                    │  │  │                      │    │
│  │                    │  │  │ [Copy] [Download]    │    │
│  └────────────────────┘  │  └──────────────────────┘    │
│                          │                               │
│  Framework: [React ▼]    │                               │
│  [Generate App]          │                               │
│                          │                               │
└──────────────────────────────────────────────────────────┘
```

### Components

#### 1. Prompt Input Panel (Left)
- **Width:** 50% (desktop), 100% (mobile, stacked)
- **Padding:** 2rem

**Elements:**
- **Textarea:**
  - Placeholder: "Describe the app you want to build... (e.g., 'A todo list app with React and TypeScript')"
  - Min height: 200px
  - Auto-resize: Yes
  - Max length: 1000 characters
  - Character counter: Bottom right

- **Framework Dropdown:**
  - Options: React, Vue, Svelte, Next.js, Vanilla JS
  - Default: React
  - Width: 200px

- **Generate Button:**
  - Text: "Generate App"
  - Size: Large
  - Width: 100%
  - Disabled: If prompt is empty
  - Loading state: Shows spinner + "Generating... (2s)"

#### 2. File Tree Panel (Right Top)
- **Width:** 50% (desktop)
- **Height:** 40%
- **Background:** Light gray

**File Tree Component:**
```
📁 my-todo-app
├─ 📁 src
│  ├─ 📄 App.tsx          ◄── Selected (highlighted)
│  ├─ 📄 index.tsx
│  ├─ 📄 TodoList.tsx
│  └─ 📄 TodoItem.tsx
├─ 📁 public
│  └─ 📄 index.html
├─ 📄 package.json
├─ 📄 tsconfig.json
└─ 📄 README.md
```

**Interactions:**
- Click folder: Expand/collapse
- Click file: Show in code preview
- Hover: Highlight
- Selected file: Blue background

#### 3. Code Preview Panel (Right Bottom)
- **Width:** 50% (desktop)
- **Height:** 60%
- **Background:** Dark (code editor theme)

**Elements:**
- **File name tab:**
  - Shows selected file name
  - Close button (X)

- **Code editor:**
  - Syntax highlighting (Prism.js or Shiki)
  - Line numbers
  - Read-only
  - Scroll: Vertical and horizontal

- **Action buttons:**
  - Copy button: Copies code to clipboard
  - Download button: Downloads file
  - Position: Top right

#### 4. Loading State (During Generation)
```
┌─────────────────────────────┐
│                             │
│     ⏳ Generating App...     │
│                             │
│     [Progress Spinner]      │
│                             │
│     This takes about 2s     │
│                             │
└─────────────────────────────┘
```

- **Overlay:** Semi-transparent
- **Position:** Center of screen
- **Animation:** Spinner rotates
- **Text:** "Generating your app..."
- **Subtext:** "This takes about 2 seconds"

#### 5. Empty State (Before Generation)
```
┌─────────────────────────────┐
│                             │
│     📝 No App Generated     │
│                             │
│     Enter a prompt and      │
│     click "Generate App"    │
│     to see the file         │
│     structure               │
│                             │
└─────────────────────────────┘
```

### Interactions

| Element | Event | Action | Feedback |
|---------|-------|--------|----------|
| Textarea | Type | Update character count | Count updates |
| Framework Dropdown | Change | Update selected framework | Dropdown closes |
| Generate Button | Click | Call builder API | Loading state appears |
| API Success | - | Display file tree + code | Loading disappears |
| API Error | - | Show error message | Error toast |
| File Tree Folder | Click | Expand/collapse | Folder icon changes |
| File Tree File | Click | Load file content | Code preview updates |
| Copy Button | Click | Copy code to clipboard | "Copied!" tooltip |
| Download Button | Click | Download file | File downloads |

### User Flow

```
1. User enters prompt
2. User selects framework (optional)
3. User clicks "Generate App"
4. Loading state appears (2s)
5. API returns file structure
6. File tree displays on right
7. First file auto-selected
8. Code preview shows file content
9. User can:
   - Click other files to view
   - Copy code
   - Download files
   - Generate new app (clears previous)
```

### Responsive Behavior

**Desktop (>1024px):**
- 50/50 split screen
- Both panels visible

**Tablet (768px - 1024px):**
- 40/60 split
- Smaller prompt panel

**Mobile (<768px):**
- Stacked layout
- Prompt panel on top
- File tree + preview below
- Tabs to switch between tree and preview

---

## 📄 Page 5: Chat Page

**Route:** `/chat`  
**Auth Required:** Yes  
**Layout:** Full-height chat interface

### Visual Layout
```
┌──────────────────────────────────────────────────────────┐
│ [Nav Bar]                                                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Chat with Nexus AI                                 │ │
│  │ ────────────────────────────────────────────────── │ │
│  │                                                    │ │
│  │  [User Message]                                    │ │
│  │  Hello! Can you help me with trading?             │ │
│  │                                          [You] 2m  │ │
│  │                                                    │ │
│  │                        [Assistant Message]         │ │
│  │  Of course! I can help you with crypto trading.   │ │
│  │  What would you like to know?                     │ │
│  │  [AI] 2m                                          │ │
│  │                                                    │ │
│  │  [User Message]                                    │ │
│  │  What's the best strategy for BTC?                │ │
│  │                                          [You] 1m  │ │
│  │                                                    │ │
│  │                        [Assistant Typing...]       │ │
│  │  ● ● ●                                            │ │
│  │                                                    │ │
│  │                                                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ [Type your message...]                   [Send 📤] │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Components

#### 1. Chat Header
- **Height:** 64px
- **Background:** White
- **Border bottom:** 1px solid gray
- **Content:**
  - Title: "Chat with Nexus AI"
  - Clear history button (right)

#### 2. Message List
- **Height:** calc(100vh - 200px)
- **Overflow:** Auto-scroll
- **Auto-scroll:** To bottom on new message
- **Padding:** 1rem

**User Message:**
```
┌─────────────────────────────┐
│ Hello! Can you help me?     │
│                             │
│ [You] 2 minutes ago         │
└─────────────────────────────┘
```
- **Alignment:** Right
- **Background:** Blue
- **Color:** White
- **Max width:** 70%
- **Border radius:** 1rem (rounded left)

**Assistant Message:**
```
┌─────────────────────────────┐
│ Of course! I'm here to help.│
│                             │
│ [AI] 2 minutes ago          │
└─────────────────────────────┘
```
- **Alignment:** Left
- **Background:** Light gray
- **Color:** Dark gray
- **Max width:** 70%
- **Border radius:** 1rem (rounded right)
- **Markdown:** Supported (bold, italic, code, lists)

#### 3. Typing Indicator
```
┌─────────────────────────────┐
│ ● ● ●                       │
│ AI is typing...             │
└─────────────────────────────┘
```
- **Animation:** Dots bounce
- **Alignment:** Left
- **Appears:** When streaming starts
- **Disappears:** When streaming completes

#### 4. Message Input
- **Height:** 80px
- **Background:** White
- **Border top:** 1px solid gray
- **Padding:** 1rem

**Elements:**
- **Textarea:**
  - Placeholder: "Type your message..."
  - Auto-resize: Yes (max 5 lines)
  - Keyboard: Enter to send, Shift+Enter for new line

- **Send Button:**
  - Icon: 📤
  - Position: Right
  - Disabled: If message is empty or streaming
  - Loading: Shows spinner while streaming

#### 5. Code Block (in messages)
```
┌─────────────────────────────┐
│ Here's an example:          │
│                             │
│ ┌─────────────────────────┐ │
│ │ const x = 10;           │ │
│ │ console.log(x);         │ │
│ │                         │ │
│ │ [Copy]                  │ │
│ └─────────────────────────┘ │
│                             │
│ [AI] 1 minute ago           │
└─────────────────────────────┘
```
- **Background:** Dark
- **Syntax highlighting:** Yes
- **Copy button:** Top right
- **Language label:** Top left

### Interactions

| Element | Event | Action | Feedback |
|---------|-------|--------|----------|
| Message Input | Type | Enable send button | Button color changes |
| Send Button | Click | Send message + start streaming | Input clears, typing indicator appears |
| Enter Key | Press | Send message | Same as send button |
| Shift+Enter | Press | New line | Cursor moves to new line |
| Clear History | Click | Clear all messages | Confirmation modal → messages clear |
| Copy Button (code) | Click | Copy code to clipboard | "Copied!" tooltip |
| Message | Hover | Show timestamp | Timestamp appears |

### Streaming Effect

**How it works:**
1. User sends message
2. User message appears immediately
3. Typing indicator appears
4. API starts streaming chunks
5. Each chunk appends to assistant message
6. Text appears character by character (typing effect)
7. When complete, typing indicator disappears

**Implementation:**
```javascript
// Pseudo-code
let assistantMessage = '';
onChunk((chunk) => {
  assistantMessage += chunk;
  // Update UI with typing effect
  typeText(chunk, 50ms per character);
});
```

### Accessibility

- **Keyboard:** Tab to input, Enter to send
- **Screen reader:** Announces new messages
- **ARIA live region:** For message updates
- **Focus management:** Input stays focused

---

## 📄 Page 6: Agents Page

**Route:** `/agents`  
**Auth Required:** Yes  
**Layout:** Grid with create button

### Visual Layout
```
┌──────────────────────────────────────────────────────────┐
│ [Nav Bar]                                                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  My Agents                              [+ Create Agent] │
│  ──────────────────────────────────────────────────────  │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ 🤖       │  │ 🤖       │  │ 🤖       │              │
│  │ Bot Alpha│  │ Bot Beta │  │ Bot Gamma│              │
│  │          │  │          │  │          │              │
│  │ Status: ✅│  │ Status: ⏸️│  │ Status: 🔴│              │
│  │ ROI: 15% │  │ ROI: 8%  │  │ ROI: -2% │              │
│  │ Trades:  │  │ Trades:  │  │ Trades:  │              │
│  │ 127      │  │ 45       │  │ 12       │              │
│  │          │  │          │  │          │              │
│  │ [⏸️Pause] │  │ [▶️Resume]│  │ [🔄Restart]│              │
│  │ [⚙️Config]│  │ [⚙️Config]│  │ [⚙️Config]│              │
│  │ [🗑️Delete]│  │ [🗑️Delete]│  │ [🗑️Delete]│              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Components

#### 1. Page Header
- **Height:** 80px
- **Content:**
  - Title: "My Agents"
  - Create Agent button (right)

#### 2. Create Agent Button
- **Text:** "+ Create Agent"
- **Variant:** Primary
- **Size:** Medium
- **Action:** Opens create agent modal

#### 3. Agent Card
```
┌─────────────────────────┐
│ 🤖 Trading Bot Alpha    │
│ ─────────────────────── │
│ Type: Trading           │
│ Status: 🟢 Active       │
│ ─────────────────────── │
│ Performance:            │
│ ROI: +15.3%             │
│ Trades: 127             │
│ Success Rate: 85%       │
│ Uptime: 99.2%           │
│ ─────────────────────── │
│ Last Active: 2m ago     │
│ ─────────────────────── │
│ [⏸️ Pause]  [⚙️ Config]  │
│ [🗑️ Delete]              │
└─────────────────────────┘
```

**Card States:**
- **Active:** Green border
- **Paused:** Yellow border
- **Error:** Red border
- **Deploying:** Blue border + loading spinner

#### 4. Agent Details Modal
```
┌─────────────────────────────────────┐
│  Trading Bot Alpha            [✕]   │
│  ─────────────────────────────────  │
│                                     │
│  📊 Performance Metrics             │
│  ┌───────────────────────────────┐ │
│  │ [ROI Chart - Line graph]      │ │
│  └───────────────────────────────┘ │
│                                     │
│  📈 Recent Activity                 │
│  • BTC Buy at $45k - Success       │
│  • ETH Sell at $3.2k - Success     │
│  • SOL Hold - Skipped              │
│                                     │
│  ⚙️ Configuration                   │
│  Strategy: Momentum Trading         │
│  Risk Level: Medium                 │
│  Max Trade Size: $1000              │
│                                     │
│  [Edit Config]  [View Logs]         │
│                                     │
└─────────────────────────────────────┘
```

#### 5. Create Agent Modal (Multi-Step)
**Step 1: Select Type**
```
┌─────────────────────────────────────┐
│  Create New Agent - Step 1 of 3     │
│  ─────────────────────────────────  │
│                                     │
│  Select Agent Type:                 │
│                                     │
│  ┌─────────┐  ┌─────────┐          │
│  │ 📈      │  │ 📊      │          │
│  │ Trading │  │Analytics│          │
│  └─────────┘  └─────────┘          │
│                                     │
│  ┌─────────┐  ┌─────────┐          │
│  │ 💬      │  │ 🎨      │          │
│  │ Social  │  │ Custom  │          │
│  └─────────┘  └─────────┘          │
│                                     │
│  [Cancel]           [Next →]        │
│                                     │
└─────────────────────────────────────┘
```

**Step 2: Configure**
```
┌─────────────────────────────────────┐
│  Create New Agent - Step 2 of 3     │
│  ─────────────────────────────────  │
│                                     │
│  Agent Name:                        │
│  [Trading Bot Alpha_____]           │
│                                     │
│  Description:                       │
│  [Momentum trading bot for BTC___]  │
│                                     │
│  Strategy:                          │
│  [Momentum Trading ▼]               │
│                                     │
│  Risk Level:                        │
│  ○ Low  ● Medium  ○ High            │
│                                     │
│  [← Back]           [Next →]        │
│                                     │
└─────────────────────────────────────┘
```

**Step 3: Deploy**
```
┌─────────────────────────────────────┐
│  Create New Agent - Step 3 of 3     │
│  ─────────────────────────────────  │
│                                     │
│  Review & Deploy:                   │
│                                     │
│  Name: Trading Bot Alpha            │
│  Type: Trading                      │
│  Strategy: Momentum Trading         │
│  Risk: Medium                       │
│                                     │
│  ✅ Configuration looks good!        │
│                                     │
│  [← Back]           [Deploy Agent]  │
│                                     │
└─────────────────────────────────────┘
```

### Interactions

| Element | Event | Action | Feedback |
|---------|-------|--------|----------|
| Create Agent Button | Click | Open create modal (step 1) | Modal appears |
| Agent Type Card | Click | Select type, go to step 2 | Card highlights, modal updates |
| Next Button | Click | Validate & go to next step | Modal updates |
| Back Button | Click | Go to previous step | Modal updates |
| Deploy Button | Click | Create agent via API | Loading → Success → Modal closes |
| Agent Card | Click | Open details modal | Modal slides in |
| Pause Button | Click | Pause agent | Status updates to ⏸️ |
| Resume Button | Click | Resume agent | Status updates to 🟢 |
| Delete Button | Click | Show confirmation → Delete | Confirmation modal → Card removes |
| Config Button | Click | Open config modal | Modal appears |

---

## 📄 Page 7: Settings Page

**Route:** `/settings`  
**Auth Required:** Yes  
**Layout:** Tabbed sections

### Visual Layout
```
┌──────────────────────────────────────────────────────────┐
│ [Nav Bar]                                                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Settings                                                │
│  ──────────────────────────────────────────────────────  │
│                                                          │
│  [Profile] [Notifications] [Trading] [Appearance]        │
│  ────────                                                │
│                                                          │
│  👤 Profile                                              │
│  ┌────────────────────────────────────────────────────┐ │
│  │                                                    │ │
│  │  Wallet Address:                                   │ │
│  │  0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb        │ │
│  │  [Copy]                                            │ │
│  │                                                    │ │
│  │  Display Name:                                     │ │
│  │  [John Doe_________________]                       │ │
│  │                                                    │ │
│  │  Avatar:                                           │ │
│  │  [Upload Image]                                    │ │
│  │                                                    │ │
│  │  [Save Changes]                                    │ │
│  │                                                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Components

#### 1. Tabs
- **Tabs:** Profile, Notifications, Trading, Appearance
- **Active tab:** Underlined
- **Click:** Switch content

#### 2. Profile Tab
**Fields:**
- Wallet Address (read-only, with copy button)
- Display Name (text input)
- Avatar (file upload)
- Save Changes button

#### 3. Notifications Tab
**Toggles:**
- Browser notifications (on/off)
- Email notifications (on/off)
- Trade alerts (on/off)
- Agent alerts (on/off)
- Sound effects (on/off)

#### 4. Trading Tab
**Fields:**
- Auto-approve trades (toggle)
- Max trade size (number input)
- Risk tolerance (slider: Low/Medium/High)
- Default strategy (dropdown)

#### 5. Appearance Tab
**Options:**
- Theme (Light/Dark/Auto)
- Color scheme (dropdown)
- Font size (slider)
- Compact mode (toggle)

### Interactions

| Element | Event | Action | Feedback |
|---------|-------|--------|----------|
| Tab | Click | Switch to tab content | Tab highlights, content updates |
| Save Changes | Click | Save to localStorage | Success toast |
| Toggle | Click | Toggle on/off | Toggle animates |
| Copy Button | Click | Copy address | "Copied!" tooltip |
| Upload Image | Click | Open file picker | Image preview updates |

---

## 🎯 Summary

### Total Pages: 7
1. ✅ Login (/)
2. ✅ Dashboard (/dashboard)
3. ✅ Trading (/trading)
4. ✅ Builder (/builder)
5. ✅ Chat (/chat)
6. ✅ Agents (/agents)
7. ✅ Settings (/settings)

### Total Modals: 3
1. ✅ Trade Approval Modal
2. ✅ Agent Details Modal
3. ✅ Create Agent Modal (3 steps)

### Total Unique Components: 45+
- Navigation bar
- Buttons (5 variants)
- Cards (multiple types)
- Inputs (text, textarea, dropdown, toggle, slider)
- Modals
- File tree
- Code editor
- Chat messages
- Alert cards
- Agent cards
- Status indicators
- Loading states
- Empty states
- Error states

### Total Interactions: 100+
Every button, input, card, and element has been documented with:
- Visual specifications
- Interaction behavior
- Feedback mechanisms
- Accessibility features

---

**This document provides complete specifications for every page, component, button, and interaction in the Nexus Portal!** 🎨
