import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, Clock } from "lucide-react";

export default function AIAgendaBuilder() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Agenda Builder</h1>
        </div>
        <p className="text-muted-foreground">AI-generated event schedule optimized for engagement</p>
      </div>

      <Card className="p-6 mb-8 border-primary/20 bg-primary/5">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">AI Schedule Optimizer</span>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <p className="text-muted-foreground">
              Created an optimal 8-hour agenda based on 500+ similar events with <strong>92%</strong> expected satisfaction.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Event Timeline</h2>
        {["9:00 AM - Welcome", "10:00 AM - Keynote", "12:00 PM - Lunch", "2:00 PM - Workshops"].map((session, i) => (
          <div key={i} className="flex gap-4 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="font-medium">{session}</div>
            </div>
          </div>
        ))}
        <Button className="w-full mt-4" size="lg">Apply This Agenda</Button>
      </Card>
    </div>
  );
}
