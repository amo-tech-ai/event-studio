import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, TrendingUp } from "lucide-react";

export default function AITicketingSetup() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Ticketing Assistant</h1>
        </div>
        <p className="text-muted-foreground">Optimize your pricing with AI recommendations</p>
      </div>

      <Card className="p-6 mb-8 border-primary/20 bg-primary/5">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">AI Pricing Strategy</span>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <p className="text-muted-foreground">
              I recommend a 3-tier pricing strategy generating <strong>$35,000-45,000</strong> in revenue.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Projection</h3>
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="text-3xl font-bold">$34,800</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
            <TrendingUp className="h-3 w-3" />
            <span>Within optimal range</span>
          </div>
        </div>
        <Button className="w-full mt-4" size="lg">Apply AI Recommendations</Button>
      </Card>
    </div>
  );
}
