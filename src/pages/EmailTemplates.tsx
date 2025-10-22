import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Plus,
  Search,
  Upload,
  Download,
  Store,
  Send,
  Settings,
  BarChart3,
  Clock,
  Users,
  Eye,
  Smartphone,
  Monitor,
} from "lucide-react";

const mockTemplates = [
  {
    id: 1,
    name: "Welcome Email",
    category: "confirmation",
    status: "active",
    lastModified: "2024-01-15",
    sent: 1247,
    opened: 856,
    clicked: 423,
  },
  {
    id: 2,
    name: "Registration Confirmation",
    category: "confirmation",
    status: "active",
    lastModified: "2024-01-14",
    sent: 2134,
    opened: 1523,
    clicked: 892,
  },
  {
    id: 3,
    name: "Event Reminder - 24h",
    category: "reminder",
    status: "active",
    lastModified: "2024-01-13",
    sent: 987,
    opened: 745,
    clicked: 334,
  },
  {
    id: 4,
    name: "Post-Event Follow-up",
    category: "followup",
    status: "draft",
    lastModified: "2024-01-12",
    sent: 0,
    opened: 0,
    clicked: 0,
  },
  {
    id: 5,
    name: "Cancellation Notice",
    category: "cancellation",
    status: "active",
    lastModified: "2024-01-10",
    sent: 45,
    opened: 38,
    clicked: 12,
  },
];

const categories = [
  { id: "all", name: "All Templates", icon: Mail, count: 24 },
  { id: "confirmation", name: "Confirmation", icon: Mail, count: 8 },
  { id: "reminder", name: "Reminders", icon: Clock, count: 6 },
  { id: "followup", name: "Follow-up", icon: Send, count: 5 },
  { id: "cancellation", name: "Cancellation", icon: Mail, count: 3 },
  { id: "custom", name: "Custom", icon: Settings, count: 2 },
];

export default function EmailTemplates() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(1);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  const selectedTemplateData = mockTemplates.find((t) => t.id === selectedTemplate);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 border-r bg-card p-6">
          <div className="mb-6">
            <h2 className="mb-4 text-2xl font-bold">Email Templates</h2>
            <div className="flex gap-2">
              <Button className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                New Template
              </Button>
            </div>
          </div>

          <div className="mb-4 flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Store className="mr-2 h-4 w-4" />
              Library
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search templates..." className="pl-10" />
            </div>
          </div>

          <div className="mb-6 space-y-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <div className="flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </div>
                <Badge variant="secondary">{category.count}</Badge>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Recent Templates</h3>
            {mockTemplates.slice(0, 5).map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  selectedTemplate === template.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-accent"
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium">{template.name}</span>
                  <Badge variant={template.status === "active" ? "default" : "secondary"}>
                    {template.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{template.sent} sent</span>
                  <span>{((template.opened / template.sent) * 100).toFixed(0)}% opened</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <Tabs defaultValue="editor" className="w-full">
              <TabsList>
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Template Builder</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <label className="mb-2 block text-sm font-medium">Template Name</label>
                        <Input value={selectedTemplateData?.name} />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">Subject Line</label>
                        <Input placeholder="Your registration for {{event_name}} is confirmed!" />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">Preheader Text</label>
                        <Input placeholder="Thank you for registering. Here are your event details..." />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">Email Body</label>
                        <div className="min-h-[400px] rounded-lg border bg-card p-6">
                          <div className="space-y-4 text-sm">
                            <p className="font-semibold">Hi {"{{attendee_name}}"},</p>
                            <p>
                              Thank you for registering for <strong>{"{{event_name}}"}</strong>!
                            </p>
                            <div className="rounded-lg border bg-muted p-4">
                              <p className="mb-2 font-semibold">Event Details:</p>
                              <p>📅 Date: {"{{event_date}}"}</p>
                              <p>📍 Location: {"{{event_location}}"}</p>
                              <p>🎫 Ticket: {"{{ticket_type}}"}</p>
                            </div>
                            <Button>View Your Ticket</Button>
                            <p className="text-muted-foreground">See you there!</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button>
                          <Send className="mr-2 h-4 w-4" />
                          Save Template
                        </Button>
                        <Button variant="outline">
                          <Mail className="mr-2 h-4 w-4" />
                          Send Test
                        </Button>
                        <Button variant="outline">
                          <Settings className="mr-2 h-4 w-4" />
                          A/B Test
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Email Preview</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant={previewDevice === "desktop" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPreviewDevice("desktop")}
                      >
                        <Monitor className="mr-2 h-4 w-4" />
                        Desktop
                      </Button>
                      <Button
                        variant={previewDevice === "mobile" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPreviewDevice("mobile")}
                      >
                        <Smartphone className="mr-2 h-4 w-4" />
                        Mobile
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`mx-auto rounded-lg border bg-white p-6 ${
                        previewDevice === "mobile" ? "max-w-sm" : "max-w-2xl"
                      }`}
                    >
                      <div className="mb-4 border-b pb-4">
                        <p className="text-sm text-muted-foreground">From: events@techconf.com</p>
                        <p className="text-sm text-muted-foreground">
                          Subject: Your registration for Tech Conference 2024 is confirmed!
                        </p>
                      </div>
                      <div className="space-y-4 text-sm text-foreground">
                        <p className="font-semibold">Hi John Doe,</p>
                        <p>
                          Thank you for registering for <strong>Tech Conference 2024</strong>!
                        </p>
                        <div className="rounded-lg border bg-muted p-4">
                          <p className="mb-2 font-semibold">Event Details:</p>
                          <p>📅 Date: June 15, 2024</p>
                          <p>📍 Location: San Francisco Convention Center</p>
                          <p>🎫 Ticket: Early Bird</p>
                        </div>
                        <Button>View Your Ticket</Button>
                        <p className="text-muted-foreground">See you there!</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Template Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="mb-4 font-semibold">Sending Schedule</h3>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="schedule" defaultChecked />
                          <span>Send immediately after registration</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="schedule" />
                          <span>Schedule for specific time</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 font-semibold">Audience Targeting</h3>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span>All registrants</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" />
                          <span>VIP ticket holders only</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" />
                          <span>Early bird registrants</span>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Emails Sent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{selectedTemplateData?.sent}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Open Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {selectedTemplateData
                          ? ((selectedTemplateData.opened / selectedTemplateData.sent) * 100).toFixed(1)
                          : 0}
                        %
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Click Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">
                        {selectedTemplateData
                          ? ((selectedTemplateData.clicked / selectedTemplateData.sent) * 100).toFixed(1)
                          : 0}
                        %
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
