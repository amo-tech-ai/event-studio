import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Bot, Sparkles, Target, TrendingUp, Mail, Share2, Users, DollarSign, Send, Eye, MousePointer } from "lucide-react";

interface Campaign {
  id: number;
  name: string;
  channel: "social" | "email" | "ads" | "pr";
  status: "active" | "draft" | "completed";
  reach: number;
  engagement: number;
  conversions: number;
  budget: number;
  spent: number;
  roi: number;
}

export default function AIMarketingDashboard() {
  const [message, setMessage] = useState("");
  const [campaigns] = useState<Campaign[]>([
    {
      id: 1,
      name: "LinkedIn Campaign",
      channel: "social",
      status: "active",
      reach: 15000,
      engagement: 1200,
      conversions: 85,
      budget: 2000,
      spent: 1500,
      roi: 250,
    },
    {
      id: 2,
      name: "Email Sequence",
      channel: "email",
      status: "active",
      reach: 8000,
      engagement: 3200,
      conversions: 145,
      budget: 500,
      spent: 500,
      roi: 320,
    },
    {
      id: 3,
      name: "Twitter Thread",
      channel: "social",
      status: "completed",
      reach: 12000,
      engagement: 950,
      conversions: 65,
      budget: 1000,
      spent: 1000,
      roi: 180,
    },
  ]);

  const channelIcons = {
    social: <Share2 className="h-4 w-4" />,
    email: <Mail className="h-4 w-4" />,
    ads: <Target className="h-4 w-4" />,
    pr: <Users className="h-4 w-4" />,
  };

  const channelColors = {
    social: "bg-blue-500",
    email: "bg-purple-500",
    ads: "bg-orange-500",
    pr: "bg-green-500",
  };

  const totalReach = campaigns.reduce((sum, c) => sum + c.reach, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const avgROI = Math.round(campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">AI Marketing Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Generate high-impact marketing campaigns with AI</p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-[60%_40%] gap-6">
          {/* LEFT - Chat & Campaigns */}
          <div className="space-y-6">
            {/* AI Assistant Card */}
            <Card className="p-6 border-primary/20 bg-primary/5">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">AI Marketing Strategy</span>
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Multi-channel approach with <strong>{avgROI}% ROI</strong> reaching <strong>{totalReach.toLocaleString()}+</strong> potential attendees.
                  </p>
                </div>
              </div>
            </Card>

            {/* Chat Input */}
            <Card className="p-4">
              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me to create campaigns, optimize targeting, or analyze performance..."
                  className="resize-none"
                  rows={3}
                />
                <Button size="icon" className="h-auto">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button variant="outline" size="sm" onClick={() => setMessage("Create social media campaign")}>
                  Social ads
                </Button>
                <Button variant="outline" size="sm" onClick={() => setMessage("Design email sequence")}>
                  Email series
                </Button>
                <Button variant="outline" size="sm" onClick={() => setMessage("Find influencers")}>
                  Influencer collab
                </Button>
              </div>
            </Card>

            {/* Active Campaigns */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Active Campaigns</h3>
                <Button size="sm" className="gap-2">
                  <Target className="h-4 w-4" />
                  New Campaign
                </Button>
              </div>

              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full ${channelColors[campaign.channel]} flex items-center justify-center text-white flex-shrink-0`}>
                        {channelIcons[campaign.channel]}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{campaign.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={campaign.status === "active" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {campaign.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {campaign.channel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Eye className="h-3 w-3" />
                        <span>Reach</span>
                      </div>
                      <p className="text-lg font-semibold">{campaign.reach.toLocaleString()}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <MousePointer className="h-3 w-3" />
                        <span>Engagement</span>
                      </div>
                      <p className="text-lg font-semibold">{campaign.engagement.toLocaleString()}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Target className="h-3 w-3" />
                        <span>Conversions</span>
                      </div>
                      <p className="text-lg font-semibold text-primary">{campaign.conversions}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>ROI</span>
                      </div>
                      <p className="text-lg font-semibold text-green-600">{campaign.roi}%</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-muted-foreground">Budget: ${campaign.spent} / ${campaign.budget}</span>
                      <span className="font-medium">{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
                    </div>
                    <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <Target className="h-3 w-3 mr-1" />
                      Launch
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* RIGHT - Analytics & Insights */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Total Reach</span>
                  </div>
                  <div className="text-2xl font-bold">{totalReach.toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>+35% this month</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-xs text-muted-foreground mb-1">Conversions</div>
                    <div className="text-xl font-bold">{totalConversions}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="text-xs text-muted-foreground mb-1">Avg ROI</div>
                    <div className="text-xl font-bold text-green-600">{avgROI}%</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Budget Spent</span>
                    <span className="font-semibold">${totalSpent} / ${totalBudget}</span>
                  </div>
                  <Progress value={(totalSpent / totalBudget) * 100} className="h-2" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Recommendations
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm">
                    <strong>High Performer:</strong> Your email campaign has 320% ROI. Consider doubling the budget.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm">
                    <strong>Optimization:</strong> LinkedIn posts at 10 AM get 40% more engagement.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm">
                    <strong>New Channel:</strong> Instagram Stories could reach 8,000+ additional users.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Campaign Channels</h3>
              <div className="space-y-3">
                {Object.entries(channelColors).map(([channel, color]) => {
                  const channelCampaigns = campaigns.filter(c => c.channel === channel);
                  if (channelCampaigns.length === 0) return null;
                  
                  const channelReach = channelCampaigns.reduce((sum, c) => sum + c.reach, 0);
                  
                  return (
                    <div key={channel}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${color}`} />
                          <span className="text-sm capitalize">{channel}</span>
                        </div>
                        <span className="text-sm font-semibold">{channelReach.toLocaleString()}</span>
                      </div>
                      <Progress value={(channelReach / totalReach) * 100} className="h-1.5" />
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Share2 className="h-4 w-4" />
                  Create Social Post
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Mail className="h-4 w-4" />
                  Design Email
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Target className="h-4 w-4" />
                  Launch Ad Campaign
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  Find Influencers
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
