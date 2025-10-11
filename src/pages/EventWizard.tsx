import { useState, useRef, useEffect } from "react";
import { Send, Calendar, MapPin, Users, CheckCircle2, Clock, ExternalLink, Edit3, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface EventData {
  name: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  currentAttendees: number;
  status: "draft" | "published" | "live";
  ticketTiers: Array<{ name: string; price: number }>;
  tasks: Array<{ label: string; completed: boolean }>;
}

const EventWizard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEventSummary, setShowEventSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [eventData, setEventData] = useState<EventData>({
    name: "",
    date: "",
    time: "",
    location: "",
    capacity: 0,
    currentAttendees: 0,
    status: "draft",
    ticketTiers: [],
    tasks: []
  });

  const promptSuggestions = [
    "Create a corporate conference",
    "Plan a product launch",
    "Set up a networking mixer",
    "Organize a team retreat"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response and event data updates
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      updateEventData(inputValue);
    }, 1500);
  };

  const generateAIResponse = (input: string): string => {
    const lower = input.toLowerCase();
    
    if (lower.includes("conference") || lower.includes("create")) {
      return "Great! I'll help you create a conference. What would you like to name this event?";
    } else if (lower.includes("toronto") || lower.includes("200")) {
      return "Perfect! I've set the location to Toronto with a capacity of 200 attendees. What date would you like to schedule this for?";
    } else if (lower.includes("tech connect") || eventData.name === "") {
      return "Excellent name! When would you like to hold Tech Connect 2025? Please provide a date.";
    } else if (lower.includes("ticket") || lower.includes("vip")) {
      return "I'll add ticket tiers. What pricing would you like for VIP and General Admission tickets?";
    } else {
      return "I understand. What else would you like to add or modify for this event?";
    }
  };

  const updateEventData = (input: string) => {
    const lower = input.toLowerCase();
    
    setEventData(prev => {
      const updated = { ...prev };
      
      if (lower.includes("toronto")) {
        updated.location = "Toronto, Canada";
      }
      if (lower.includes("200")) {
        updated.capacity = 200;
      }
      if (lower.includes("tech connect")) {
        updated.name = "Tech Connect 2025";
        updated.tasks = [
          { label: "Create landing page", completed: true },
          { label: "Add ticket tiers", completed: false },
          { label: "Send invitations", completed: false }
        ];
      }
      if (lower.includes("march") || lower.includes("15")) {
        updated.date = "March 15, 2025";
        updated.time = "9:00 AM";
      }
      if (lower.includes("vip") || lower.includes("ticket")) {
        updated.ticketTiers = [
          { name: "General Admission", price: 99 },
          { name: "VIP", price: 299 }
        ];
      }
      
      return updated;
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const hasEventData = eventData.name || eventData.location || eventData.capacity > 0;
  const attendancePercentage = eventData.capacity > 0 
    ? (eventData.currentAttendees / eventData.capacity) * 100 
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 h-full">
          {/* Desktop: Two panels side-by-side */}
          <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
            {/* LEFT PANEL - Chat Interface */}
            <Card className="flex flex-col p-6 bg-card border-border">
              <div className="mb-4">
                <h1 className="text-2xl font-heading font-bold text-foreground">EventOS Chat Wizard</h1>
                <p className="text-sm text-muted-foreground">Plan your event through conversation</p>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                    <div>
                      <h2 className="text-xl font-heading font-semibold mb-2">Plan your event through conversation.</h2>
                      <p className="text-muted-foreground text-sm">Start by choosing a prompt or typing your own</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                      {promptSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="p-4 rounded-lg border border-border bg-background hover:bg-accent transition-colors text-sm text-left"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-3 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-card border border-border shadow-sm"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start animate-fade-in">
                        <div className="bg-card border border-border rounded-lg px-4 py-3 shadow-sm">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message…"
                  className="resize-none"
                  rows={3}
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="h-auto px-4"
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* RIGHT PANEL - Event Summary */}
            <Card className={`lg:flex flex-col p-6 bg-card border-border ${showEventSummary ? 'flex' : 'hidden'}`}>
              <div className="mb-6">
                <h2 className="text-2xl font-heading font-bold text-foreground">Event Summary</h2>
              </div>

              {!hasEventData ? (
                <div className="flex-1 flex items-center justify-center text-center">
                  <div className="text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Start chatting to create your event</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 overflow-y-auto flex-1">
                  {/* Event Name */}
                  {eventData.name && (
                    <div className="animate-fade-in">
                      <h3 className="text-2xl font-heading font-bold text-foreground mb-2">{eventData.name}</h3>
                      <Badge variant={eventData.status === "live" ? "default" : "secondary"}>
                        {eventData.status.charAt(0).toUpperCase() + eventData.status.slice(1)}
                      </Badge>
                    </div>
                  )}

                  {/* Date & Time */}
                  {eventData.date && (
                    <div className="flex items-start gap-3 animate-fade-in">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">{eventData.date}</p>
                        {eventData.time && <p className="text-sm text-muted-foreground">{eventData.time}</p>}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {eventData.location && (
                    <div className="flex items-start gap-3 animate-fade-in">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <p className="font-medium text-foreground">{eventData.location}</p>
                    </div>
                  )}

                  {/* Capacity */}
                  {eventData.capacity > 0 && (
                    <div className="animate-fade-in">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {eventData.currentAttendees} / {eventData.capacity} attendees
                          </p>
                        </div>
                      </div>
                      <Progress value={attendancePercentage} className="h-2" />
                    </div>
                  )}

                  {/* Ticket Tiers */}
                  {eventData.ticketTiers.length > 0 && (
                    <div className="animate-fade-in">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Ticket Tiers
                      </h4>
                      <div className="space-y-2">
                        {eventData.ticketTiers.map((tier, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-accent rounded-lg">
                            <span className="font-medium text-foreground">{tier.name}</span>
                            <span className="text-primary font-semibold">${tier.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tasks */}
                  {eventData.tasks.length > 0 && (
                    <div className="animate-fade-in">
                      <h4 className="font-semibold text-foreground mb-3">Tasks</h4>
                      <div className="space-y-2">
                        {eventData.tasks.map((task, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <CheckCircle2
                              className={`w-5 h-5 ${
                                task.completed ? "text-primary" : "text-muted-foreground"
                              }`}
                            />
                            <span className={task.completed ? "line-through text-muted-foreground" : "text-foreground"}>
                              {task.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-border space-y-2">
                    <Button className="w-full" variant="default">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Event
                    </Button>
                    <Button className="w-full" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Landing Page
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Event
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Mobile FAB for Event Summary */}
          <Button
            className="lg:hidden fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg z-50"
            size="icon"
            onClick={() => setShowEventSummary(!showEventSummary)}
          >
            <Calendar className="w-6 h-6" />
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventWizard;
