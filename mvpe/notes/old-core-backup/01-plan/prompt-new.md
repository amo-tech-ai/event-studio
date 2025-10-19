# Lovable AI: EventOS Chat Interface - UI/UX Design Prompt

**Project:** EventOS - AI-Powered Event Management
**Task:** Design and implement enhanced chat interface
**Focus:** User experience, visual design, workflows, and interaction patterns

---

## <¯ CORE OBJECTIVE

Transform the basic chat page into a professional, multi-panel interface where corporate event planners can:
- Have natural conversations with AI to create events
- Track multiple event conversations simultaneously
- See real-time event context while chatting
- Access conversation history across sessions
- Manage events through intuitive visual workflows

---

## =Ð VISUAL LAYOUT & STRUCTURE

### Three-Panel Desktop Layout

**LEFT PANEL - Conversation Manager (300px width)**
- Header: "Recent Conversations" with search icon
- List of conversation cards (scrollable)
- Each card shows:
  - Conversation title (truncated to 2 lines)
  - Last message preview (1 line, gray text)
  - Timestamp (relative: "2h ago", "Yesterday")
  - Event badge (if associated with event)
  - Unread indicator (blue dot)
- Active conversation highlighted with blue left border
- Bottom: Large "+ New Conversation" button (primary blue)
- Background: Light gray (muted)

**CENTER PANEL - Chat Area (Flexible width)**
- Header bar:
  - Current conversation title (editable on click)
  - Dropdown menu (rename, archive, delete)
  - Event badge (if applicable)
- Message area (scrollable, auto-scroll to bottom):
  - User messages: Blue bubbles aligned right
  - AI messages: White cards aligned left with avatar
  - Event preview cards: Full-width gradient cards
  - Tool indicators: Subtle gray boxes with icons
  - Timestamps: Show on hover
- Input area at bottom:
  - Multi-line text box (auto-expand)
  - Send button (always visible, blue when enabled)
  - Character counter (appears after 200 chars)

**RIGHT PANEL - Event Context (350px width)**
- Header: "Event Details" with collapse button
- Event summary card:
  - Event name (large heading)
  - Date/time with calendar icon
  - Location with map pin icon
  - Capacity bar (visual progress: 45/200 sold)
  - Status badge (Draft/Published/Live)
- Quick action buttons (stacked):
  - "View Landing Page" (opens new tab)
  - "Edit Event" (opens modal)
  - "Share Event" (copy link)
- AI Tasks section:
  - "Generated Tasks" heading
  - List of 5 recent tasks with status icons:
    - ó Pending (gray)
    - = In Progress (blue)
    -  Done (green)
  - "See All Tasks" link at bottom

### Responsive Behavior

**Tablet (768px - 1279px):**
- Hide right panel (event context)
- Add floating "Event Details" button (bottom-right corner)
- Button click: Slide-in drawer from right with event context
- Sidebar remains visible (can be collapsed with hamburger)

**Mobile (<768px):**
- Hide both side panels
- Show hamburger menu (top-left) for conversation list
- Show event details icon (top-right) for event context
- Full-width chat area
- Bottom navigation: Back | New Chat | Menu

---

## <¨ VISUAL DESIGN SYSTEM

### Color Palette
- **Primary Blue:** Main actions, active states, user messages
- **Neutral Gray:** Backgrounds, secondary text, borders
- **Success Green:** Completed tasks, success messages
- **Warning Amber:** Pending tasks, alerts
- **Error Red:** Failed actions, delete confirmations
- **Gradient Accent:** Event cards (blue to purple gradient)

### Typography
- **Headings:** Bold, dark gray, larger spacing
- **Body Text:** Regular weight, comfortable line height (1.6)
- **Timestamps:** Small, light gray, uppercase
- **User Messages:** White text on blue background
- **AI Messages:** Dark text on white/gray background

### Spacing & Layout
- **Panel Padding:** 16px internal, 24px for main content
- **Card Spacing:** 12px between conversation cards
- **Message Spacing:** 16px between messages
- **Section Gaps:** 24px between major sections
- **Border Radius:** 8px for cards, 12px for message bubbles

### Icons & Visual Elements
- Calendar icon for dates
- Map pin for locations
- Users icon for capacity
- Clock for time
- Check circle for completed items
- Alert circle for pending items
- Tool icons: Sparkle (AI), Edit (update), Plus (create)

---

## =e USER WORKFLOWS & JOURNEYS

### Workflow 1: First-Time Event Creation

**Entry Point:** User clicks "Chat" in main navigation

