# Prompt Templates for Claude Implementation

Ready-to-use prompt templates for each implementation layer.

---

## How to Use These Templates

1. Copy the template for your current layer
2. Fill in the `{placeholders}` with your specific details
3. Paste into Claude conversation
4. Review Claude's implementation
5. Mark task as complete in progress tracker

---

## Layer 1: Database Implementation

### Template 1.1: Create Database Schema

```markdown
Task: Create database schema for {feature_name}

Context:
I'm building {feature_name} which requires the following database tables:
- {table_1}: {purpose}
- {table_2}: {purpose}
- {table_3}: {purpose}

Requirements:
1. Create idempotent migration (uses IF NOT EXISTS)
2. Include proper constraints (NOT NULL, UNIQUE, CHECK)
3. Add foreign keys with ON DELETE CASCADE where appropriate
4. Set up proper indexes for common queries
5. Include rollback script in comments

Migration file: supabase/migrations/{timestamp}_{feature}_schema.sql

Instructions:
1. Design the schema with proper PostgreSQL types
2. Create all tables in a single migration
3. Add indexes for:
   - Foreign keys
   - Columns used in WHERE clauses
   - Columns used in ORDER BY
4. Add CHECK constraints for data validation
5. Include detailed comments explaining table purposes
6. Add rollback script in SQL comments

Success Criteria:
- Migration runs without errors
- All tables created with correct columns
- Indexes created
- Migration is idempotent (can run multiple times)
- Rollback script included

Output:
- Full migration SQL file
- ERD diagram (mermaid format)
- List of indexes created
- Rollback commands
```

### Template 1.2: Add RLS Policies

```markdown
Task: Implement Row Level Security (RLS) policies for {feature_name}

Context:
Tables that need RLS:
- {table_1}: {access rules}
- {table_2}: {access rules}

User Roles:
- Public: {permissions}
- Authenticated: {permissions}
- Organizer: {permissions}
- Admin: {permissions}

Migration file: supabase/migrations/{timestamp}_{feature}_rls.sql

Instructions:
1. Enable RLS on all tables
2. Create policies for:
   - SELECT (who can view)
   - INSERT (who can create)
   - UPDATE (who can modify)
   - DELETE (who can remove)
3. Use auth.uid() for user identification
4. Test policies with different user types

Success Criteria:
- RLS enabled on all tables
- Public cannot modify data
- Users can only access their own data (where applicable)
- Organizers can manage their own resources
- No data leakage between users
- Policies tested with sample queries

Output:
- RLS migration SQL file
- Policy summary (table of who can do what)
- Test queries showing policy enforcement
- Documentation of security model
```

### Template 1.3: Test Database Migration

```markdown
Task: Test database migration for {feature_name}

Context:
Migration files:
- {timestamp}_{feature}_schema.sql
- {timestamp}_{feature}_rls.sql

Instructions:
1. Run migrations locally: `pnpm db:push`
2. Verify all tables exist: Check Supabase Studio
3. Test RLS policies:
   - Try to access data as public user
   - Try to access data as authenticated user
   - Try to access other user's data
4. Insert sample data
5. Test queries use indexes (EXPLAIN ANALYZE)
6. Verify foreign keys enforce integrity
7. Test rollback script

Success Criteria:
- All migrations apply cleanly
- Tables exist with correct schema
- RLS policies prevent unauthorized access
- Indexes are used in queries
- Foreign keys work
- Rollback script successfully removes changes

Output:
- Screenshot of Supabase Studio showing tables
- RLS test results
- Query performance analysis (EXPLAIN output)
- Confirmation that rollback works
```

---

## Layer 2: Backend Implementation

### Template 2.1: Create Edge Function

