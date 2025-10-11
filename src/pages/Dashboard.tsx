import { MoreVertical, Bell, Settings, Search, User, Calendar, TrendingUp, Users } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {
  const stats = [
    { label: "Upcoming Events", value: "345", icon: "📅", color: "bg-pink-500" },
    { label: "Total Bookings", value: "1,798", icon: "📊", color: "bg-purple-500" },
    { label: "Tickets Sold", value: "1,250", icon: "🎫", color: "bg-pink-400" }
  ];

  const recentActivity = [
    { 
      user: "Admin Stefanus Weber",
      action: "reviewed a refund request for Invoice ID:",
      detail: "INV1004",
      time: "05:30 PM"
    },
    { 
      user: "Wella McGrath",
      action: "updated ticket prices for the event:",
      detail: "Runway Revolution 2024",
      time: "02:00 PM"
    },
    { 
      user: "Patrick Cooper",
      action: "cancelled a booking with Invoice ID:",
      detail: "INV10014",
      time: "11:15 AM"
    }
  ];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-background border-b border-border px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search anything" 
                  className="pl-10 bg-muted/50 border-0"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full bg-accent/50 flex items-center justify-center hover:bg-accent transition-colors">
                <Bell className="w-5 h-5 text-foreground" />
              </button>
              <button className="w-10 h-10 rounded-full bg-accent/50 flex items-center justify-center hover:bg-accent transition-colors">
                <Settings className="w-5 h-5 text-foreground" />
              </button>
              <div className="flex items-center gap-3 ml-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground">OL</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-semibold">Orlando Laurentius</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Hello Orlando, welcome back!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, i) => (
                <Card key={i} className="p-6 hover-lift transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-2xl`}>
                      {stat.icon}
                    </div>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-4xl font-bold">{stat.value}</h3>
                </Card>
              ))}
            </div>

            {/* Charts and Upcoming Event Row */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Ticket Sales */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Ticket Sales</h3>
                  <Select defaultValue="week">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-center h-48">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full border-[20px] border-primary/20" style={{ borderTopColor: 'hsl(var(--primary))', borderRightColor: 'hsl(var(--primary))' }}></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-sm text-muted-foreground">Total Ticket</p>
                      <p className="text-3xl font-bold">2,780</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                      <span className="text-sm">Sold Out</span>
                    </div>
                    <span className="font-semibold">1,251</span>
                    <span className="text-sm text-muted-foreground">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-900"></div>
                      <span className="text-sm">Fully Booked</span>
                    </div>
                    <span className="font-semibold">834</span>
                    <span className="text-sm text-muted-foreground">30%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <span className="text-sm">Available</span>
                    </div>
                    <span className="font-semibold">695</span>
                    <span className="text-sm text-muted-foreground">25%</span>
                  </div>
                </div>
              </Card>

              {/* Sales Revenue */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Sales Revenue</h3>
                  <Select defaultValue="6months">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6months">Last 6 Months</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold">$348,805</p>
                </div>
                <div className="h-48 flex items-end justify-between gap-2">
                  {[45, 38, 52, 48, 58, 55, 62, 48].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col gap-1">
                      <div className="bg-gradient-to-t from-pink-400 to-pink-500 rounded-t" style={{ height: `${height}%` }}></div>
                      <div className="bg-gray-200 rounded-b" style={{ height: `${100 - height}%` }}></div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Upcoming Event */}
              <Card className="p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Upcoming Event</h3>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className="relative rounded-xl overflow-hidden mb-4 h-40 bg-gradient-to-br from-purple-600 to-pink-500">
                  <Badge className="absolute top-3 left-3 bg-pink-500">Music</Badge>
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <h4 className="font-bold text-lg mb-2">Rhythm & Beats Music Festival</h4>
                <p className="text-sm text-muted-foreground mb-4">Sunset Park, Los Angeles, CA</p>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  Immerse yourself in electrifying performances by top pop, rock, EDM, and hip-hop artists.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Apr 20, 2029</span>
                  </div>
                  <span className="text-xs text-muted-foreground">12:00 PM - 11:00 PM</span>
                </div>
                <Button className="w-full bg-pink-500 hover:bg-pink-600">View Details</Button>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Recent Activity</h3>
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        {" "}{activity.action}{" "}
                        <span className="font-medium">{activity.detail}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
