import { Calendar, DollarSign, TrendingUp, Users, MoreVertical, Bell, Settings, Search } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
  const stats = [
    { label: "Total Events", value: "0", icon: Calendar, change: "+0%", iconBg: "bg-primary/10" },
    { label: "Total Bookings", value: "0", icon: Users, change: "+0%", iconBg: "bg-primary/10" },
    { label: "Revenue", value: "$0", icon: DollarSign, change: "+0%", iconBg: "bg-primary/10" },
    { label: "Tickets Sold", value: "0", icon: TrendingUp, change: "+0%", iconBg: "bg-primary/10" }
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, i) => (
                <Card key={i} className="p-6 hover-lift cursor-pointer transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                  <span className="text-xs text-primary font-medium">{stat.change}</span>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Revenue Trend */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold mb-1">Revenue Trend</h3>
                    <p className="text-sm text-muted-foreground">Last 30 days</p>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground">Chart: Revenue over time</p>
                </div>
              </Card>

              {/* Popular Events */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold mb-1">Popular Events</h3>
                    <p className="text-sm text-muted-foreground">By ticket sales</p>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground">Chart: Top events</p>
                </div>
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
