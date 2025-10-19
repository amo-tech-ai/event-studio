# Task 05: Shared Dashboard Components
**Priority:** 🔴 CRITICAL BLOCKER
**Estimated Time:** 2 hours
**Status:** 🔴 NOT STARTED
**Dependencies:** Task 04 (TypeScript Types)

---

## 🎯 Objective

Build reusable shared components for all dashboard pages to prevent code duplication and ensure consistent UI patterns.

---

## ✅ Success Criteria

- [ ] 6 shared components created
- [ ] All components properly typed
- [ ] Clean export from index.ts
- [ ] Can import from `@/components/dashboard`
- [ ] No code duplication across pages
- [ ] Consistent loading/error states

---

## 📋 Components to Create

### 1. LoadingSkeleton.tsx (20 min)

**Purpose:** Reusable skeleton for loading states

```tsx
// src/components/dashboard/LoadingSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface LoadingSkeletonProps {
  type?: 'stat' | 'table' | 'chart' | 'card';
  count?: number;
}

export function LoadingSkeleton({ type = 'card', count = 1 }: LoadingSkeletonProps) {
  if (type === 'stat') {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </Card>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <Card className="p-6">
        <Skeleton className="h-8 w-32 mb-4" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex justify-between py-4 border-b">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/6" />
          </div>
        ))}
      </Card>
    );
  }

  if (type === 'chart') {
    return (
      <Card className="p-6">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-64 w-full" />
      </Card>
    );
  }

  // Default card skeleton
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-6">
          <Skeleton className="h-32 w-full" />
        </Card>
      ))}
    </div>
  );
}
```

- [ ] Create LoadingSkeleton.tsx
- [ ] Support stat, table, chart, card types
- [ ] Add count prop for multiple items
- [ ] Test rendering

---

### 2. ErrorMessage.tsx (20 min)

**Purpose:** Consistent error display

```tsx
// src/components/dashboard/ErrorMessage.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  error: Error | string | null;
  onRetry?: () => void;
  title?: string;
}

export function ErrorMessage({
  error,
  onRetry,
  title = "Error"
}: ErrorMessageProps) {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">{errorMessage}</p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-2"
          >
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
```

- [ ] Create ErrorMessage.tsx
- [ ] Accept Error or string
- [ ] Optional retry button
- [ ] Proper styling

---

### 3. EmptyState.tsx (20 min)

**Purpose:** Consistent empty state display

```tsx
// src/components/dashboard/EmptyState.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <Card className="p-12 text-center">
      {Icon && (
        <div className="flex justify-center mb-4">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
```

- [ ] Create EmptyState.tsx
- [ ] Support icon, title, description
- [ ] Optional CTA button
- [ ] Centered layout

---

### 4. StatCard.tsx (20 min)

**Purpose:** Dashboard stat card component

```tsx
// src/components/dashboard/StatCard.tsx
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  color = "bg-gradient-to-r from-pink-500 to-purple-500"
}: StatCardProps) {
  return (
    <Card className="p-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute inset-0 ${color} opacity-5`} />

      {/* Icon */}
      {Icon && (
        <div className={`inline-flex p-2 rounded-lg ${color} bg-opacity-10 mb-2`}>
          <Icon className="h-5 w-5" />
        </div>
      )}

      {/* Label */}
      <p className="text-sm text-muted-foreground mb-1">{label}</p>

      {/* Value */}
      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-bold">{value}</h3>

        {/* Trend indicator */}
        {trend && (
          <span className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </Card>
  );
}
```

- [ ] Create StatCard.tsx
- [ ] Support icon and gradient
- [ ] Optional trend indicator
- [ ] Match dashboard design

---

### 5. ChartWrapper.tsx (20 min)

**Purpose:** Wrapper for chart libraries with loading/error states

```tsx
// src/components/dashboard/ChartWrapper.tsx
import { Card } from "@/components/ui/card";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ErrorMessage } from "./ErrorMessage";
import { EmptyState } from "./EmptyState";
import { BarChart3 } from "lucide-react";

