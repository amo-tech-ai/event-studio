import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Users, Target, DollarSign, AlertCircle } from "lucide-react";

const SponsorsOverview = () => {
  const kpiData = [
    { title: "Total Revenue", value: "$125,400", change: "+25%", icon: DollarSign },
    { title: "Active Sponsors", value: "45", change: "+8", icon: Users },
    { title: "Win Rate", value: "78%", change: "+5%", icon: Target },
    { title: "Active Deals", value: "12", change: "+3", icon: TrendingUp },
  ];

  const aiInsights = [
    { icon: "🔥", text: "3 hot leads identified", type: "success" },
    { icon: "⚠️", text: "Renewal risk: 2 sponsors", type: "warning" },
    { icon: "📈", text: "Revenue up 25% this month", type: "success" },
    { icon: "🎯", text: "Optimize proposal timing", type: "info" },
  ];

  const topSponsors = [
    { name: "TechCorp Inc.", revenue: "$25,000", roi: "180%", status: "Excellent" },
    { name: "StartupHub Ltd.", revenue: "$15,000", roi: "150%", status: "Good" },
    { name: "InnovateLabs", revenue: "$12,500", roi: "140%", status: "Good" },
  ];

  const recentActivity = [
    { action: "AI-generated proposal sent to NVIDIA", time: "2 hours ago" },
    { action: "Contract signed with Google Cloud", time: "5 hours ago" },
    { action: "New sponsor match found (94%)", time: "1 day ago" },
    { action: "Performance report generated", time: "2 days ago" },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">AI-Powered Sponsor Management</h1>
            <p className="text-muted-foreground">Intelligent insights and automation for sponsor success</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi) => (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <kpi.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-green-600">{kpi.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Insights */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiInsights.map((insight, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-background">
                  <span className="text-xl">{insight.icon}</span>
                  <span className="text-sm">{insight.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <AlertCircle className="h-4 w-4 text-primary mt-1" />
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Sponsors */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Sponsors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSponsors.map((sponsor, idx) => (
                  <div key={idx} className="flex items-center justify-between pb-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{sponsor.name}</p>
                      <p className="text-sm text-muted-foreground">{sponsor.revenue}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{sponsor.roi}</p>
                      <p className="text-xs text-muted-foreground">{sponsor.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button className="gap-2">
            <Brain className="h-4 w-4" />
            Generate Proposal
          </Button>
          <Button variant="outline" className="gap-2">
            <Target className="h-4 w-4" />
            Find Sponsors
          </Button>
          <Button variant="outline" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            View Analytics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SponsorsOverview;
