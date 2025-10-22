import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, DollarSign, TrendingUp, Users, CheckCircle, Clock, Upload, Calendar, Mail, Phone } from "lucide-react";

const SponsorsPortal = () => {
  const performanceMetrics = [
    { label: "Investment", value: "$80,000", icon: DollarSign },
    { label: "ROI", value: "180%", icon: TrendingUp, color: "text-green-600" },
    { label: "Leads Generated", value: "250", icon: Users },
    { label: "Impressions", value: "15,000", icon: TrendingUp },
  ];

  const deliverables = [
    { name: "Logo Placement (Website)", status: "Completed", type: "completed" },
    { name: "Speaking Slot (Keynote)", status: "Scheduled", type: "scheduled" },
    { name: "Booth Setup (10x10)", status: "In Progress", type: "progress" },
    { name: "Social Media Features", status: "Pending", type: "pending" },
  ];

  const teamMembers = [
    { name: "Sarah Johnson", role: "Partnership Manager", email: "sarah@eventos.com", phone: "(555) 123-4567" },
    { name: "Mike Chen", role: "Technical Support", email: "mike@eventos.com", phone: "(555) 234-5678" },
  ];

  const getStatusColor = (type: string) => {
    switch (type) {
      case "completed": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "scheduled": return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "progress": return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "pending": return "bg-gray-500/10 text-gray-700 border-gray-500/20";
      default: return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "scheduled": return <Calendar className="h-4 w-4 text-blue-600" />;
      case "progress": return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Welcome, NVIDIA Corporation</h1>
            <p className="text-muted-foreground">Your sponsorship portal and performance dashboard</p>
          </div>
        </div>

        {/* Performance Overview */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Your Sponsorship Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {performanceMetrics.map((metric, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-background">
                  <div className="flex items-center gap-2 mb-2">
                    <metric.icon className={`h-4 w-4 ${metric.color || 'text-primary'}`} />
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                  </div>
                  <p className={`text-2xl font-bold ${metric.color || ''}`}>{metric.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-background flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <div>
                <p className="text-sm font-medium">Satisfaction: 95%</p>
                <p className="text-xs text-muted-foreground">Renewal Likelihood: High</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deliverables & Assets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Deliverables & Assets</span>
              <Button size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Assets
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deliverables.map((deliverable, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(deliverable.type)}
                    <div>
                      <p className="font-medium">{deliverable.name}</p>
                      <Badge className={getStatusColor(deliverable.type)}>
                        {deliverable.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button variant="outline" size="sm">View Guidelines</Button>
              <Button variant="outline" size="sm">Track Progress</Button>
            </div>
          </CardContent>
        </Card>

        {/* Event Team */}
        <Card>
          <CardHeader>
            <CardTitle>Your Event Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <a href={`mailto:${member.email}`} className="text-sm flex items-center gap-1 text-primary hover:underline">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </a>
                        <a href={`tel:${member.phone}`} className="text-sm flex items-center gap-1 text-primary hover:underline">
                          <Phone className="h-3 w-3" />
                          {member.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Meeting
              </Button>
              <Button size="sm" variant="outline" className="gap-2">
                <Mail className="h-4 w-4" />
                Send Message
              </Button>
              <Button size="sm" variant="outline">View Calendar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SponsorsPortal;
