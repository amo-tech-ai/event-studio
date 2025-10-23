import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, AlertCircle, Target } from "lucide-react";

const SponsorsAnalytics = () => {
  const sponsorHealth = [
    { status: "Excellent", count: 8, color: "text-green-600" },
    { status: "Good", count: 12, color: "text-blue-600" },
    { status: "At Risk", count: 2, color: "text-red-600" },
  ];

  const topPerformers = [
    { name: "NVIDIA Corp.", roi: "180%", satisfaction: "95%" },
    { name: "Google Cloud", roi: "150%", satisfaction: "92%" },
    { name: "Microsoft", roi: "140%", satisfaction: "88%" },
  ];

  const recommendations = [
    { icon: "🎯", text: "Focus on 2 at-risk sponsors" },
    { icon: "⏰", text: "Optimize proposal timing" },
    { icon: "📈", text: "Revenue forecast: +35% next quarter" },
    { icon: "🔄", text: "3 renewal opportunities" },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Sponsor Analytics</h1>
            <p className="text-muted-foreground">AI-powered performance insights and predictions</p>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue Trend Chart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <div className="text-center space-y-2">
                <TrendingUp className="h-12 w-12 text-primary mx-auto" />
                <p className="text-sm text-muted-foreground">
                  📈 Line chart showing 6-month revenue growth
                </p>
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Brain className="h-4 w-4" />
                  <p className="text-sm font-medium">AI Prediction: +35% next quarter</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sponsor Health & Top Performers */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Sponsor Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Sponsor Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sponsorHealth.map((health, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <AlertCircle className={`h-5 w-5 ${health.color}`} />
                      <span className="font-medium">{health.status}</span>
                    </div>
                    <span className="text-2xl font-bold">{health.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Sponsors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((sponsor, idx) => (
                  <div key={idx} className="flex items-center justify-between pb-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{sponsor.name}</p>
                      <p className="text-sm text-muted-foreground">ROI: {sponsor.roi}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{sponsor.satisfaction}</p>
                      <p className="text-xs text-muted-foreground">Satisfaction</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-background">
                  <span className="text-xl">{rec.icon}</span>
                  <span className="text-sm">{rec.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SponsorsAnalytics;
