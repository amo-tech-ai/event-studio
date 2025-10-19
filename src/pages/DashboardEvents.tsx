import { Search, Plus, Grid3x3, List, Filter, Calendar, MapPin } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvents } from "@/features/events/hooks/useEvents";
import { StatusBadge, PageLoader, ErrorAlert, EmptyState } from "@/components/dashboard";

const DashboardEvents = () => {
  // Use real database data instead of hardcoded events
  const { data: events = [], isLoading, error, refetch } = useEvents();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Events</h1>
                <p className="text-muted-foreground">Manage and track all your events</p>
              </div>
              <Button className="btn-hero gap-2">
                <Plus className="w-5 h-5" />
                Create Event
              </Button>
            </div>

            {/* Error Alert */}
            {error && <ErrorAlert error={error} onRetry={refetch} />}

            {/* Loading State */}
            {isLoading && <PageLoader />}

            {/* Content - Only show if not loading and no error */}
            {!isLoading && !error && (
            <div>
            {/* Filters & Search */}
            <div className="mb-6">
              <Tabs defaultValue="active" className="mb-4">
                <TabsList>
                  <TabsTrigger value="active">Active <span className="ml-1 text-xs">(4)</span></TabsTrigger>
                  <TabsTrigger value="draft">Draft <span className="ml-1 text-xs">(0)</span></TabsTrigger>
                  <TabsTrigger value="past">Past <span className="ml-1 text-xs">(0)</span></TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search event, location, etc" 
                    className="pl-10"
                  />
                </div>
                
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Filter
                </Button>

                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Category</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="food">Food & Culinary</SelectItem>
                    <SelectItem value="wellness">Health & Wellness</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="month">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="This Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2 border-l pl-4">
                  <Button variant="outline" size="icon">
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden hover-lift cursor-pointer transition-all group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=250&fit=crop"
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <StatusBadge status={event.status as 'active' | 'draft' | 'cancelled' | 'completed' | 'pending' | 'published'} />
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(event.start_at).toLocaleDateString()}
                        </p>
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{event.name}</h3>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 flex items-start gap-1">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">Event Location</span>
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Capacity</span>
                        <span className="font-medium">{event.capacity || 'N/A'}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: '75%' }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">${(event.price_cents / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{events.length}</span> out of <span className="font-medium">{events.length}</span>
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </div>
            </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardEvents;