```markdown
Task: Create Edge Function for {function_name}

Context:
Function purpose: {description}
API endpoint: /functions/v1/{function_name}
Method: {GET/POST/PUT/DELETE}

Input schema:
```typescript
{
  field1: type,
  field2: type
}
```

Output schema:
```typescript
{
  field1: type,
  field2: type
}
```

File: supabase/functions/{function_name}/index.ts

Instructions:
1. Create function directory structure
2. Implement authentication check using Supabase Auth
3. Add request validation using Zod schema
4. Implement business logic
5. Handle errors gracefully
6. Return appropriate HTTP status codes
7. Add CORS headers if needed
8. Add structured logging

Success Criteria:
- Function deploys successfully
- Authentication required and working
- Input validation rejects invalid data
- Business logic correct
- Errors return user-friendly messages
- Returns proper HTTP status codes (200, 201, 400, 401, 404, 500)
- Logs are structured and useful

Output:
- Edge Function code
- Deployment confirmation
- Test curl commands
- Example request/response
- Error scenarios handled
```

### Template 2.2: Create React Query Hook

```markdown
Task: Create React Query hook for {feature_name}

Context:
Hook name: use{FeatureName}
Purpose: {description}

Operations needed:
- [ ] Fetch list (useQuery)
- [ ] Fetch single item (useQuery)
- [ ] Create (useMutation)
- [ ] Update (useMutation)
- [ ] Delete (useMutation)

File: src/hooks/use{FeatureName}.ts

Instructions:
1. Import necessary types from Database schema
2. Create useQuery hook for fetching data
3. Add filters/pagination parameters
4. Create useMutation hooks for CRUD operations
5. Implement cache invalidation after mutations
6. Add error handling
7. Set appropriate staleTime (e.g., 5 minutes)
8. Add JSDoc comments

TypeScript types to use:
- Database['public']['Tables']['{table_name}']['Row']
- Database['public']['Tables']['{table_name}']['Insert']
- Database['public']['Tables']['{table_name}']['Update']

Success Criteria:
- All CRUD operations work
- TypeScript types correct
- Cache invalidation works (list refetches after create)
- Error handling implemented
- Loading states accessible
- JSDoc comments explain usage
- No TypeScript errors

Output:
- Complete hook file
- Usage example
- Types exported
- Error handling demonstrated
```

### Template 2.3: Test Backend Logic

```markdown
Task: Test backend implementation for {feature_name}

Context:
Components to test:
- Edge Function: {function_name}
- React Query Hook: use{FeatureName}

Instructions:
1. Test Edge Function with curl:
   - Valid request → 200/201
   - Invalid auth → 401
   - Invalid data → 400
   - Not found → 404
2. Test React Query hook:
   - Fetch data successfully
   - Handle loading state
   - Handle error state
   - Create mutation works
   - Update mutation works
   - Delete mutation works
   - Cache invalidation triggers

Success Criteria:
- Edge Function responds correctly to all scenarios
- Hook fetches data without errors
- Mutations update database
- Cache invalidates after mutations
- Loading states work
- Error states display properly
- No console errors

Output:
- curl test results
- Hook test results
- Screenshots of data flow
- Confirmation all tests pass
```

---

## Layer 3: Frontend Implementation

### Template 3.1: Create React Component

```markdown
Task: Create React component for {component_name}

Context:
Component purpose: {description}
Component type: {Page/Card/Form/List/Modal}
Location: src/components/{ComponentName}.tsx

Data requirements:
- Uses hook: use{FeatureName}
- Displays: {fields to show}
- Interactions: {actions user can take}

Instructions:
1. Create functional component with TypeScript
2. Use React Query hook for data fetching
3. Implement loading state (Skeleton or Spinner)
4. Implement error state (ErrorAlert)
5. Implement empty state (EmptyState)
6. Add proper TypeScript types for props
7. Use shadcn/ui components
8. Make responsive (mobile, tablet, desktop)
9. Add accessibility (ARIA labels, keyboard nav)
10. Add proper error boundaries

Success Criteria:
- Component renders correctly
- Loading state shows while fetching
- Error state shows on failure
- Empty state shows when no data
- Responsive on all screen sizes
- Accessible (keyboard navigation, ARIA labels)
- No TypeScript errors
- No console errors
- Follows project coding style

Output:
- Component file
- Screenshot of component in all states (loading, error, empty, success)
- Accessibility verification
- Responsive design verification
```

