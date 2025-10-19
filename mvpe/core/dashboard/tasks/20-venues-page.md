# Task 20: Week 3 - Venues Page
**Phase:** Week 3
**Priority:** 🟡 MEDIUM
**Time:** 8 hours
**Status:** 🔴 NOT STARTED
**Dependencies:** Task 02 (Venues sample data)

---

## 🎯 Objective

Create Venues page to manage event locations, availability, and bookings.

---

## ✅ Success Criteria

- [ ] Venues page created
- [ ] Venues list displays
- [ ] Venue details page
- [ ] Add/edit venues
- [ ] Availability calendar
- [ ] Booking management
- [ ] Map integration

---

## 📋 Implementation

### 1. Create Venues Hooks (2 hours)

```typescript
// src/features/venues/hooks/useVenues.ts
export function useVenues() {
  return useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select(`
          *,
          bookings:venue_bookings(count)
        `)
        .order('name');

      if (error) throw error;
      return data;
    },
  });
}

export function useVenueDetails(venueId: string) {
  return useQuery({
    queryKey: ['venues', venueId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select(`
          *,
          bookings:venue_bookings(*,
            event:events(name)
          )
        `)
        .eq('id', venueId)
        .single();

      if (error) throw error;
      return data;
    },
  });
}
```

---

### 2. Create Venues Page (3 hours)

```typescript
// src/pages/DashboardVenues.tsx
export function DashboardVenues() {
  const { data: venues, isLoading } = useVenues();

  if (isLoading) return <LoadingSkeleton type="card" count={6} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Venues</h1>
        <Button onClick={() => setVenueDialog(true)}>
          Add Venue
        </Button>
      </div>

      {!venues || venues.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No venues yet"
          description="Add your first venue to get started"
          actionLabel="Add Venue"
          onAction={() => setVenueDialog(true)}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {venues.map(venue => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onClick={() => navigate(`/dashboard/venues/${venue.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function VenueCard({ venue, onClick }) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition" onClick={onClick}>
      <CardHeader>
        <CardTitle>{venue.name}</CardTitle>
        <CardDescription>{venue.location}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Capacity: {venue.capacity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {venue.bookings?.[0]?.count || 0} bookings
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### 3. Create Venue Details Page (2 hours)

```typescript
// src/pages/VenueDetails.tsx
export function VenueDetails() {
  const { id } = useParams();
  const { data: venue, isLoading } = useVenueDetails(id!);

  if (isLoading) return <LoadingSkeleton />;
  if (!venue) return <ErrorMessage error="Venue not found" />;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">{venue.name}</h1>
            <p className="text-muted-foreground mt-2">{venue.location}</p>
          </div>
          <Button>Edit Venue</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mt-6">
          <StatCard label="Capacity" value={venue.capacity} icon={Users} />
          <StatCard label="Total Bookings" value={venue.bookings?.length || 0} />
          <StatCard label="Available" value={venue.available ? 'Yes' : 'No'} />
        </div>
      </Card>

      {/* Bookings Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Bookings</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {venue.bookings?.map(booking => (
              <TableRow key={booking.id}>
                <TableCell>{booking.event?.name}</TableCell>
                <TableCell>
                  {new Date(booking.start_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(booking.end_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge>{booking.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Map (Optional) */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Location</h3>
        {/* Add map integration here */}
        <div className="h-64 bg-muted rounded flex items-center justify-center">
          <p className="text-muted-foreground">Map coming soon</p>
        </div>
      </Card>
    </div>
  );
}
```

---

### 4. Add Routes (15 min)

```typescript
<Route path="/dashboard/venues" element={<DashboardVenues />} />
<Route path="/dashboard/venues/:id" element={<VenueDetails />} />
```

---

## ✅ Testing

- [ ] Venues page loads
- [ ] Shows 3+ venues (from sample data)
- [ ] Click venue opens details
- [ ] Bookings table populated
- [ ] Add venue works
- [ ] Edit venue works

---

## 🎉 Week 3 Complete!

**Pages Built:**
- ✅ Calendar (16)
- ✅ Settings (17)
- ✅ Analytics (18)
- ✅ Organizers/CRM (19)
- ✅ Venues (20)

**Dashboard Status:**
- Pages: 11/11 (100%)
- All pages created ✅
- All pages connected to database ✅

---

## 🎯 Next: Task 21 - UI Polish & Components

**Time Spent:** _____ hours
**Completed:** ___________________