**Step 1: Welcome Screen**
- Empty chat area with centered welcome message
- "How can I help you create your event today?" heading
- 4 suggested prompt cards (clickable):
  - "Create a corporate conference for 200 people"
  - "Plan a team building workshop"
  - "Organize a product launch event"
  - "Set up a networking mixer"
- Sidebar shows "+ New Conversation" only

**Step 2: Initial Conversation**
- User clicks suggested prompt or types message
- Message appears in chat as blue bubble (right-aligned)
- AI typing indicator appears (3 animated dots)
- AI response appears as white card (left-aligned)
- AI asks clarifying questions in friendly tone

**Step 3: Event Details Collection**
- User provides: Event name, date, location, capacity
- AI shows visual confirmation after each detail:
  - " Event name: Tech Conference 2025"
  - " Date: March 15, 2025"
  - " Location: Toronto Convention Centre"
- Tool indicator appears: "= Searching available venues..."

**Step 4: Event Creation**
- AI creates event (tool indicator shows progress)
- Event preview card appears in chat:
  - Gradient background (blue to purple)
  - Event name (bold, large)
  - Date, time, location with icons
  - Capacity visualization (0/200 sold)
  - "View Details" button
- Right panel activates with event context

**Step 5: Next Steps**
- AI suggests: "Would you like to add ticket tiers?"
- User can continue conversation or start new one
- Conversation saved automatically

**Visual Flow:**
```
Welcome ’ Suggested Prompts ’ Chat Begins ’ Details Collected ’
Event Created ’ Preview Card ’ Event Context Panel ’ Continue Chat
```

### Workflow 2: Returning User Resume

**Entry Point:** User navigates to /chat

**Step 1: Load Last Conversation**
- Page loads with last active conversation
- Sidebar shows recent conversations (most recent first)
- Chat area displays full message history
- Scroll position: Bottom (most recent messages)
- Right panel shows last discussed event

**Step 2: Context Recognition**
- User can scroll up to review previous messages
- Hover over messages reveals timestamps
- Event preview cards remain interactive
- AI remembers all previous context

**Step 3: Continue Conversation**
- User types new message
- AI responds with full context awareness
- Example: "For your Tech Conference 2025, I can..."
- No need to repeat event details

**Step 4: Switch Conversations**
- User clicks different conversation in sidebar
- Smooth transition animation (fade out/in)
- Chat area clears and loads new messages
- Right panel updates to new event context
- URL updates: /chat?conversation=abc123

**Visual Flow:**
```
Page Load ’ Last Conversation ’ Review History ’
New Message ’ AI Context Response ’ Switch Conversation ’ Repeat
```

### Workflow 3: Multi-Event Management

**Entry Point:** User managing 5 active events

**Step 1: Conversation Overview**
- Sidebar shows all 5 conversations
- Each labeled with event name
- Timestamps show last activity
- Unread indicators on new messages

**Step 2: Quick Search**
- User clicks search icon in sidebar
- Search input appears at top
- User types "conference"
- List filters to show only matching conversations
- Results highlight matching text

**Step 3: Rapid Switching**
- User clicks Q1 Sales Kickoff conversation
- Event context panel loads Q1 event details
- User asks: "How many tickets sold?"
- AI responds with real-time data from database
- User clicks Product Launch conversation
- Context switches instantly (no page reload)

**Step 4: Task Management**
- User views AI tasks in right panel
- Sees 3 pending tasks for current event
- Clicks "See All Tasks" link
- Modal opens with full task checklist
- User can check off completed items

**Step 5: Export & Share**
- User clicks menu on conversation
- Selects "Export Conversation"
- Markdown file downloads
- Contains full conversation + event details
- User shares with team via email

**Visual Flow:**
```
Dashboard ’ Multiple Conversations ’ Search/Filter ’
Rapid Switching ’ Event Context Updates ’ Task Review ’
Export Conversation
```

---

## =¼ SCREEN WIREFRAMES

### Screen 1: Empty State (First Visit)

```
                                                              
  [0] EventOS Chat                           [@Profile] [™]  
              ,                                              $
                                                            
  Recent           How can I help you create your event?   
  Convos                                                    
  ________         [Card: Create corporate conference]     
                   [Card: Plan team building workshop]     
  (empty)          [Card: Organize product launch]         
                   [Card: Set up networking mixer]         
                                                            
                                                            
  [+ New]          Type a message or click suggestion...   
                   [Send]                                   
              4                                              
```

### Screen 2: Active Conversation with Event

