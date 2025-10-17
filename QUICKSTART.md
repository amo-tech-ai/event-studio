# 🚀 EventOS Quick Start Guide

Everything is set up and tested. Start building your app now!

---

## ✅ What's Ready

- ✅ **Local Supabase**: All services running (API, Database, Studio, Auth, Storage)
- ✅ **Test Data**: 3 users, 4 venues, 5 events, 3 orders, 4 attendees, 3 tickets
- ✅ **All Tests Passing**: 15/15 comprehensive tests ✅

---

## 🎯 Start Developing (3 Steps)

### 1. Start Your React App
```bash
cd /home/sk/event-studio
npm run dev
```
Access at: **http://localhost:5173**

### 2. Configure Environment

Already set up in `src/integrations/supabase/client.ts`:
```typescript
// Uses these environment variables:
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
```

### 3. Use Supabase Client

```typescript
import { supabase } from '@/integrations/supabase/client'

// Fetch events
const { data: events } = await supabase
  .from('events')
  .select('*')
  
// Create order
const { data: order } = await supabase
  .from('orders')
  .insert({ customer_id, event_id, quantity: 2 })
```

---

## 🔗 Quick Links

### Local Services
- **Studio UI** (Database Manager): http://127.0.0.1:54323
- **API Docs**: http://127.0.0.1:54321
- **Mailpit** (Email Testing): http://127.0.0.1:54324

### Test Data
**Test Users** (password: `password123`):
- `organizer@eventos.com` - Event organizer
- `customer@example.com` - Customer
- `john@techcorp.com` - Customer

### Database
```bash
# Connect with psql
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Quick queries
SELECT * FROM events;
SELECT * FROM orders WHERE customer_id = '22222222-2222-2222-2222-222222222222';
```

---

## 🛠️ Common Commands

### Supabase
```bash
export DOCKER_HOST=  # Always set this first!

# Check status
npx supabase status

# Reset database (caution: deletes data!)
npx supabase db reset

# Generate TypeScript types
npx supabase gen types typescript --local > src/types/database.ts

# Stop services
npx supabase stop
```

### Docker
```bash
# View running containers
docker ps | grep supabase

# View logs
docker logs supabase_db_asrzdtpyrdgyggqdfwwl

# Restart Docker if needed
sudo systemctl restart docker
```

---

## 📊 Database Schema

**Tables**:
- `profiles` - User profiles
- `venues` - Event locations  
- `events` - Conferences, workshops, seminars
- `orders` - Ticket orders with Stripe integration
- `attendees` - Event attendees
- `tickets` - Individual tickets with QR codes

**Relationships**:
```
events → venues (venue_id)
orders → profiles (customer_id)  
orders → events (event_id)
attendees → orders (order_id)
tickets → attendees (attendee_id)
```

---

## 🔒 Test Accounts

Login credentials for testing:

| Email | Password | Role |
|-------|----------|------|
| organizer@eventos.com | password123 | Organizer |
| customer@example.com | password123 | Customer |
| john@techcorp.com | password123 | Customer |

---

## 📚 Documentation

Full guides in `/supabase/docs/`:

1. **00-COMPLETE-SUCCESS.md** - Setup summary
2. **TEST-RESULTS.md** - All 15 tests passed ✅
3. **connection.md** - Complete connection guide
4. **02-cli.md** - Supabase CLI reference
5. **02-docker.md** - Docker setup guide

---

## 🐛 Troubleshooting

### Services won't start?
```bash
export DOCKER_HOST=
sudo systemctl status docker
cd /home/sk/event-studio
npx supabase start
```

### Database connection issues?
```bash
# Test connection
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres -c "SELECT 1;"
```

### React app can't connect?
```bash
# Verify environment
echo $VITE_SUPABASE_URL
# Should be: http://127.0.0.1:54321

# Check API
curl http://127.0.0.1:54321/rest/v1/events?select=name&limit=1 \
  -H "apikey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH"
```

---

## 🎯 Example: Fetch Events

```typescript
// src/pages/EventsPage.tsx
import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export function EventsPage() {
  const [events, setEvents] = useState([])
  
  useEffect(() => {
    async function fetchEvents() {
      const { data } = await supabase
        .from('events')
        .select(`
          *,
          venues (name, city)
        `)
        .eq('status', 'published')
      
      setEvents(data || [])
    }
    
    fetchEvents()
  }, [])
  
  return (
    <div>
      {events.map(event => (
        <div key={event.id}>
          <h2>{event.name}</h2>
          <p>{event.venues?.name} - {event.venues?.city}</p>
          <p>Capacity: {event.capacity}</p>
          <p>Price: ${event.price_cents / 100}</p>
        </div>
      ))}
    </div>
  )
}
```

---

## ✅ Verification

Run comprehensive tests anytime:
```bash
bash /tmp/test-supabase.sh
```

Expected: **15/15 tests pass** ✅

---

**Everything is ready. Happy coding! 🎉**

**Pro tip**: Open Studio UI (http://127.0.0.1:54323) in one tab to visualize your database while coding!

