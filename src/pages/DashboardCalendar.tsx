import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, Edit, Eye, Copy } from "lucide-react";

export default function DashboardCalendar() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const events = [
    { id: 1, title: "Tech Conference 2024", date: 15, status: "confirmed", time: "9:00 AM - 6:00 PM" },
    { id: 2, title: "Startup Pitch Night", date: 20, status: "tentative", time: "6:30 PM - 9:00 PM" },
    { id: 3, title: "Design Workshop", date: 25, status: "confirmed", time: "10:00 AM - 4:00 PM" },
  ];

  const getDaysInMonth = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      const event = events.find(e => e.date === i);
      days.push({ day: i, event });
    }
    return days;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500";
      case "tentative": return "bg-yellow-500";
      case "blocked": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Event Calendar</h1>
          <p className="text-muted-foreground">Manage your event schedule</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Week</Button>
          <Button size="sm">Month</Button>
        </div>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-semibold">March 2024</h2>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {getDaysInMonth().map((day, i) => (
            <button
              key={i}
              onClick={() => day.event && setSelectedEvent(day.event)}
              className={`aspect-square rounded-lg p-2 text-sm hover:bg-muted transition-colors relative ${
                day.event ? 'bg-primary/10' : ''
              }`}
            >
              <span className="absolute top-1 left-1/2 -translate-x-1/2">{day.day}</span>
              {day.event && (
                <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${getStatusColor(day.event.status)}`} />
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm text-muted-foreground">Tentative</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-muted-foreground">Blocked</span>
          </div>
        </div>
      </Card>

      {selectedEvent && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Event Details</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">{selectedEvent.title}</h3>
              <Badge className={getStatusColor(selectedEvent.status)}>
                {selectedEvent.status}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>March {selectedEvent.date}, 2024</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{selectedEvent.time}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>San Francisco Convention Center</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
              <Button className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Event
              </Button>
              <Button variant="outline" className="gap-2">
                <Eye className="h-4 w-4" />
                View Details
              </Button>
              <Button variant="outline" className="gap-2">
                <Copy className="h-4 w-4" />
                Duplicate
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
