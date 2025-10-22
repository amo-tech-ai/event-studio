import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, Target } from "lucide-react";

export default function AIMarketingDashboard() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Marketing Assistant</h1>
        </div>
        <p className="text-muted-foreground">AI-powered marketing strategies</p>
      </div>

      <Card className="p-6 mb-8 border-primary/20 bg-primary/5">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">AI Marketing Strategy</span>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <p className="text-muted-foreground">
              Multi-channel approach with <strong>250% ROI</strong> reaching <strong>30,000+</strong> potential attendees.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6">
        {["LinkedIn Campaign", "Email Sequence", "Twitter Thread"].map((strategy, i) => (
          <Card key={i} className="p-6">
            <h3 className="font-semibold text-lg mb-2">{strategy}</h3>
            <p className="text-muted-foreground mb-4">Reach 15,000+ with high engagement</p>
            <Button className="w-full">
              <Target className="h-4 w-4 mr-2" />
              Launch Campaign
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
