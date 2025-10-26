// Reusable Dashboard Component Patterns for event-studio

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Download,
  Edit,
  Trash,
  AlertCircle,
  CalendarDays,
  DollarSign,
  Users,
  TrendingDown as TrendingDownIcon,
} from 'lucide-react';

// ============================================================================
// METRIC CARDS
// ============================================================================

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel = 'from last month',
  icon,
  trend,
  className = '',
}: MetricCardProps) {
  const getTrendColor = () => {
    if (!trend) return change && change > 0 ? 'text-green-600' : 'text-red-600';
    return trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  };

  const TrendIcon = trend === 'up' || (change && change > 0) ? TrendingUp : TrendingDownIcon;

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <div className="p-3 bg-primary/10 rounded-lg text-primary">{icon}</div>
      </div>
      <div className="text-3xl font-bold mb-2">{value}</div>
      {change !== undefined && (
        <div className={`flex items-center text-sm ${getTrendColor()}`}>
          <TrendIcon className="h-4 w-4 mr-1" />
          <span className="font-medium">{Math.abs(change)}%</span>
          <span className="ml-1 text-gray-500">{changeLabel}</span>
        </div>
      )}
    </Card>
  );
}

export function MetricCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-4 w-28" />
    </Card>
  );
}

// ============================================================================
// STATS GRID
// ============================================================================

interface DashboardStats {
  totalEvents: number;
  totalRevenue: number;
  totalBookings: number;
  revenueChange: number;
}

export function StatsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total Events"
        value={stats.totalEvents}
        icon={<CalendarDays className="h-5 w-5" />}
      />
      <MetricCard
        title="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        change={stats.revenueChange}
        icon={<DollarSign className="h-5 w-5" />}
      />
      <MetricCard
        title="Total Bookings"
        value={stats.totalBookings}
        icon={<Users className="h-5 w-5" />}
      />
      <MetricCard
        title="Active Events"
        value={stats.totalEvents}
        icon={<CalendarDays className="h-5 w-5" />}
      />
    </div>
  );
}

// ============================================================================
// DATA TABLE WITH ACTIONS
// ============================================================================

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
  }[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
}: DataTableProps<T>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.key)}>{col.label}</TableHead>
            ))}
            {(onEdit || onDelete || onView) && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center py-8 text-gray-500">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell key={String(col.key)}>
                    {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                  </TableCell>
                ))}
                {(onEdit || onDelete || onView) && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onView && (
                          <DropdownMenuItem onClick={() => onView(row)}>
                            View Details
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(row)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem
                            onClick={() => onDelete(row)}
                            className="text-red-600"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// ============================================================================
// STATUS BADGE
// ============================================================================

interface StatusBadgeProps {
  status: 'active' | 'draft' | 'cancelled' | 'completed' | 'pending';
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    active: 'default',
    draft: 'secondary',
    cancelled: 'destructive',
    completed: 'outline',
    pending: 'secondary',
  };

  return (
    <Badge variant={variants[status]} className={className}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

// ============================================================================
// EMPTY STATE
// ============================================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="p-12 text-center">
      {icon && <div className="flex justify-center mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Card>
  );
}

// ============================================================================
// ERROR ALERT
// ============================================================================

interface ErrorAlertProps {
  error: Error | null;
  onRetry?: () => void;
}

export function ErrorAlert({ error, onRetry }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{error.message || 'Something went wrong. Please try again.'}</span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="ml-4">
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

// ============================================================================
// LOADING STATES
// ============================================================================

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4">
          {[...Array(cols)].map((_, j) => (
            <Skeleton key={j} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// SECTION HEADER
// ============================================================================

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Example 1: Metrics Grid
<StatsGrid stats={{
  totalEvents: 42,
  totalRevenue: 125000,
  totalBookings: 350,
  revenueChange: 12.5
}} />

// Example 2: Data Table
<DataTable
  data={events}
  columns={[
    { key: 'title', label: 'Event Title' },
    { key: 'date', label: 'Date' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
  ]}
  onEdit={(event) => console.log('Edit', event)}
  onDelete={(event) => console.log('Delete', event)}
/>

// Example 3: Empty State
<EmptyState
  icon={<CalendarDays className="h-16 w-16" />}
  title="No events yet"
  description="Get started by creating your first event"
  action={{
    label: "Create Event",
    onClick: () => navigate('/events/new')
  }}
/>

// Example 4: Error with Retry
<ErrorAlert
  error={error}
  onRetry={() => refetch()}
/>
*/
