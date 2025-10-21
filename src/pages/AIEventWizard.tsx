import { useState, useRef, useEffect } from "react";
import { Send, Calendar, MapPin, Users, CheckCircle2, Clock, Edit3, Share2, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  status: "draft" | "published" | "live";
  completedFields: string[];
  missingFields: string[];
  progress: number;
}

const AIEventWizard = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "👋 Hi! I'm your AI Event Wizard. I'll help you create an amazing event from start to finish. What type of event would you like to create?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEventSummary, setShowEventSummary] = useState(false);
  const [agentStatus, setAgentStatus] = useState<"idle" | "active" | "processing">("idle");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [eventData, setEventData] = useState<EventData>({
    name: "Tech Innovation Summit 2025",
    date: "July 15, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "San Francisco Convention Center",
    capacity: 500,
    status: "draft",
    completedFields: ["name", "date", "time", "location"],
    missingFields: ["ticketing", "agenda", "marketing"],
    progress: 45
  });

  const quickSuggestions = [
    "Plan a tech conference",
    "Create a networking event",
    "Organize a workshop",
    "Set up a product launch"
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
    setAgentStatus("active");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      setAgentStatus("idle");
      updateEventProgress();
    }, 2000);
  };

  const generateAIResponse = (input: string): string => {
    const responses = [
      "Great choice! Let me help you with that. What's the name of your event?",
      "Perfect! I've updated your event details. Would you like to set up ticketing next?",
      "Excellent! I'm generating venue recommendations based on your requirements...",
      "I've created an agenda draft for you. Would you like to review and customize it?",
      "Your event is taking shape! Let's work on the marketing materials next."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const updateEventProgress = () => {
    const newProgress = Math.min(eventData.progress + 10, 90);
    setEventData(prev => ({ ...prev, progress: newProgress }));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const getAgentStatusText = () => {
    switch (agentStatus) {
      case "active":
        return "AI is thinking...";
      case "processing":
        return "Processing your request...";
      default:
        return "AI is ready";
    }
  };

  const getAgentStatusColor = () => {
    switch (agentStatus) {
      case "active":
        return "bg-primary";
      case "processing":
        return "bg-warning";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 h-full">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-heading font-bold text-foreground">AI Event Wizard</h1>
            </div>
            <p className="text-muted-foreground">Create your perfect event through conversation with AI</p>
          </div>

          {/* Desktop: Two panels side-by-side */}
          <div className="grid lg:grid-cols-[60%_40%] gap-6 h-[calc(100vh-16rem)]">
            {/* LEFT PANEL - Chat Interface */}
            <Card className="flex flex-col p-6 bg-card border-border">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-heading font-bold text-foreground">Chat with AI</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${getAgentStatusColor()} ${agentStatus === "active" ? "animate-pulse" : ""}`} />
                    <p className="text-sm text-muted-foreground">{getAgentStatusText()}</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12">
                      <Sparkles className="w-16 h-16 text-primary/50" />
                      <div>
                        <h2 className="text-xl font-heading font-semibold mb-2">Start Your Event Journey</h2>
                        <p className="text-muted-foreground text-sm">Choose a prompt below or type your own</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                        {quickSuggestions.map((suggestion, idx) => (
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
                                : "bg-accent/50 border border-border"
                            }`}
                          >
                            {message.role === "assistant" && (
                              <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-xs font-medium text-primary">AI Assistant</span>
                              </div>
                            )}
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start animate-fade-in">
                          <div className="bg-accent/50 border border-border rounded-lg px-4 py-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Sparkles className="w-4 h-4 text-primary" />
                              <span className="text-xs font-medium text-primary">AI Assistant</span>
                            </div>
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
              </ScrollArea>

              {/* Quick Suggestions */}
              {messages.length > 0 && (
                <div className="mt-4 mb-3">
                  <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickSuggestions.slice(0, 3).map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1 text-xs rounded-full border border-border bg-background hover:bg-accent transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="flex gap-2 mt-4">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message or use a quick action..."
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
                <h2 className="text-2xl font-heading font-bold text-foreground mb-1">Event Summary</h2>
                <p className="text-sm text-muted-foreground">Live preview of your event</p>
              </div>

              <ScrollArea className="flex-1">
                <div className="space-y-6">
                  {/* Event Name & Status */}
                  <div className="animate-fade-in">
                    <h3 className="text-2xl font-heading font-bold text-foreground mb-2">{eventData.name}</h3>
                    <Badge variant={eventData.status === "live" ? "default" : "secondary"}>
                      {eventData.status.charAt(0).toUpperCase() + eventData.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-foreground">Event Completion</p>
                      <p className="text-sm font-semibold text-primary">{eventData.progress}%</p>
                    </div>
                    <Progress value={eventData.progress} className="h-2" />
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-start gap-3 animate-fade-in">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{eventData.date}</p>
                      <p className="text-sm text-muted-foreground">{eventData.time}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3 animate-fade-in">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <p className="font-medium text-foreground">{eventData.location}</p>
                  </div>

                  {/* Capacity */}
                  <div className="flex items-start gap-3 animate-fade-in">
                    <Users className="w-5 h-5 text-primary mt-0.5" />
                    <p className="font-medium text-foreground">{eventData.capacity} attendees capacity</p>
                  </div>

                  {/* Completed Fields */}
                  <div className="animate-fade-in">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Completed
                    </h4>
                    <div className="space-y-2">
                      {eventData.completedFields.map((field, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                          <span className="text-foreground capitalize">{field}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Missing Fields */}
                  {eventData.missingFields.length > 0 && (
                    <div className="animate-fade-in">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-warning" />
                        Next Steps
                      </h4>
                      <div className="space-y-2">
                        {eventData.missingFields.map((field, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-muted-foreground" />
                            <span className="text-muted-foreground capitalize">{field}</span>
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
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Landing Page
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Event
                    </Button>
                  </div>

                  {/* Auto-save Indicator */}
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Auto-saved 2 minutes ago</p>
                  </div>
                </div>
              </ScrollArea>
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

export default AIEventWizard;
