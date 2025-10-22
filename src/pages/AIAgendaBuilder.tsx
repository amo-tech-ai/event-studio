import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Sparkles, Clock, Users, MapPin, Send, Plus, Mic, Coffee, Video } from "lucide-react";

interface Session {
  id: number;
  time: string;
  title: string;
  type: "keynote" | "workshop" | "panel" | "break" | "networking";
  duration: number;
  room: string;
  speaker?: string;
  capacity?: number;
}

export default function AIAgendaBuilder() {
  const [message, setMessage] = useState("");
  const [sessions] = useState<Session[]>([
    {
      id: 1,
      time: "9:00 AM",
      title: "Welcome & Opening Keynote",
      type: "keynote",
      duration: 60,
      room: "Main Hall",
      speaker: "Sarah Johnson, CEO",
      capacity: 500,
    },
    {
      id: 2,
      time: "10:00 AM",
      title: "Coffee Break & Networking",
      type: "break",
      duration: 30,
      room: "Lobby Area",
    },
    {
      id: 3,
      time: "10:30 AM",
      title: "AI Innovation Workshop",
      type: "workshop",
      duration: 90,
      room: "Room A",
      speaker: "Dr. Michael Chen",
      capacity: 50,
    },
    {
      id: 4,
      time: "10:30 AM",
      title: "Product Development Panel",
      type: "panel",
      duration: 90,
      room: "Room B",
      speaker: "Panel of 4 Experts",
      capacity: 75,
    },
    {
      id: 5,
      time: "12:00 PM",
      title: "Lunch Break",
      type: "break",
      duration: 60,
      room: "Dining Hall",
    },
    {
      id: 6,
      time: "1:00 PM",
      title: "Interactive Roundtables",
      type: "networking",
      duration: 60,
      room: "Multiple Rooms",
      capacity: 200,
    },
    {
      id: 7,
      time: "2:00 PM",
      title: "Technology Trends Workshop",
      type: "workshop",
      duration: 90,
      room: "Room C",
      speaker: "Lisa Anderson",
      capacity: 60,
    },
    {
      id: 8,
      time: "3:30 PM",
      title: "Closing Keynote",
      type: "keynote",
      duration: 45,
      room: "Main Hall",
      speaker: "David Park, CTO",
      capacity: 500,
    },
  ]);

  const typeColors = {
    keynote: "bg-purple-500",
    workshop: "bg-blue-500",
    panel: "bg-green-500",
    break: "bg-gray-400",
    networking: "bg-orange-500",
  };

  const typeIcons = {
    keynote: <Mic className="h-4 w-4" />,
    workshop: <Users className="h-4 w-4" />,
    panel: <Video className="h-4 w-4" />,
    break: <Coffee className="h-4 w-4" />,
    networking: <Users className="h-4 w-4" />,
  };

  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">AI Agenda Builder</h1>
          </div>
          <p className="text-muted-foreground">Create optimized event schedules with AI assistance</p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-[60%_40%] gap-6">
          {/* LEFT - Chat & Timeline */}
          <div className="space-y-6">
            {/* AI Assistant Card */}
            <Card className="p-6 border-primary/20 bg-primary/5">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">AI Schedule Optimizer</span>
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Created an optimal {Math.round(totalDuration / 60)}-hour agenda based on 500+ similar events with <strong>92%</strong> expected satisfaction.
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
                  placeholder="Ask me to add sessions, adjust timing, or suggest speakers..."
                  className="resize-none"
                  rows={3}
                />
                <Button size="icon" className="h-auto">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button variant="outline" size="sm" onClick={() => setMessage("Add keynote speaker")}>
                  Add keynote
                </Button>
                <Button variant="outline" size="sm" onClick={() => setMessage("Schedule networking break")}>
                  Networking time
                </Button>
                <Button variant="outline" size="sm" onClick={() => setMessage("Create workshop sessions")}>
                  Add workshops
                </Button>
              </div>
            </Card>

            {/* Event Timeline */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Event Timeline</h2>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Session
                </Button>
              </div>

              <div className="space-y-4">
                {sessions.map((session, index) => (
                  <div key={session.id} className="relative">
                    {/* Timeline line */}
                    {index < sessions.length - 1 && (
                      <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-border" />
                    )}
                    
                    <Card className="p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full ${typeColors[session.type]} flex items-center justify-center text-white`}>
                            {typeIcons[session.type]}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold text-sm">{session.time}</span>
                                <Badge variant="outline" className="text-xs">
                                  {session.duration} min
                                </Badge>
                              </div>
                              <h3 className="font-semibold">{session.title}</h3>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{session.room}</span>
                            </div>
                            {session.speaker && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{session.speaker}</span>
                              </div>
                            )}
                            {session.capacity && (
                              <Badge variant="secondary" className="text-xs">
                                Capacity: {session.capacity}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-6" size="lg">
                Apply This Agenda
              </Button>
            </Card>
          </div>

          {/* RIGHT - Summary & Insights */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Schedule Overview</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Sessions</span>
                  <span className="font-semibold">{sessions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Event Duration</span>
                  <span className="font-semibold">{Math.round(totalDuration / 60)}h {totalDuration % 60}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Keynote Speakers</span>
                  <span className="font-semibold">
                    {sessions.filter(s => s.type === "keynote").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Workshops</span>
                  <span className="font-semibold">
                    {sessions.filter(s => s.type === "workshop").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Break Time</span>
                  <span className="font-semibold">
                    {sessions.filter(s => s.type === "break").reduce((sum, s) => sum + s.duration, 0)} min
                  </span>
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
                    <strong>Timing:</strong> Your keynote at 9 AM is optimal for maximum attendance.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm">
                    <strong>Break Balance:</strong> Consider adding a 15-min afternoon break between sessions.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm">
                    <strong>Networking:</strong> Your networking time is well-placed after lunch for best engagement.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Session Types</h3>
              <div className="space-y-2">
                {Object.entries(typeColors).map(([type, color]) => {
                  const count = sessions.filter(s => s.type === type).length;
                  if (count === 0) return null;
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        <span className="text-sm capitalize">{type}</span>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Speaker Roster</h3>
              <div className="space-y-3">
                {sessions.filter(s => s.speaker).map((session) => (
                  <div key={session.id} className="flex items-start gap-3 p-2 rounded-lg bg-muted/30">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{session.speaker}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
