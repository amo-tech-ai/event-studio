import { Calendar, DollarSign, TrendingUp, Users, MoreVertical } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  const stats = [
    { label: "Total Events", value: "0", icon: Calendar, change: "+0%" },
    { label: "Total Bookings", value: "0", icon: Users, change: "+0%" },
    { label: "Revenue", value: "$0", icon: DollarSign, change: "+0%" },
    { label: "Tickets Sold", value: "0", icon: TrendingUp, change: "+0%" }
  ];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-foreground/60">Welcome back! Here's your overview.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <Card key={i} className="p-6 hover-lift cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="icon-box bg-primary/10">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm text-foreground/60 mb-2">{stat.label}</p>
                <span className="text-xs text-primary font-medium">{stat.change}</span>
              </Card>
            ))}
          </div>

          {/* Revenue Trend & Popular Events */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Revenue Trend</h3>
              <p className="text-sm text-foreground/60 mb-6">Last 30 days</p>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                <p className="text-foreground/40">Chart: Revenue over time</p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Popular Events</h3>
              <p className="text-sm text-foreground/60 mb-6">By ticket sales</p>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                <p className="text-foreground/40">Chart: Top events</p>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
            <div className="flex items-center justify-center h-32 border-2 border-dashed border-muted rounded-lg">
              <p className="text-foreground/40">No recent activity</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
