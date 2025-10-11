import { Search, Plus, Grid3x3, List, Filter, Calendar, MapPin } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DashboardEvents = () => {
  const events = [
    {
      id: 1,
      title: "Symphony Under the Stars",
      category: "Music",
      location: "Sunset Park, Los Angeles, CA",
      date: "Apr 20, 2029",
      time: "7:00 PM",
      price: "$50",
      sold: 75,
      status: "Active",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "Tech Future Expo",
      category: "Technology",
      location: "Silicon Valley, San Jose, CA",
      date: "June 1, 2029",
      time: "10:00 AM",
      price: "$80",
      sold: 55,
      status: "Active",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Culinary Delights Festival",
      category: "Food & Culinary",
      location: "Gourmet Plaza, San Francisco, CA",
      date: "May 25, 2029",
      time: "11:00 AM",
      price: "$45",
      sold: 60,
      status: "Active",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "Global Wellness Summit",
      category: "Health & Wellness",
      location: "Wellness Arena, Miami, FL",
      date: "May 5, 2029",
      time: "9:00 AM",
      price: "$75",
      sold: 40,
      status: "Active",
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=250&fit=crop"
    }
  ];

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
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                        {event.category}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary/90 backdrop-blur-sm">
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {event.date} · {event.time}
                        </p>
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{event.title}</h3>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 flex items-start gap-1">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Tickets Sold</span>
                        <span className="font-medium">{event.sold}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: `${event.sold}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{event.price}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">4</span> out of <span className="font-medium">4</span>
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardEvents;
