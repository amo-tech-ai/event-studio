import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, FileText, Eye, Clock, DollarSign, TrendingUp, Package } from "lucide-react";

const SponsorsProposals = () => {
  const proposals = [
    {
      company: "NVIDIA Corporation",
      status: "Sent",
      created: "2h ago",
      views: 3,
      amount: "$80,000",
      probability: 75,
      package: "Platinum",
      sections: 9,
    },
    {
      company: "Google Cloud Platform",
      status: "Draft",
      created: "1d ago",
      views: 0,
      amount: "$75,000",
      probability: 60,
      package: "Gold",
      sections: 8,
    },
    {
      company: "Microsoft Azure",
      status: "Viewed",
      created: "3d ago",
      views: 5,
      amount: "$65,000",
      probability: 80,
      package: "Gold",
      sections: 8,
    },
  ];

  const stats = [
    { label: "Total Proposals", value: "15", icon: FileText },
    { label: "Response Rate", value: "65%", icon: TrendingUp },
    { label: "Avg Deal Size", value: "$2.5M", icon: DollarSign },
    { label: "Pipeline Value", value: "$1.2M", icon: Package },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent": return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "Draft": return "bg-gray-500/10 text-gray-700 border-gray-500/20";
      case "Viewed": return "bg-green-500/10 text-green-700 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">AI Proposal Management</h1>
              <p className="text-muted-foreground">AI-generated proposals with intelligent tracking</p>
            </div>
          </div>
          <Button className="gap-2">
            <Brain className="h-4 w-4" />
            Create New Proposal
          </Button>
        </div>

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

        {/* Proposals List */}
        <div className="space-y-4">
          {proposals.map((proposal, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Brain className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          AI Proposal: {proposal.company}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge className={getStatusColor(proposal.status)}>
                            {proposal.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {proposal.created}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {proposal.views} views
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="text-lg font-semibold flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {proposal.amount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Probability</p>
                      <p className="text-lg font-semibold flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {proposal.probability}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Package</p>
                      <p className="text-lg font-semibold flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {proposal.package}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Sections</p>
                      <p className="text-lg font-semibold flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {proposal.sections}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm">View Proposal</Button>
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">Send Follow-up</Button>
                    <Button size="sm" variant="outline">Analytics</Button>
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

export default SponsorsProposals;
