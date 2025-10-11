import { Search, Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DashboardGallery = () => {
  const events = [
    {
      id: 1,
      title: "Echo Beats Festival",
      category: "Music",
      date: "May 20, 2029",
      image: "bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500"
    },
    {
      id: 2,
      title: "Culinary Delights Festival",
      category: "Food & Culinary",
      date: "May 25, 2029",
      image: "bg-gradient-to-br from-orange-400 via-red-400 to-pink-400"
    },
    {
      id: 3,
      title: "Artistry Unveiled Expo",
      category: "Art & Design",
      date: "May 15, 2029",
      image: "bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-200"
    },
    {
      id: 4,
      title: "Tech Future Expo",
      category: "Technology",
      date: "June 1, 2029",
      image: "bg-gradient-to-br from-purple-600 via-pink-500 to-purple-400"
    },
    {
      id: 5,
      title: "Runway Revolution 2029",
      category: "Fashion",
      date: "May 1, 2029",
      image: "bg-gradient-to-br from-pink-300 via-rose-200 to-pink-100"
    },
    {
      id: 6,
      title: "Global Wellness Summit",
      category: "Health & Wellness",
      date: "May 5, 2029",
      image: "bg-gradient-to-br from-sky-300 via-blue-200 to-cyan-100"
    },
    {
      id: 7,
      title: "Adventure Gear Show",
      category: "Outdoor & Adventure",
      date: "June 5, 2029",
      image: "bg-gradient-to-br from-purple-500 via-purple-400 to-purple-300"
    },
    {
      id: 8,
      title: "Symphony Under the Stars",
      category: "Music",
      date: "April 20, 2029",
      image: "bg-gradient-to-br from-blue-600 via-indigo-500 to-blue-400"
    },
    {
      id: 9,
      title: "Harmony Health Fair",
      category: "Health & Wellness",
      date: "June 15, 2029",
      image: "bg-gradient-to-br from-blue-300 via-cyan-200 to-blue-100"
    },
    {
      id: 10,
      title: "Live Paint Battle",
      category: "Art & Design",
      date: "June 20, 2029",
      image: "bg-gradient-to-br from-pink-300 via-rose-300 to-orange-200"
    },
    {
      id: 11,
      title: "Spring Trends Runway",
      category: "Fashion",
      date: "June 10, 2029",
      image: "bg-gradient-to-br from-blue-500 via-blue-400 to-blue-300"
    },
    {
      id: 12,
      title: "Champions League Final Viewing Party",
      category: "Sports",
      date: "May 10, 2029",
      image: "bg-gradient-to-br from-purple-600 via-blue-600 to-pink-500"
    }
  ];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Gallery</h1>
              <p className="text-muted-foreground">Browse and manage event media and assets</p>
            </div>

            {/* Filters */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search event" 
                    className="pl-10"
                  />
                </div>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Category</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="food">Food & Culinary</SelectItem>
                    <SelectItem value="art">Art & Design</SelectItem>
                    <SelectItem value="wellness">Health & Wellness</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="week">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="This Week" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" />
                  Create New Folder
                </Button>
              </div>
            </Card>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden hover-lift transition-all cursor-pointer group">
                  <div className={`h-48 ${event.image} relative`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all"></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-base mb-1 line-clamp-2">{event.title}</h3>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">{event.category}</Badge>
                      <span className="text-xs text-muted-foreground">{event.date}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button size="sm" className="bg-primary">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">...</Button>
              <Button variant="outline" size="sm">8</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardGallery;
