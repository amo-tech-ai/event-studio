// Dashboard Layout Examples for event-studio

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Filter, Download, Calendar } from 'lucide-react';

// ============================================================================
// 1. STANDARD DASHBOARD WITH SIDEBAR
// ============================================================================

export function StandardDashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Metric cards */}
        </div>

        {/* Main Content */}
        <Card className="p-6">{/* Content */}</Card>
      </main>
    </div>
  );
}

// ============================================================================
// 2. DASHBOARD WITH ACTIONS BAR
// ============================================================================

export function DashboardWithActionsBar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-gray-600">Manage your events</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Content */}
        <Card className="p-6">{/* Table */}</Card>
      </main>
    </div>
  );
}

// ============================================================================
// 3. TABBED DASHBOARD
// ============================================================================

export function TabbedDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Analytics</h1>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {/* Metrics */}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">{/* Chart 1 */}</Card>
              <Card className="p-6">{/* Chart 2 */}</Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue">{/* Revenue content */}</TabsContent>
          <TabsContent value="bookings">{/* Bookings content */}</TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// ============================================================================
// 4. SPLIT VIEW (LIST + DETAIL)
// ============================================================================

export function SplitViewDashboard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex">
        {/* List Panel */}
        <div className="w-96 border-r bg-white p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Events</h2>
          <Input placeholder="Search..." className="mb-4" />

          {/* List items */}
          <Card
            className="p-4 cursor-pointer hover:bg-gray-50 mb-2"
            onClick={() => setSelectedId('1')}
          >
            <h3 className="font-semibold">Event Title</h3>
            <p className="text-sm text-gray-600">Date & Location</p>
          </Card>
        </div>

        {/* Detail Panel */}
        <div className="flex-1 p-8 overflow-y-auto">
          {selectedId ? (
            <>
              <h1 className="text-3xl font-bold mb-6">Event Details</h1>
              <Card className="p-6">{/* Details */}</Card>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select an event to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. GRID VIEW DASHBOARD
// ============================================================================

export function GridViewDashboard() {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header with View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Events</h1>
          <div className="flex gap-4">
            <Button
              variant={view === 'grid' ? 'default' : 'outline'}
              onClick={() => setView('grid')}
            >
              Grid
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              onClick={() => setView('list')}
            >
              List
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Input placeholder="Search..." className="max-w-sm" />
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Grid or List View */}
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Card className="overflow-hidden">
              <img
                src="https://via.placeholder.com/400x200"
                alt="Event"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-2">Event Title</h3>
                <p className="text-sm text-gray-600">Date & Location</p>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="p-6">{/* List/table view */}</Card>
        )}
      </main>
    </div>
  );
}

// ============================================================================
// 6. RESPONSIVE MOBILE-FIRST
// ============================================================================

export function ResponsiveDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Page Header - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600">Welcome back!</p>
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
        </div>

        {/* Metrics - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {/* Metric cards */}
        </div>

        {/* Content - Stack on mobile, grid on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-4 sm:p-6">{/* Main content */}</Card>
          <Card className="p-4 sm:p-6">{/* Sidebar content */}</Card>
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// 7. STICKY HEADER DASHBOARD
// ============================================================================

export function StickyHeaderDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 bg-white border-b p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Events Dashboard</h1>
              <p className="text-sm text-gray-600">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="space-y-6">{/* Content sections */}</div>
        </main>
      </div>
    </div>
  );
}