```
                                                                      
  [0] EventOS Chat                                [@Profile] [™]     
              ,                          ,                         $
               Tech Conference 2025 [v]   Event Details    []   
  Recent                                                         
  Convos                                  Tech Conference 2025   
  ________                                =Å Mar 15, 2025        
                [AI] Great! I've          =Í Toronto Centre      
  [Ï] Tech      created your event...     =e 45/200 [ˆˆˆˆ‘‘]     
  Conference                              =â Published           
  2h ago        [Event Preview Card]                             
                [Gradient Card with       [View Landing Page]    
                 Event Details]           [Edit Event]           
  Product                                 [Share Event]          
  Launch        [User] Add VIP                                   
  Yesterday     ticket tier               AI Tasks               
                                           Event created       
  Workshop      [AI] I'll add a VIP        Landing page live   
  3d ago        tier for you...           ó Send invitations    
                                          ó Book catering       
  [+ New]       [Type message...] [’]     [See All Tasks]        
              4                          4                         
```

### Screen 3: Mobile View

```
                         
 [0] Tech Conf [=Ë] [î] 
                         $
                         
  [AI] Great! I've       
  created your event...  
                         
  [Event Preview Card]   
  [Gradient Background]  
  - Tech Conference      
  - Mar 15, 2025         
  - Toronto              
                         
         [User] Add VIP  
         ticket tier     
                         
  [AI] I'll add a VIP    
  tier for you...        
                         
  [Tool: Creating...]    
                         
                         $
 [Type message...] [’]   
                         
```

---

## ¡ KEY FEATURES & FUNCTIONS

### 1. Conversation Persistence
**What:** Messages and conversations saved automatically
**Why:** Users never lose work, can return anytime
**How It Works:**
- Every message saved to database immediately
- Conversation history loads on page visit
- No manual "save" required
- Works across devices (same login)

### 2. Intelligent Context Tracking
**What:** System knows which event is being discussed
**Why:** AI provides relevant responses without repetition
**How It Works:**
- When event created, conversation links to event ID
- Right panel always shows current event context
- AI references event details automatically
- Users can discuss multiple events by switching conversations

### 3. Real-Time Event Updates
**What:** Event details update instantly in right panel
**Why:** Users see changes without page refresh
**How It Works:**
- When AI modifies event, panel refreshes
- Ticket sales counter updates in real-time
- Status badges change automatically (Draft ’ Published)
- Visual feedback confirms all actions

### 4. Multi-Conversation Management
**What:** Users can have parallel event conversations
**Why:** Event planners work on multiple events simultaneously
**How It Works:**
- Each event gets its own conversation thread
- Sidebar shows all active conversations
- Click to switch, context updates instantly
- No data mixing between conversations

### 5. Message Actions & Interactions
**What:** Users can interact with messages after sending
**Why:** Mistakes happen, users want to refine prompts
**Actions Available:**
- Copy message text to clipboard
- Edit user's own message (triggers new AI response)
- Regenerate AI response (try again)
- Delete message (with confirmation)

### 6. Visual Tool Indicators
**What:** Show when AI is using specific tools/functions
**Why:** Users understand what AI is doing behind the scenes
**Examples:**
- "= Searching venues in Toronto..."
- "=Å Creating event in calendar..."
- "<« Adding VIP ticket tier..."
- "< Generating landing page..."
- " Event created successfully!"

### 7. Search & Filter Conversations
**What:** Find specific conversations quickly
**Why:** Users with many events need fast access
**Functions:**
- Text search (matches event names, messages)
- Filter by status (Active Events, Archived, All)
- Sort by date (Newest First, Oldest First)
- Results highlight matching text

### 8. Suggested Prompts (Empty State)
**What:** Pre-written examples to get started
**Why:** New users may not know what to ask
**Examples:**
- "Create a corporate conference for 200 attendees"
- "Plan a team building workshop for 50 people"
- "Organize a product launch with VIP tickets"
- "Set up a networking mixer at downtown venue"

### 9. Event Quick Actions
**What:** One-click buttons for common tasks
**Why:** Fast access without typing commands
**Actions:**
- View Landing Page (opens in new tab)
- Edit Event Details (opens modal)
- Share Event (copy link + social)
- Download Tasks (export checklist)

### 10. Responsive Design
**What:** Interface adapts to screen size
**Why:** Users access on desktop, tablet, mobile
**Breakpoints:**
- Desktop (1280px+): All 3 panels visible
- Tablet (768-1279px): Sidebar + Chat, event drawer
- Mobile (<768px): Chat only, hamburger menus

---

## <¬ INTERACTION PATTERNS