### Template 3.2: Create Form Component

```markdown
Task: Create form component for {form_name}

Context:
Form purpose: {description}
Form type: {Create/Edit/Filter}
Location: src/components/{FormName}.tsx

Fields:
1. {field_name}: {type} - {validation rules}
2. {field_name}: {type} - {validation rules}
3. {field_name}: {type} - {validation rules}

Instructions:
1. Use react-hook-form for form management
2. Use Zod for validation schema
3. Use shadcn/ui form components
4. Implement proper validation (client-side)
5. Show validation errors inline
6. Add loading state during submission
7. Handle success (show toast, reset form)
8. Handle errors (show user-friendly message)
9. Add proper TypeScript types
10. Make form accessible

Validation schema:
```typescript
const formSchema = z.object({
  {field}: z.{type}().{validation}(),
  // ... rest of fields
})
```

Success Criteria:
- Form validates input correctly
- Required fields enforced
- Invalid input shows error messages
- Form submits successfully
- Success feedback shown (toast)
- Form resets after successful submission
- Error feedback shown on failure
- Loading state prevents double-submission
- Accessible (labels, ARIA, keyboard nav)
- No TypeScript errors

Output:
- Form component file
- Validation schema
- Screenshot of form validation
- Screenshot of success state
- Screenshot of error state
```

### Template 3.3: Test Frontend Component

```markdown
Task: Test frontend component {component_name}

Context:
Component: {ComponentName}
Location: src/components/{ComponentName}.tsx

Test scenarios:
1. Component renders
2. Loading state displays
3. Error state displays
4. Data displays correctly
5. User interactions work
6. Form validation works (if form)
7. Responsive on mobile
8. Accessible

Instructions:
1. Visual testing in browser:
   - Open component in development server
   - Test all states (loading, error, empty, success)
   - Test on different screen sizes (mobile, tablet, desktop)
   - Test keyboard navigation
   - Check browser console for errors
2. Manual testing:
   - All buttons clickable
   - All forms submittable
   - All validation working
   - All error handling working
3. Accessibility testing:
   - Tab through all interactive elements
   - Check focus indicators visible
   - Use screen reader (if available)
   - Check color contrast

Success Criteria:
- Component renders in all states
- No console errors or warnings
- Responsive on all screen sizes
- Keyboard navigation works
- Focus indicators visible
- Forms validate correctly
- User feedback clear (loading, success, errors)

Output:
- Screenshots of all states
- List of tested scenarios (with ✅ or ❌)
- Any issues found
- Confirmation of accessibility
```

---

## Layer 4: Testing Implementation

### Template 4.1: E2E Test with Playwright MCP

```markdown
Task: Create E2E test for {user_flow}

Context:
User story: As a {user_type}, I want to {action} so that {benefit}

Test steps:
1. {step 1}
2. {step 2}
3. {step 3}

Expected outcome: {what should happen}

Instructions:
Create E2E test using Playwright MCP tools:

1. Navigate to page
2. Take snapshot to get element refs
3. Interact with elements (click, type, fill)
4. Wait for expected outcomes
5. Verify results
6. Take screenshots for documentation

Use these MCP functions:
- mcp__playwright__browser_navigate
- mcp__playwright__browser_snapshot
- mcp__playwright__browser_click
- mcp__playwright__browser_fill_form
- mcp__playwright__browser_wait_for
- mcp__playwright__browser_take_screenshot

Success Criteria:
- Test completes without errors
- All assertions pass
- Screenshots captured
- User flow validated end-to-end
- Edge cases tested

Output:
- Test script (markdown or code)
- Screenshots of each step
- Test results (pass/fail)
- Any issues discovered
```

