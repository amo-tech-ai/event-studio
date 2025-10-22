import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
} from "lucide-react";

// Mock data for analytics
const mockMetrics = {
  totalRegistrations: { value: 1247, change: 12, trend: "up" },
  totalRevenue: { value: 124750, change: 8, trend: "up" },
  conversionRate: { value: 68.5, change: 3, trend: "up" },
  avgOrderValue: { value: 99.84, change: 5, trend: "up" },
  successRate: { value: 91.2, change: 2, trend: "up" },
  abandonmentRate: { value: 31.5, change: -4, trend: "down" },
};

const funnelData = [
  { step: "Event Page", count: 5247, percentage: 100, conversion: 100 },
  { step: "Registration Started", count: 1247, percentage: 23.8, conversion: 23.8 },
  { step: "Payment Initiated", count: 854, percentage: 68.5, conversion: 16.3 },
  { step: "Payment Completed", count: 779, percentage: 91.2, conversion: 14.8 },
];

const deviceData = [
  { device: "Mobile", percentage: 65, color: "bg-primary" },
  { device: "Desktop", percentage: 30, color: "bg-secondary" },
  { device: "Tablet", percentage: 5, color: "bg-accent" },
];

export default function RegistrationAnalytics() {
  const { slug } = useParams();
  const [dateRange, setDateRange] = useState("7days");

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tech Conference 2024 Analytics</h1>
            <p className="text-muted-foreground">June 15, 2024 • San Francisco</p>
          </div>
          <div className="flex gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.totalRegistrations.value.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+{mockMetrics.totalRegistrations.change}%</span>
                <span className="ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockMetrics.totalRevenue.value.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+{mockMetrics.totalRevenue.change}%</span>
                <span className="ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.conversionRate.value}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+{mockMetrics.conversionRate.change}%</span>
                <span className="ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockMetrics.avgOrderValue.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+{mockMetrics.avgOrderValue.change}%</span>
                <span className="ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Payment Success</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.successRate.value}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+{mockMetrics.successRate.change}%</span>
                <span className="ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cart Abandonment</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMetrics.abandonmentRate.value}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">{mockMetrics.abandonmentRate.change}%</span>
                <span className="ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelData.map((step, index) => (
                <div key={step.step} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{step.step}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {step.count.toLocaleString()} users
                      </span>
                      <Badge variant={step.percentage > 50 ? "default" : "secondary"}>
                        {step.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="h-8 w-full rounded-lg bg-secondary">
                    <div
                      className="h-full rounded-lg bg-primary transition-all"
                      style={{ width: `${step.percentage}%` }}
                    />
                  </div>
                  {index < funnelData.length - 1 && (
                    <div className="flex items-center justify-center py-1">
                      <TrendingDown className="h-4 w-4 text-muted-foreground" />
                      <span className="ml-2 text-xs text-muted-foreground">
                        {funnelData[index + 1].percentage}% conversion
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceData.map((device) => (
                <div key={device.device} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{device.device}</span>
                    <span className="text-sm font-bold">{device.percentage}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${device.color} transition-all`}
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline">Schedule Reports</Button>
          <Button variant="outline">Settings</Button>
        </div>
      </div>
    </div>
  );
}