### Message Send Flow
1. User types in input box
2. Input expands up to 200px height (auto-grow)
3. Character counter appears after 200 characters
4. User presses Enter (or clicks Send button)
5. Message appears immediately as blue bubble (right)
6. Message saved to database (background)
7. AI typing indicator appears (3 animated dots)
8. AI response streams in word-by-word
9. Final response saved to database
10. If event created/updated, right panel refreshes

### Conversation Switch Flow
1. User clicks conversation in sidebar
2. Active conversation fades out (200ms)
3. URL updates to new conversation ID
4. New messages load from database
5. Chat area fades in with new messages (200ms)
6. Right panel updates to new event context (if applicable)
7. Scroll position: Bottom (most recent message)

### Event Creation Flow
1. User describes event in natural language
2. AI asks clarifying questions (iterative)
3. Each detail confirmed with checkmark visual
4. Tool indicator shows: "Creating event..."
5. Event preview card appears in chat (gradient)
6. Right panel activates with event details
7. AI suggests next steps (add tickets, publish)

### Search Flow
1. User clicks search icon in sidebar
2. Search input slides in from top (animation)
3. User types search term
4. Results filter in real-time (debounced 300ms)
5. Matching text highlighted in yellow
6. Click result to load conversation
7. Search closes, conversation loads

### Mobile Menu Flow
1. User taps hamburger icon (top-left)
2. Sidebar slides in from left (overlay)
3. Dark backdrop appears behind
4. User selects conversation
5. Sidebar slides out
6. Conversation loads in main area

---

## <¯ SUCCESS METRICS

**This design is successful when:**

 **User Can Start Chatting in <10 seconds**
- No complex setup or tutorials required
- Suggested prompts guide first interaction
- First message leads to productive conversation

 **Conversation Feels Natural & Continuous**
- History loads instantly on return
- AI remembers previous context
- No repetition of information needed

 **Multi-Event Management is Effortless**
- Switch between events in <2 clicks
- Event context always visible and accurate
- Search finds conversations in <1 second

 **Mobile Experience is Smooth**
- All core features work on small screens
- Touch targets are finger-friendly (44px min)
- No horizontal scrolling required

 **Visual Feedback is Clear**
- Users always know what AI is doing (tool indicators)
- Loading states prevent confusion
- Success/error messages are obvious

 **Interface Feels Professional**
- Clean, modern design matching corporate use case
- Consistent spacing and typography
- Delightful micro-interactions (smooth animations)

---

## =Ë IMPLEMENTATION PRIORITY

### Phase 1: Core Layout (Must Have)
- Three-panel structure (sidebar, chat, event context)
- Conversation list with recent items
- Message display area with scrolling
- Basic input box with send button
- Event context panel with details

### Phase 2: Persistence (Must Have)
- Save messages to database
- Load conversation history on mount
- Create new conversations automatically
- Link conversations to events
- Track current event context

### Phase 3: Polish (Should Have)
- Search and filter conversations
- Message actions (copy, edit, delete)
- Tool call indicators
- Suggested prompts for empty state
- Responsive mobile layout

### Phase 4: Advanced (Nice to Have)
- Export conversation to markdown
- Keyboard shortcuts (Cmd+K, Cmd+N)
- Real-time collaboration
- Voice input
- Conversation templates

---

## <¨ DESIGN PRINCIPLES

**1. Clarity Over Cleverness**
- Every element has a clear purpose
- No hidden features or mystery buttons
- Visual hierarchy guides attention

**2. Speed & Responsiveness**
- Instant feedback on all actions
- Optimistic UI updates (don't wait for server)
- Loading states for async operations

**3. Context Awareness**
- System knows what event is being discussed
- AI responses reference relevant details
- Right panel always shows current context

**4. Progressive Disclosure**
- Show essential features first
- Advanced options in menus/modals
- Don't overwhelm with choices

**5. Mobile-First Thinking**
- Core features work on any screen size
- Touch-friendly targets and gestures
- Simplified layouts for small screens

---

## =€ EXPECTED OUTCOME

After implementing this design, EventOS chat will provide:

( **Professional ChatGPT-like experience** for corporate event planning
( **Seamless conversation persistence** across sessions and devices
( **Intuitive multi-event management** with instant context switching
( **Clear visual feedback** on AI actions and event status
( **Responsive design** working perfectly on all devices
( **Delightful user experience** with smooth animations and micro-interactions

**Result:** Event planners can create and manage corporate events through natural conversation with AI, track multiple events simultaneously, and access full conversation historyall in a polished, professional interface that rivals the best AI chat applications.

---

**Created:** October 11, 2025
**For:** EventOS MVP Enhancement
**Focus:** UI/UX Design & User Experience
**Status:** Ready for Lovable AI Implementation 
