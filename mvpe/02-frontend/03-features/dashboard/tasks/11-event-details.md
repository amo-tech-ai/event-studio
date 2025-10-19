# Task 11: Event Details Integration
**Priority:** 🔴 HIGH
**Time:** 8 hours
**Status:** 🔴 NOT STARTED
**Dependencies:** Tasks 09-10

---

## 🎯 Objective

Create detailed event page with real data, tickets, attendees, and analytics.

---

## ✅ Success Criteria

- [ ] Event details page created
- [ ] useEventDetails hook integrated
- [ ] Tickets section shows real data
- [ ] Attendees section shows real data
- [ ] Event analytics displayed
- [ ] Edit functionality works
- [ ] Delete functionality works

---

## 📋 Implementation

### 1. Create Event Details Page (3 hours)

```typescript
// src/pages/EventDetails.tsx
import { useParams } from 'react-router-dom';
import { useEventDetails, useEventMutations } from '@/features/events';
import { LoadingSkeleton, ErrorMessage } from '@/components/dashboard';

export function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, error } = useEventDetails(id!);
  const { updateEvent, deleteEvent } = useEventMutations();

  if (isLoading) return <LoadingSkeleton type="card" count={3} />;
  if (error) return <ErrorMessage error={error} />;
  if (!event) return <ErrorMessage error="Event not found" />;

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{event.name}</h1>
            <p className="text-muted-foreground mt-2">{event.description}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleEdit(event)}>Edit</Button>
            <Button variant="destructive" onClick={() => handleDelete(event.id)}>
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* Event Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Tickets Sold"
          value={event.tickets?.[0]?.count || 0}
          icon={Ticket}
        />
        <StatCard
          label="Attendees"
          value={event.attendees?.[0]?.count || 0}
          icon={Users}
        />
        <StatCard
          label="Revenue"
          value={`$${event.orders?.[0]?.count || 0}`}
          icon={DollarSign}
        />
        <StatCard
          label="Capacity"
          value={`${event.capacity || 0}`}
          icon={Calendar}
        />
      </div>

      {/* Tickets Section */}
      <TicketsSection eventId={event.id} />

      {/* Attendees Section */}
      <AttendeesSection eventId={event.id} />
    </div>
  );
}
```

- [ ] Page component created
- [ ] Event header displays
- [ ] Stats cards show counts
- [ ] Edit/delete buttons work

---

### 2. Create Tickets Section (2 hours)

```typescript
function TicketsSection({ eventId }: { eventId: string }) {
  const { data: tickets, isLoading } = useQuery({
    queryKey: ['tickets', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('event_id', eventId);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Tickets</h3>
      {isLoading ? (
        <LoadingSkeleton type="table" count={3} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Buyer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets?.map(ticket => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.type}</TableCell>
                <TableCell>${ticket.price}</TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>{ticket.buyer_email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
```

- [ ] Tickets query implemented
- [ ] Table displays ticket data
- [ ] Loading state handled

---

### 3. Create Attendees Section (2 hours)

```typescript
function AttendeesSection({ eventId }: { eventId: string }) {
  const { data: attendees } = useQuery({
    queryKey: ['attendees', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendees')
        .select('*, profile:profiles(*)')
        .eq('event_id', eventId);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Attendees</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {attendees?.map(attendee => (
          <div key={attendee.id} className="flex items-center gap-3 p-3 border rounded">
            <Avatar>
              <AvatarFallback>
                {attendee.profile?.full_name?.[0] || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{attendee.profile?.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {attendee.profile?.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
```

- [ ] Attendees query implemented
- [ ] Grid displays attendees
- [ ] Profile data joined

---

### 4. Add Edit/Delete Handlers (1 hour)

```typescript
const handleEdit = (event: Event) => {
  // Open edit dialog
  setEditDialog(true);
  setSelectedEvent(event);
};

const handleDelete = (id: string) => {
  if (confirm('Delete this event?')) {
    deleteEvent.mutate(id, {
      onSuccess: () => {
        navigate('/dashboard/events');
      }
    });
  }
};
```

- [ ] Edit dialog implemented
- [ ] Delete confirmation added
- [ ] Navigation on delete

---

## ✅ Testing

- [ ] Event details load correctly
- [ ] Stats show real counts
- [ ] Tickets table populated
- [ ] Attendees grid populated
- [ ] Edit opens dialog
- [ ] Delete removes event and navigates

---

## 🎯 Next: Task 12 - Bookings & Financials

**Time Spent:** _____ hours
**Completed:** ___________________
