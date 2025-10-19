# Supabase + React Resources

Supplementary materials for the Supabase React Best Practices skill.

## Files

### `query-patterns.ts`
Complete TypeScript reference with 15+ query and mutation patterns:
- Simple list queries
- Single item queries
- Filtered queries
- Paginated queries
- Infinite scroll
- Query with joins
- Aggregations
- Dependent queries
- CRUD mutations
- Optimistic updates
- Batch operations
- Query key factories

### `rls-examples.sql`
10 comprehensive RLS policy patterns with SQL:
- Public read, authenticated write
- Private user data
- Relational FK-based access
- Anonymous dashboard access
- Team/organization access
- Time-based access
- Role-based access control (RBAC)
- Conditional write access
- Cascading permissions
- Soft delete with RLS
- Testing procedures
- Performance optimization indexes

## Quick Links

**Official Documentation:**
- [Supabase React Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-react)
- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- [RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)

**EventOS Specific:**
- Main client: `src/integrations/supabase/client.ts`
- Auth context: `src/integrations/supabase/auth.tsx`
- Query client: `src/lib/queryClient.ts`
- Example hooks: `src/features/events/hooks/`

## Common Commands

```bash
# Generate TypeScript types
npx supabase gen types typescript --project-id asrzdtpyrdgyggqdfwwl > src/integrations/supabase/types.ts

# Test RLS policies locally
npx supabase start
npx supabase db reset

# Apply migrations
npx supabase db push

# Run tests
npm run test
```

## Troubleshooting

### "Invalid API key" Error
Check that you're using the correct environment variable:
```typescript
// ✅ Correct
VITE_SUPABASE_ANON_KEY=eyJ...

// ❌ Wrong (old format)
SUPABASE_ANON_KEY=eyJ...
```

### RLS Blocking Queries
Enable RLS debugging in client:
```typescript
const { data, error } = await supabase.from('events').select('*');
if (error) {
  console.error('RLS Error:', error);
  // Check: Is user authenticated? Do policies allow access?
}
```

### Types Out of Sync
After schema changes, regenerate types:
```bash
npx supabase gen types typescript --project-id <id> > src/integrations/supabase/types.ts
```

### Stale Cache
Clear TanStack Query cache:
```typescript
queryClient.invalidateQueries({ queryKey: ['events'] });
// Or
queryClient.clear();
```

## Best Practices Summary

1. **Always use TypeScript types** from generated schema
2. **Centralize query keys** using factory pattern
3. **Handle loading/error states** in every component
4. **Invalidate cache** after mutations
5. **Use RLS policies** instead of client-side auth checks
6. **Test RLS** with different user roles
7. **Prefetch** for better UX
8. **Optimize** with selective field fetching
9. **Monitor** with React Query Devtools
10. **Never** expose service_role key in frontend

## Examples in EventOS

**Query Hook:** `src/features/events/hooks/useEvents.ts`
```typescript
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, venue:venues(*)')
        .eq('status', 'published');
      if (error) throw error;
      return data;
    },
  });
}
```

**Mutation Hook:** `src/features/events/hooks/useEventMutations.ts`
```typescript
export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (event) => {
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
```

**Component Usage:**
```typescript
function EventsList() {
  const { data, isLoading, error } = useEvents();
  const createEvent = useCreateEvent();

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorAlert error={error} />;

  return (
    <div>
      {data?.map(event => <EventCard key={event.id} event={event} />)}
      <Button onClick={() => createEvent.mutate(newEvent)}>
        Create Event
      </Button>
    </div>
  );
}
```

## Performance Checklist

- [ ] Using selective field fetching (`select('id, name, price_cents')`)
- [ ] Implemented proper `staleTime` for each query
- [ ] Added indexes for RLS policy lookups
- [ ] Using `enabled` flag for conditional queries
- [ ] Prefetching on hover for detail pages
- [ ] Implementing pagination for large lists
- [ ] Using optimistic updates for instant feedback
- [ ] Monitoring bundle size (React Query Devtools only in dev)

---

**Need help?** Consult the main `SKILL.md` file or check EventOS codebase examples.