interface ChartWrapperProps {
  title?: string;
  isLoading?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function ChartWrapper({
  title,
  isLoading,
  error,
  isEmpty,
  onRetry,
  children
}: ChartWrapperProps) {
  if (isLoading) {
    return <LoadingSkeleton type="chart" />;
  }

  if (error) {
    return (
      <Card className="p-6">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <ErrorMessage error={error} onRetry={onRetry} />
      </Card>
    );
  }

  if (isEmpty) {
    return (
      <Card className="p-6">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <EmptyState
          icon={BarChart3}
          title="No data available"
          description="Chart data will appear here once available"
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </Card>
  );
}
```

- [ ] Create ChartWrapper.tsx
- [ ] Handle loading state
- [ ] Handle error state
- [ ] Handle empty state
- [ ] Wrap chart children

---

### 6. Index & Exports (10 min)

```tsx
// src/components/dashboard/index.ts
export { LoadingSkeleton } from './LoadingSkeleton';
export { ErrorMessage } from './ErrorMessage';
export { EmptyState } from './EmptyState';
export { StatCard } from './StatCard';
export { ChartWrapper } from './ChartWrapper';

// Export types
export type { LoadingSkeletonProps } from './LoadingSkeleton';
export type { ErrorMessageProps } from './ErrorMessage';
export type { EmptyStateProps } from './EmptyState';
export type { StatCardProps } from './StatCard';
export type { ChartWrapperProps } from './ChartWrapper';
```

- [ ] Create index.ts
- [ ] Export all components
- [ ] Export all types
- [ ] Test clean imports

---

## ✅ Testing Checklist

### 1. Test LoadingSkeleton (5 min)

```tsx
// Test in a page
import { LoadingSkeleton } from '@/components/dashboard';

// In component
<LoadingSkeleton type="stat" count={3} />
<LoadingSkeleton type="table" count={5} />
<LoadingSkeleton type="chart" />
```

- [ ] Renders stat skeleton
- [ ] Renders table skeleton
- [ ] Renders chart skeleton
- [ ] Renders default skeleton

### 2. Test ErrorMessage (5 min)

```tsx
import { ErrorMessage } from '@/components/dashboard';

<ErrorMessage
  error={new Error("Test error")}
  onRetry={() => console.log('retry')}
/>
```

- [ ] Shows error message
- [ ] Retry button works
- [ ] Null error shows nothing

### 3. Test EmptyState (5 min)

```tsx
import { EmptyState } from '@/components/dashboard';
import { Calendar } from 'lucide-react';

<EmptyState
  icon={Calendar}
  title="No events"
  description="Create your first event"
  actionLabel="Create Event"
  onAction={() => console.log('create')}
/>
```

- [ ] Displays icon
- [ ] Shows title and description
- [ ] Action button works

### 4. Test StatCard (5 min)

```tsx
import { StatCard } from '@/components/dashboard';
import { Calendar } from 'lucide-react';

<StatCard
  label="Total Events"
  value={5}
  icon={Calendar}
  trend={{ value: 12, isPositive: true }}
/>
```

- [ ] Displays value
- [ ] Shows icon
- [ ] Trend indicator works

### 5. Test ChartWrapper (5 min)

```tsx
import { ChartWrapper } from '@/components/dashboard';

<ChartWrapper title="Revenue" isLoading={false}>
  <div>Chart goes here</div>
</ChartWrapper>
```

- [ ] Shows loading state
- [ ] Shows error state
- [ ] Shows empty state
- [ ] Shows children when ready

---

## 📊 Component Usage Example

**Before (with duplication):**
```tsx
// Every page has this code
if (isLoading) return <div>Loading...</div>
if (error) return <div>Error: {error.message}</div>
if (!data) return <div>No data</div>
```

**After (with shared components):**
```tsx
import { LoadingSkeleton, ErrorMessage, EmptyState } from '@/components/dashboard';

if (isLoading) return <LoadingSkeleton type="stat" count={3} />
if (error) return <ErrorMessage error={error} onRetry={refetch} />
if (!data?.length) return <EmptyState title="No events" />
```

✅ **Benefits:**
- Consistent UI across all pages
- Less code per page
- Easier to update styles globally
- Better UX with proper loading states

---

## 🎯 Next Task

After completing this task:
- [ ] All 6 components created
- [ ] Can import from `@/components/dashboard`
- [ ] All components tested
- [ ] Proceed to **Task 06: Phase 0 - Infrastructure Testing**

---

## 📝 Notes

**Components Created:**
- LoadingSkeleton: ✅ / ❌
- ErrorMessage: ✅ / ❌
- EmptyState: ✅ / ❌
- StatCard: ✅ / ❌
- ChartWrapper: ✅ / ❌
- Index exports: ✅ / ❌

**Issues Found:**
-

**Time Spent:** _____ hours

**Completed By:** ___________________
**Date:** ___________________
