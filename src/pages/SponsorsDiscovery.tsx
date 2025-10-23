import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Brain, Building2, MapPin, DollarSign, Star, TrendingUp } from "lucide-react";

const SponsorsDiscovery = () => {
  const matches = [
    {
      company: "NVIDIA Corporation",
      matchScore: 94,
      industry: "Technology",
      budget: "$50K-$150K",
      location: "San Jose, CA",
      events: "15+ events",
      rating: 4.8,
      reason: "Perfect match: AI focus, enterprise audience",
    },
    {
      company: "Google Cloud Platform",
      matchScore: 91,
      industry: "Cloud Computing",
      budget: "$60K-$200K",
      location: "Mountain View, CA",
      events: "25+ events",
      rating: 4.9,
      reason: "Strong match: ML focus, developer audience",
    },
    {
      company: "Microsoft Azure",
      matchScore: 89,
      industry: "Enterprise Software",
      budget: "$55K-$180K",
      location: "Redmond, WA",
      events: "20+ events",
      rating: 4.7,
      reason: "Good match: Enterprise focus, global reach",
    },
  ];

  const stats = [
    { label: "Matches Found", value: "50", icon: Building2 },
    { label: "AI Accuracy", value: "85%", icon: Brain },
    { label: "Hot Leads", value: "12", icon: TrendingUp },
    { label: "Pipeline Value", value: "$2.5M", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Search className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">AI Sponsor Discovery</h1>
              <p className="text-muted-foreground">Intelligent sponsor matching powered by AI</p>
            </div>
          </div>
          <Button className="gap-2">
            <Brain className="h-4 w-4" />
            AI Search
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input 
                placeholder="Describe your ideal sponsor (e.g., 'tech companies interested in AI events')"
                className="flex-1"
              />
              <Button>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Match Results */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">AI Match Results (Top 10)</h2>
          </div>

          {matches.map((match, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold">{match.company}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline" className="gap-1">
                            <span className="text-xs">{match.industry}</span>
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <DollarSign className="h-3 w-3" />
                            {match.budget}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <MapPin className="h-3 w-3" />
                            {match.location}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-primary text-primary-foreground text-base px-3 py-1">
                      {match.matchScore}% Match
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      ✅ {match.events}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {match.rating}/5
                    </span>
                  </div>

                  {/* AI Reasoning */}
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <Brain className="h-4 w-4 text-primary mt-0.5" />
                    <p className="text-sm">{match.reason}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" className="gap-1">
                      <Brain className="h-3 w-3" />
                      Generate Proposal
                    </Button>
                    <Button size="sm" variant="outline">Contact</Button>
                    <Button size="sm" variant="outline">Save</Button>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorsDiscovery;
