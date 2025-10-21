# EventOS Chat Wizard - Planning Document

## Overview
A conversational interface where users plan events through natural language chat while AI dynamically populates event information in real-time.

## Design Inspiration
Based on Breef.com's clean, professional aesthetic with warm orange accents and generous white space.

## Layout Structure

### Desktop (≥1024px)
- Two equal panels side-by-side (50/50)
- Left: Chat interface
- Right: Event summary with live updates

### Tablet (768px - 1023px)
- Stacked vertical layout
- Chat panel on top
- Event summary below

### Mobile (<768px)
- Chat full-width
- Event summary accessible via floating action button (FAB)
- Slides up as drawer overlay

## Color Palette
- Primary Accent: `#E46A25` (orange - CTAs, highlights)
- Background: `#F9F7F3` (soft beige)
- Text Primary: `#2A2A2A`
- Text Secondary: `#707070`
- Border: `#E5E5E5`
- AI Message: White with shadow
- User Message: Orange background, white text

## Components to Build

### 1. ChatWizard (Main Container)
- Responsive grid layout
- State management for messages and event data

### 2. ChatPanel (Left Side)
- Header with title
- Message feed (scrollable)
- Message input area
- Empty state with prompt suggestions

### 3. EventSummary (Right Side)
- Header
- Event detail cards (name, date, location, capacity)
- Status badge
- Ticket tiers section
- Task checklist
- Action buttons (Edit, View, Share)

### 4. Message Components
- UserMessage (right-aligned, orange bubble)
- AIMessage (left-aligned, white card)
- TypingIndicator (animated dots)

### 5. Empty State
- Welcome message
- 4 suggestion chips for quick start

## Features

### Phase 1: Core UI
- ✅ Two-panel responsive layout
- ✅ Chat message display
- ✅ Message input with send button
- ✅ Empty state with suggestions
- ✅ Event summary cards

### Phase 2: Interactions
- ✅ Message sending
- ✅ Typing indicator
- ✅ Auto-scroll to latest message
- ✅ Event data updates from chat

### Phase 3: Polish
- ✅ Smooth animations (fade, slide)
- ✅ Hover effects
- ✅ Mobile drawer
- ✅ Responsive behavior

## Event Data Structure
```typescript
interface EventData {
  name: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  currentAttendees: number;
  status: 'draft' | 'published' | 'live';
  ticketTiers: Array<{
    name: string;
    price: number;
  }>;
  tasks: Array<{
    label: string;
    completed: boolean;
  }>;
}
```

## User Flow Examples

### Example 1: Creating an Event
1. User: "Create a conference in Toronto for 200 people"
2. AI: Shows typing indicator
3. AI: "Great! What would you like to name this event?"
4. Right panel updates: Location → Toronto, Capacity → 200
5. User: "Tech Connect 2025"
6. Right panel updates: Event Name → Tech Connect 2025
7. Continue conversation...

### Example 2: Adding Ticket Tiers
1. User: "Add VIP and General Admission tickets"
2. AI confirms and asks for pricing
3. Right panel shows new Ticket Tiers section
4. Cards animate into view

## Animation Specs
- Message fade-in: 0.3s ease
- Card slide-in: 0.4s ease-out
- Button hover: 0.2s ease
- Typing dots: 1.5s infinite pulse

## Accessibility
- Keyboard navigation support
- ARIA labels for all interactive elements
- Focus states on all buttons
- Screen reader friendly message announcements

## Implementation Priority
1. ✅ Create planning doc
2. ✅ Build responsive layout structure
3. ✅ Implement chat UI components
4. ✅ Create event summary cards
5. ✅ Add message state management
6. ✅ Connect chat to event data updates
7. ✅ Add animations and transitions
8. ✅ Implement mobile drawer
9. ✅ Polish and test responsiveness
10. ✅ Add route and footer link

## Routes
- `/event-wizard` - Main chat wizard interface

## Next Steps After Launch
- Integrate with AI backend (Lovable AI)
- Add real event creation to database
- Implement event editing
- Add file upload for event images
- Export event to calendar
