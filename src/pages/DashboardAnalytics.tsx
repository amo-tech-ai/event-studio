import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Users, Target, Award, Download, FileText } from "lucide-react";

export default function DashboardAnalytics() {
  const metrics = [
    { label: "Revenue", value: "$45,000", change: "+12%", icon: TrendingUp, trend: "up" },
    { label: "Attendees", value: "1,250", change: "+8%", icon: Users, trend: "up" },
    { label: "Conversion", value: "68.5%", change: "+3%", icon: Target, trend: "up" },
    { label: "Top Event", value: "TechConf", change: "89%", icon: Award, trend: "up" },
  ];

  const topEvents = [
    { name: "Tech Conference 2024", revenue: "$12,000", percentage: 89 },
    { name: "Startup Pitch Night", revenue: "$8,500", percentage: 76 },
    { name: "Design Workshop", revenue: "$6,200", percentage: 68 },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your event performance and insights</p>
        </div>
        <Select defaultValue="7days">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <metric.icon className="h-5 w-5" />
              </div>
              <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
            <p className="text-sm text-muted-foreground">{metric.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Revenue Over Time</h2>
        <div className="h-64 flex items-end justify-between gap-2">
          {[30, 45, 38, 55, 48, 62].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-primary rounded-t-lg transition-all hover:opacity-80"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs text-muted-foreground">Week {i + 1}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Attendee Demographics</h2>
          <div className="space-y-4">
            {[
              { label: "18-24 years", value: 25, color: "bg-blue-500" },
              { label: "25-34 years", value: 45, color: "bg-green-500" },
              { label: "35-44 years", value: 20, color: "bg-yellow-500" },
              { label: "45+ years", value: 10, color: "bg-purple-500" },
            ].map((demo, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{demo.label}</span>
                  <span className="text-sm font-medium">{demo.value}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`${demo.color} h-2 rounded-full transition-all`}
                    style={{ width: `${demo.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Top Performing Events</h2>
          <div className="space-y-4">
            {topEvents.map((event, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{event.name}</h3>
                  <p className="text-sm text-muted-foreground">{event.revenue}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-background rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${event.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium min-w-[3rem] text-right">{event.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="gap-2" size="lg">
          <FileText className="h-4 w-4" />
          Export PDF
        </Button>
        <Button variant="outline" className="gap-2" size="lg">
          <Download className="h-4 w-4" />
          Export Excel
        </Button>
      </div>
    </div>
  );
}
