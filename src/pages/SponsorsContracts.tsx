import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Upload, CheckCircle, Clock, DollarSign, Calendar, Target } from "lucide-react";

const SponsorsContracts = () => {
  const contracts = [
    {
      company: "NVIDIA Corporation",
      package: "Platinum Sponsorship",
      status: "Active",
      signed: "Mar 15, 2025",
      value: "$80,000",
      deliverables: 12,
      completion: 85,
      renewal: "Dec 15, 2025",
    },
    {
      company: "Google Cloud Platform",
      package: "Gold Sponsorship",
      status: "Pending",
      signed: "Mar 20, 2025",
      value: "$75,000",
      deliverables: 10,
      completion: 0,
      renewal: "Apr 20, 2025",
    },
    {
      company: "Microsoft Azure",
      package: "Gold Sponsorship",
      status: "Active",
      signed: "Feb 10, 2025",
      value: "$65,000",
      deliverables: 10,
      completion: 60,
      renewal: "Nov 10, 2025",
    },
  ];

  const stats = [
    { label: "Active Contracts", value: "8", icon: FileText },
    { label: "Completion Rate", value: "75%", icon: Target },
    { label: "Pending Contracts", value: "2", icon: Clock },
    { label: "Total Value", value: "$155K", icon: DollarSign },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "Pending": return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "Expired": return "bg-red-500/10 text-red-700 border-red-500/20";
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
              <h1 className="text-3xl font-bold">Contract Management</h1>
              <p className="text-muted-foreground">Digital contracts with progress tracking</p>
            </div>
          </div>
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Contract
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

        {/* Contracts List */}
        <div className="space-y-4">
          {contracts.map((contract, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold">{contract.company}</h3>
                        <p className="text-sm text-muted-foreground">{contract.package}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(contract.status)}>
                      {contract.status}
                    </Badge>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Signed
                      </p>
                      <p className="text-sm font-semibold">{contract.signed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Value
                      </p>
                      <p className="text-sm font-semibold">{contract.value}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Deliverables
                      </p>
                      <p className="text-sm font-semibold">{contract.deliverables}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Renewal
                      </p>
                      <p className="text-sm font-semibold">{contract.renewal}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Completion Progress</p>
                      <p className="text-sm text-muted-foreground">{contract.completion}%</p>
                    </div>
                    <Progress value={contract.completion} className="h-2" />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm">View Contract</Button>
                    <Button size="sm" variant="outline">Track Progress</Button>
                    <Button size="sm" variant="outline">
                      {contract.status === "Active" ? "Renewal Alert" : "Send Reminder"}
                    </Button>
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

export default SponsorsContracts;
