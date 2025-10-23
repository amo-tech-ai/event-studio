import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Sparkles, TrendingUp, Ticket, DollarSign, Users, Send, Plus, Trash2 } from "lucide-react";

interface TicketTier {
  id: number;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  description: string;
}

export default function AITicketingSetup() {
  const [message, setMessage] = useState("");
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([
    {
      id: 1,
      name: "Early Bird",
      price: 99,
      quantity: 100,
      sold: 75,
      description: "Limited early access tickets",
    },
    {
      id: 2,
      name: "General Admission",
      price: 149,
      quantity: 200,
      sold: 120,
      description: "Standard event access",
    },
    {
      id: 3,
      name: "VIP Package",
      price: 299,
      quantity: 50,
      sold: 30,
      description: "Premium experience with exclusive perks",
    },
  ]);

  const totalRevenue = ticketTiers.reduce((sum, tier) => sum + tier.price * tier.sold, 0);
  const potentialRevenue = ticketTiers.reduce((sum, tier) => sum + tier.price * tier.quantity, 0);
  const totalSold = ticketTiers.reduce((sum, tier) => sum + tier.sold, 0);
  const totalCapacity = ticketTiers.reduce((sum, tier) => sum + tier.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">AI Ticketing Setup</h1>
          </div>
          <p className="text-muted-foreground">Optimize your pricing strategy with AI recommendations</p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-[60%_40%] gap-6">
          {/* LEFT - Chat & Ticket Builder */}
          <div className="space-y-6">
            {/* AI Assistant Card */}
            <Card className="p-6 border-primary/20 bg-primary/5">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">AI Pricing Strategy</span>
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    I recommend a 3-tier pricing strategy generating <strong>${totalRevenue.toLocaleString()}</strong> current revenue with potential of <strong>${potentialRevenue.toLocaleString()}</strong>.
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
                  placeholder="Ask me about pricing strategies, early bird discounts, or revenue optimization..."
                  className="resize-none"
                  rows={3}
                />
                <Button size="icon" className="h-auto">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button variant="outline" size="sm" onClick={() => setMessage("Add early bird 20% discount")}>
                  Early bird pricing
                </Button>
                <Button variant="outline" size="sm" onClick={() => setMessage("Create VIP package")}>
                  VIP package
                </Button>
                <Button variant="outline" size="sm" onClick={() => setMessage("Group discounts")}>
                  Group discounts
                </Button>
              </div>
            </Card>

            {/* Ticket Tiers */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Ticket Tiers</h3>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Tier
                </Button>
              </div>

              <div className="space-y-4">
                {ticketTiers.map((tier) => (
                  <Card key={tier.id} className="p-4 bg-muted/30">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Input
                            value={tier.name}
                            className="font-semibold h-8 max-w-[200px]"
                            readOnly
                          />
                          {tier.sold >= tier.quantity * 0.8 && (
                            <Badge variant="destructive" className="text-xs">
                              Almost Sold Out
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{tier.description}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Price</label>
                        <Input
                          value={`$${tier.price}`}
                          className="h-8"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Quantity</label>
                        <Input
                          value={tier.quantity}
                          type="number"
                          className="h-8"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Sold</label>
                        <Input
                          value={tier.sold}
                          type="number"
                          className="h-8"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Revenue</label>
                        <Input
                          value={`$${(tier.price * tier.sold).toLocaleString()}`}
                          className="h-8 font-semibold"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Sales Progress</span>
                        <span className="font-medium">{Math.round((tier.sold / tier.quantity) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${(tier.sold / tier.quantity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* RIGHT - Revenue Calculator & Insights */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue Projection</h3>
              
              <div className="p-4 rounded-lg bg-primary/10 mb-4">
                <div className="text-3xl font-bold text-primary mb-1">
                  ${totalRevenue.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Current revenue</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tickets Sold</span>
                  <span className="font-semibold">{totalSold} / {totalCapacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Potential Revenue</span>
                  <span className="font-semibold text-primary">${potentialRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Average Ticket Price</span>
                  <span className="font-semibold">${Math.round(totalRevenue / totalSold)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sell-through Rate</span>
                  <span className="font-semibold">{Math.round((totalSold / totalCapacity) * 100)}%</span>
                </div>
              </div>

              <Button className="w-full mt-4">Apply AI Recommendations</Button>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Insights
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm">
                    <strong>Pricing Optimization:</strong> Consider adding a $199 mid-tier ticket between General and VIP for maximum revenue.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm">
                    <strong>Early Bird Success:</strong> Your early bird tier is selling well. Consider extending the deadline.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm">
                    <strong>VIP Upsell:</strong> 15% of buyers view VIP but don't convert. Add payment plans to increase sales.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <Ticket className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <div className="text-xl font-bold">{ticketTiers.length}</div>
                  <div className="text-xs text-muted-foreground">Ticket Types</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <DollarSign className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <div className="text-xl font-bold">${Math.round(totalRevenue / totalSold)}</div>
                  <div className="text-xs text-muted-foreground">Avg Price</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <Users className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <div className="text-xl font-bold">{totalSold}</div>
                  <div className="text-xs text-muted-foreground">Sold</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <div className="text-xl font-bold">{Math.round((totalSold / totalCapacity) * 100)}%</div>
                  <div className="text-xs text-muted-foreground">Sell Rate</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