### Template 4.2: Performance Test with Chrome DevTools MCP

```markdown
Task: Performance test for {page_name}

Context:
Page: {url}
Performance requirements:
- Page load: < {X}s
- API calls: < {Y}ms (p95)
- No console errors

Instructions:
Use Chrome DevTools MCP to test performance:

1. Navigate to page
2. Monitor network requests
3. Check console for errors
4. Analyze API response times
5. Run Lighthouse audit (if needed)
6. Test slow network scenario

Use these MCP functions:
- mcp__chrome-devtools__navigate_page
- mcp__chrome-devtools__list_network_requests
- mcp__chrome-devtools__get_network_request
- mcp__chrome-devtools__list_console_messages
- mcp__chrome-devtools__emulate_network
- mcp__chrome-devtools__performance_start_trace

Success Criteria:
- Page loads within time budget
- All API calls under latency threshold
- No console errors
- Performance acceptable on slow network
- Core Web Vitals meet targets

Output:
- Network performance report
- API response time analysis
- Console error report (should be empty)
- Lighthouse scores (if run)
- Screenshots
```

---

## Layer 5: Production Deployment

### Template 5.1: Pre-deployment Checklist

```markdown
Task: Complete pre-deployment checklist for {feature_name}

Context:
Feature ready for production deployment

Instructions:
Go through the production checklist:

## Code Quality
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] No console.log statements
- [ ] Code reviewed

## Testing
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual QA complete

## Performance
- [ ] Production build succeeds
- [ ] Lighthouse score > 90
- [ ] API responses < 200ms
- [ ] Bundle size optimized

## Security
- [ ] RLS policies tested
- [ ] No secrets in code
- [ ] Input validation complete
- [ ] npm audit shows no critical vulnerabilities

## Database
- [ ] Migrations tested in staging
- [ ] Rollback script created
- [ ] Backup verified

## Documentation
- [ ] README updated
- [ ] API documented
- [ ] User guide updated

Success Criteria:
- ALL checklist items checked
- No critical issues
- Team sign-off obtained
- Rollback plan ready

Output:
- Completed checklist
- Sign-off confirmation
- Deployment plan
- Rollback procedure
```

### Template 5.2: Deploy to Production

```markdown
Task: Deploy {feature_name} to production

Context:
Pre-deployment checklist: ✅ Complete
Deployment window: {date/time}
Rollback plan: {procedure}

Instructions:
1. Database deployment:
   ```bash
   # Apply migrations
   supabase db push --project-ref {project_id}
   ```

2. Edge Functions deployment:
   ```bash
   # Deploy all functions
   supabase functions deploy {function_name} --project-ref {project_id}
   ```

3. Frontend deployment:
   ```bash
   # Build production bundle
   npm run build

   # Deploy to hosting (Vercel/Netlify)
   vercel deploy --prod
   ```

4. Post-deployment verification:
   - [ ] Health check passes
   - [ ] Critical user flows tested
   - [ ] No console errors
   - [ ] Monitoring active

5. If issues occur:
   - Follow rollback plan
   - Notify stakeholders
   - Document issues

Success Criteria:
- Database migrations applied
- Edge Functions deployed
- Frontend deployed
- Feature working in production
- No critical errors
- Monitoring shows healthy metrics

Output:
- Deployment confirmation
- Verification screenshots
- Monitoring dashboard link
- Any issues encountered
- Post-deployment notes
```

---

## Tips for Using These Templates

1. **Copy the template** - Don't modify the originals
2. **Fill placeholders** - Replace all {placeholders} with your specifics
3. **Read carefully** - Ensure you understand what's being asked
4. **Paste to Claude** - Copy the filled template to Claude conversation
5. **Review output** - Check Claude's implementation thoroughly
6. **Test everything** - Don't skip testing steps
7. **Document** - Take screenshots, save outputs
8. **Mark complete** - Update progress tracker

---

**Template Version**: 1.0
**Last Updated**: 2025-10-23
