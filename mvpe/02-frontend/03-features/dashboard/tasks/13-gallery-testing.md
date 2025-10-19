# Task 13: Gallery Integration & Testing
**Priority:** 🔴 HIGH
**Time:** 14 hours
**Status:** 🔴 NOT STARTED
**Dependencies:** Tasks 07-12

---

## 🎯 Objective

Connect Gallery page to database and perform comprehensive testing of all Week 1 integrations.

---

## ✅ Success Criteria

- [ ] Gallery page shows real event photos
- [ ] Image upload functionality
- [ ] All 6 pages tested and working
- [ ] Zero mock data remaining
- [ ] Loading/error states verified
- [ ] Week 1 completion report

---

## 📋 Implementation

### 1. Create Gallery Hooks (3 hours)

```typescript
// src/features/gallery/hooks/useGallery.ts
export function useEventGallery(eventId?: string) {
  return useQuery({
    queryKey: ['gallery', eventId],
    queryFn: async () => {
      let query = supabase
        .from('event_images')
        .select(`
          *,
          event:events(name)
        `)
        .order('created_at', { ascending: false });

      if (eventId) {
        query = query.eq('event_id', eventId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useImageUpload() {
  return useMutation({
    mutationFn: async ({ file, eventId }: { file: File; eventId: string }) => {
      // Upload to Supabase Storage
      const fileName = `${eventId}/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('event-images')
        .getPublicUrl(fileName);

      // Save to database
      const { data, error } = await supabase
        .from('event_images')
        .insert({
          event_id: eventId,
          image_url: urlData.publicUrl,
          file_name: file.name,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}
```

---

### 2. Update Gallery Page (4 hours)

```typescript
// src/pages/DashboardGallery.tsx
import { useEventGallery, useImageUpload } from '@/features/gallery';

export function DashboardGallery() {
  const { data: images, isLoading } = useEventGallery();
  const uploadImage = useImageUpload();

  const handleUpload = async (file: File, eventId: string) => {
    await uploadImage.mutateAsync({ file, eventId });
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <Button onClick={() => setUploadDialog(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Images
        </Button>
      </div>

      {!images || images.length === 0 ? (
        <EmptyState
          icon={Image}
          title="No images yet"
          description="Upload images to get started"
          actionLabel="Upload Images"
          onAction={() => setUploadDialog(true)}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map(image => (
            <Card key={image.id} className="overflow-hidden">
              <img
                src={image.image_url}
                alt={image.file_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <p className="text-sm font-medium truncate">
                  {image.event?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(image.created_at).toLocaleDateString()}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### 3. Week 1 Integration Testing (4 hours)

**Test each page systematically:**

#### Dashboard Page
```bash
# Navigate to /dashboard
# Check:
- [ ] Stats show real numbers (5 events, 3 bookings, $926)
- [ ] Recent activity populated
- [ ] Revenue chart displays
- [ ] No mock data visible
```

#### Events Page
```bash
# Navigate to /dashboard/events
# Check:
- [ ] Shows 5 real events
- [ ] Filter by status works
- [ ] Search functionality works
- [ ] Click event opens details
```

#### Event Details
```bash
# Navigate to /dashboard/events/{id}
# Check:
- [ ] Event info displays
- [ ] Tickets table populated
- [ ] Attendees grid populated
- [ ] Edit/delete buttons work
```

#### Bookings Page
```bash
# Navigate to /dashboard/bookings
# Check:
- [ ] Shows 3 real orders
- [ ] Status filter works
- [ ] Order details accessible
- [ ] Payment status correct
```

#### Financials Page
```bash
# Navigate to /dashboard/financials
# Check:
- [ ] Total revenue $926
- [ ] Order count 3
- [ ] Average order calculated
- [ ] Revenue chart displays
```

#### Gallery Page
```bash
# Navigate to /dashboard/gallery
# Check:
- [ ] Images load (if any)
- [ ] Upload button works
- [ ] Empty state if no images
- [ ] Event names display
```

---

### 4. Create Week 1 Completion Report (2 hours)

```markdown
# Week 1 Completion Report

## Pages Integrated: 6/6 ✅

1. Dashboard - ✅ Real data
2. Events - ✅ Real data
3. Event Details - ✅ Real data
4. Bookings - ✅ Real data
5. Financials - ✅ Real data
6. Gallery - ✅ Real data

## Mock Data Removed: 100% ✅

- Dashboard stats: ✅ Removed
- Activity feed: ✅ Removed
- Events list: ✅ Removed
- Bookings list: ✅ Removed
- Revenue data: ✅ Removed
- Gallery images: ✅ Removed

## Real Data Verified:

- Events count: 5 ✅
- Orders count: 3 ✅
- Revenue total: $926 ✅
- All queries working: ✅

## Quality Checks:

- Loading states: ✅
- Error handling: ✅
- Empty states: ✅
- Type safety: ✅
- Auto-refresh: ✅

## Week 1 Status: COMPLETE ✅

Ready for Week 2: Real-time Subscriptions
```

---

### 5. Document Issues Found (1 hour)

Create issue log:
```markdown
# Week 1 Issues Log

## Critical Issues:
- None found ✅

## Minor Issues:
- Image upload needs file size limit
- Revenue chart needs better formatting
- Loading states could be faster

## Improvements:
- Add pagination to bookings
- Add export functionality
- Add print layouts
```

---

## ✅ Testing Checklist

### Functionality Tests:
- [ ] All pages load without errors
- [ ] All database queries work
- [ ] All mutations work (create/update/delete)
- [ ] Filters work on all pages
- [ ] Search works on all pages
- [ ] Navigation works between pages

### Data Verification:
- [ ] Dashboard: 5 events, 3 bookings, $926
- [ ] Events: 5 events displayed
- [ ] Bookings: 3 orders displayed
- [ ] Financials: $926 revenue
- [ ] Gallery: Images load correctly

### UI/UX Tests:
- [ ] Loading skeletons appear
- [ ] Error messages display
- [ ] Empty states work
- [ ] Buttons are responsive
- [ ] Mobile layout works

### Performance Tests:
- [ ] Pages load < 2 seconds
- [ ] Queries complete < 1 second
- [ ] No memory leaks
- [ ] Auto-refresh works

---

## 🎉 Week 1 Complete!

**What You've Built:**
- ✅ 6 dashboard pages with real data
- ✅ Zero mock data remaining
- ✅ All CRUD operations working
- ✅ Loading/error states on all pages
- ✅ Filters and search functional
- ✅ Database fully integrated

**Metrics:**
- Pages integrated: 6/6 (100%)
- Mock data removed: 100%
- Real data verified: ✅
- Quality gates passed: ✅

**Ready For:**
- Week 2: Real-time subscriptions
- Week 2: Performance optimization

---

## 🎯 Next: Task 14 - Real-time Subscriptions

**Time Spent:** _____ hours
**Completed:** ___________________
