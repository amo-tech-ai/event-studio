# 🎨 Lovable Design Prompt Template

## 🗓️ Date: 2025-01-18
## 📍 Location: `/home/sk/event-studio/copilotkit-langgraph/copilotkit-docs/lovable/`

---

## 🚀 **Ready-to-Use Lovable Prompts**

### **Prompt Template for EventOS AI Event Wizard**

```
Generate a clean, intelligent, and complete **UI/UX design** for the EventOS AI Event Wizard using CopilotKit LangGraph integration.

## 🎯 **Project Context**
- **Platform**: EventOS - AI-powered event management platform
- **Tech Stack**: Vite + React + TypeScript + shadcn-ui + Tailwind CSS
- **AI Integration**: CopilotKit LangGraph with conversational AI
- **Database**: Supabase (PostgreSQL, Auth, Storage)
- **Design System**: Match existing EventOS components and styling

## 📋 **Design Requirements**

### **Visual Design Standards**
- **Consistent with EventOS**: Match existing shadcn-ui components and Tailwind CSS
- **Modern AI Interface**: Clean, intelligent design that feels futuristic yet approachable
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Accessibility**: WCAG 2.1 AA compliance with proper contrast and keyboard navigation
- **Performance**: Fast loading with smooth animations and transitions

### **Component Library**
- **shadcn-ui Components**: Button, Card, Input, Badge, Progress, Dialog, Sheet
- **Custom AI Components**: Chat interface, progress indicators, agent status
- **EventOS Components**: Existing design system integration
- **CopilotKit Components**: Seamless AI integration styling

## 🏗️ **Page Structure & Components**

### **Main Event Wizard Page (`/event-wizard`)**

#### **Layout Structure**
```
┌─────────────────────────────────────────────────────────┐
│ Header: EventOS Navigation + AI Wizard Title           │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────────────────────┐ │
│ │   Chat Panel    │ │      Event Summary Panel       │ │
│ │   (Left 60%)    │ │        (Right 40%)             │ │
│ │                 │ │                                 │ │
│ │ • AI Chat       │ │ • Event Details                │ │
│ │ • Suggestions   │ │ • Progress Tracking            │ │
│ │ • Quick Actions │ │ • Form Previews                │ │
│ │                 │ │ • Checkpoint Status            │ │
│ └─────────────────┘ └─────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ Footer: EventOS Footer                                 │
└─────────────────────────────────────────────────────────┘
```

#### **Chat Panel Components**
- **AI Chat Interface**: Modern chat bubbles with typing indicators
- **Quick Suggestions**: Pre-built prompts for common tasks
- **Progress Indicators**: Visual wizard step tracking
- **Agent Status**: Real-time AI agent activity indicators
- **Input Area**: Smart text input with voice support

#### **Event Summary Panel Components**
- **Event Preview Card**: Live event details as they're created
- **Form Integration**: Real-time form updates from chat
- **Checkpoint Status**: Save/resume functionality indicators
- **Quick Actions**: One-click access to common tasks
- **Validation Status**: Real-time form validation feedback

## 🎨 **Component Design Specifications**

### **AI Chat Interface Components**

#### **Chat Message Bubbles**
- **User Messages**: Right-aligned, primary color background
- **AI Messages**: Left-aligned, subtle background with AI indicator
- **Typing Indicator**: Animated dots with AI avatar
- **Quick Actions**: Inline buttons for common responses
- **Message Status**: Read, delivered, processing indicators

#### **AI Agent Status Indicators**
- **Active Agent**: Green pulsing dot with "AI is thinking..."
- **Processing**: Spinning loader with progress percentage
- **Idle**: Gray dot with "AI is ready"
- **Error State**: Red dot with retry option
- **Multi-Agent**: Multiple agent status indicators

#### **Smart Input Components**
- **Text Input**: Auto-expanding textarea with smart suggestions
- **Voice Input**: Microphone button with voice-to-text
- **Quick Prompts**: Pre-built suggestion chips
- **File Upload**: Drag-and-drop for images and documents
- **Emoji Picker**: Quick emoji selection for responses

### **Event Summary Components**

#### **Event Preview Card**
- **Event Title**: Large, prominent heading
- **Date & Time**: Clear date/time display with timezone
- **Location**: Venue name with address and map link
- **Status Badge**: Draft, Published, Live status indicators
- **Progress Bar**: Visual completion percentage
- **Quick Actions**: Edit, Preview, Share buttons

#### **Form Integration Cards**
- **Real-time Updates**: Live form field updates from chat
- **Validation Status**: Green checkmarks for completed fields
- **Missing Fields**: Red indicators for required information
- **Smart Suggestions**: AI-powered field completion
- **Auto-save**: Subtle save indicators and timestamps

## 📱 **Responsive Design Specifications**

### **Mobile Layout (< 640px)**
- **Single Column**: Stack chat and summary panels vertically
- **Touch-Friendly**: Large touch targets (44px minimum)
- **Swipe Navigation**: Swipe between wizard steps
- **Collapsible Panels**: Expandable sections for space efficiency
- **Bottom Navigation**: Fixed bottom navigation for easy access

### **Tablet Layout (640px - 1024px)**
- **Two Column**: Side-by-side chat and summary panels
- **Touch Optimization**: Medium-sized touch targets
- **Modal Overlays**: Full-screen modals for detailed views
- **Sidebar Navigation**: Collapsible sidebar for navigation
- **Grid Layouts**: 2-column grids for venue and ticket cards

### **Desktop Layout (> 1024px)**
- **Three Column**: Chat, summary, and details panels
- **Hover States**: Rich hover interactions and tooltips
- **Keyboard Navigation**: Full keyboard accessibility
- **Multi-Window**: Support for multiple browser windows
- **Advanced Interactions**: Drag-and-drop, keyboard shortcuts

## 🎨 **Visual Design System**

### **Color Palette**
- **Primary**: EventOS brand colors (maintain consistency)
- **AI Accent**: Subtle blue/green for AI elements
- **Success**: Green for completed states
- **Warning**: Orange for pending states
- **Error**: Red for error states
- **Neutral**: Gray scale for text and backgrounds

### **Typography**
- **Headings**: Bold, clear hierarchy
- **Body Text**: Readable, accessible font sizes
- **AI Text**: Slightly different styling for AI responses
- **Code**: Monospace for technical information
- **Captions**: Smaller text for metadata

### **Spacing & Layout**
- **Consistent Spacing**: 8px grid system
- **Card Padding**: 16px internal padding
- **Section Spacing**: 24px between major sections
- **Component Spacing**: 12px between related components
- **Edge Spacing**: 16px from screen edges

### **Shadows & Elevation**
- **Cards**: Subtle shadows for depth
- **Modals**: Stronger shadows for overlay effect
- **Hover States**: Slightly elevated shadows
- **Active States**: Pressed shadow effects
- **AI Elements**: Subtle glow effects

## 🚀 **User Journey & Interactions**

### **Primary User Flow**
1. **Landing**: User arrives at Event Wizard
2. **Chat Initiation**: User starts conversation with AI
3. **Event Basics**: AI collects basic event information
4. **Venue Selection**: AI helps find and select venue
5. **Ticketing Setup**: AI assists with pricing and tickets
6. **Agenda Building**: AI creates event agenda
7. **Marketing Setup**: AI generates marketing content
8. **Review & Publish**: Final review and event publication

### **Secondary Flows**
- **Resume Session**: User returns to continue event creation
- **Modify Details**: User wants to change previous decisions
- **Get Help**: User needs assistance or clarification
- **Save Draft**: User wants to save progress and return later
- **Share Preview**: User wants to share event with stakeholders

## 🧪 **Testing Checklist**

For each page before marking complete:

**Visual Design:**
- [ ] Matches existing EventOS page styles
- [ ] Consistent spacing and colors
- [ ] Typography hierarchy is clear
- [ ] Icons display correctly

**Responsiveness:**
- [ ] Mobile layout works (< 640px)
- [ ] Tablet layout works (640-1024px)
- [ ] Desktop layout works (> 1024px)
- [ ] No horizontal scroll at any size
- [ ] Touch targets are large enough on mobile

**Components:**
- [ ] All shadcn/ui components render
- [ ] Cards have proper shadows and borders
- [ ] Buttons have hover states
- [ ] Badges display with correct colors
- [ ] Icons are sized correctly

**Mock Data:**
- [ ] Sample data displays correctly
- [ ] No "undefined" or missing data errors
- [ ] Placeholder numbers show in metrics
- [ ] All text is readable

**Code Quality:**
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Page loads without issues
- [ ] Components are clean and readable

## ❌ **What NOT to Include**

**NO Database Code:**
- ❌ No Supabase queries
- ❌ No .from('table') calls
- ❌ No database connections
- ❌ No SQL or data fetching

**NO State Management:**
- ❌ No React Query/TanStack Query
- ❌ No complex useState for data
- ❌ No useEffect for fetching
- ❌ No data mutations

**NO Advanced Logic:**
- ❌ No form submission handlers
- ❌ No authentication checks
- ❌ No real search/filter logic
- ❌ No data validation (except visual)

## ✅ **What TO Include**

**YES - Visual Design:**
- ✅ Page layout and structure
- ✅ Component composition
- ✅ Styling and colors
- ✅ Responsive design
- ✅ Typography and spacing

**YES - Mock Data:**
- ✅ Hardcoded sample events (3-5)
- ✅ Placeholder metrics (12, 5, 2, 7)
- ✅ Sample venue/perk details
- ✅ Mock AI responses

**YES - Visual States:**
- ✅ Hover effects on cards
- ✅ Button active states
- ✅ Loading skeletons (visual only)
- ✅ Empty states (visual only)
- ✅ Visual feedback (button changes)

**YES - UI Interactions:**
- ✅ Button onClick for visual changes
- ✅ Toggle states (bookmark filled/outline)
- ✅ Accordion expand/collapse
- ✅ Tab navigation (visual)
- ✅ Modal open/close (if needed)

## 🎯 **Lovable's Job:**
- Create beautiful, responsive UI layouts
- Design visual components and styling
- Build page structure with mock/placeholder data
- Focus on user experience and visual design

## 🤖 **Claude's Job (LATER):**
- Connect pages to Supabase database
- Implement data fetching and state management
- Add form validation and submission logic
- Handle authentication and permissions

## 📊 **Expected Output:**
- Complete page layouts with wireframes
- Component specifications and styling
- Responsive design for all breakpoints
- User journey flowcharts
- Interactive prototypes (if possible)
- Design system documentation

## 🎨 **Design Focus Areas:**
1. **AI Chat Interface**: Modern, conversational UI
2. **Event Summary Panel**: Real-time updates and progress
3. **Venue Selection**: Interactive comparison and selection
4. **Ticketing Setup**: Dynamic pricing and validation
5. **Agenda Builder**: Drag-and-drop timeline interface
6. **Marketing Dashboard**: Content generation and management

## 🚀 **Success Criteria:**
- **Visual Consistency**: 100% match with EventOS design system
- **Responsive Design**: Perfect display on all device sizes
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: < 3 second load times
- **User Satisfaction**: 4.5/5 design rating

---

**🎨 This prompt provides Lovable with everything needed to create beautiful, functional UI/UX for the EventOS AI Event Wizard while maintaining consistency with the existing platform design system.**
