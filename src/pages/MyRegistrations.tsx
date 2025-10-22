import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Calendar,
  Share2,
  X,
  Mail,
  Bell,
  CreditCard,
  Settings,
  MapPin,
  Clock,
} from "lucide-react";

const mockRegistrations = [
  {
    id: 1,
    eventName: "Tech Conference 2024",
    eventDate: "June 15, 2024",
    eventTime: "9:00 AM",
    location: "San Francisco Convention Center",
    status: "confirmed",
    orderNumber: "12345",
    ticketType: "Regular",
    quantity: 2,
    amount: 424,
    imageUrl: "/placeholder.svg",
  },
  {
    id: 2,
    eventName: "Startup Pitch Night",
    eventDate: "July 20, 2024",
    eventTime: "6:30 PM",
    location: "Virtual Event",
    status: "confirmed",
    orderNumber: "12346",
    ticketType: "Early Bird",
    quantity: 1,
    amount: 149,
    imageUrl: "/placeholder.svg",
  },
  {
    id: 3,
    eventName: "Design Workshop",
    eventDate: "August 5, 2024",
    eventTime: "10:00 AM",
    location: "Online Workshop",
    status: "pending",
    orderNumber: "12347",
    ticketType: "VIP",
    quantity: 1,
    amount: 99,
    imageUrl: "/placeholder.svg",
  },
];

const pastRegistrations = [
  {
    id: 4,
    eventName: "Developer Summit 2023",
    eventDate: "December 10, 2023",
    eventTime: "9:00 AM",
    location: "New York City",
    status: "attended",
    orderNumber: "12344",
    ticketType: "Regular",
    quantity: 1,
    amount: 299,
    imageUrl: "/placeholder.svg",
  },
];

export default function MyRegistrations() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: "default",
      pending: "secondary",
      cancelled: "destructive",
      attended: "outline",
    };
    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* User Profile Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              JD
            </div>
            <div>
              <h1 className="text-2xl font-bold">John Doe</h1>
              <p className="text-muted-foreground">
                Member since Jan 2023 • {mockRegistrations.length + pastRegistrations.length}{" "}
                registrations
              </p>
            </div>
          </div>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 md:w-auto md:grid-cols-5">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6 space-y-4">
            {mockRegistrations.map((registration) => (
              <Card key={registration.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="h-48 w-full bg-muted md:h-auto md:w-64">
                    <img
                      src={registration.imageUrl}
                      alt={registration.eventName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-6">
                    <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="mb-2 text-xl font-bold">{registration.eventName}</h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {registration.eventDate} • {registration.eventTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{registration.location}</span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(registration.status)}
                    </div>

                    <div className="mb-4 flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Order: </span>
                        <span className="font-medium">#{registration.orderNumber}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Ticket: </span>
                        <span className="font-medium">
                          {registration.ticketType} x{registration.quantity}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Amount: </span>
                        <span className="font-medium">${registration.amount}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {registration.status === "confirmed" ? (
                        <>
                          <Button size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download Ticket
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="mr-2 h-4 w-4" />
                            Add to Calendar
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="mr-2 h-4 w-4" />
                            Transfer
                          </Button>
                          <Button size="sm" variant="outline">
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" disabled>
                            <Clock className="mr-2 h-4 w-4" />
                            Processing
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="mr-2 h-4 w-4" />
                            Contact Support
                          </Button>
                          <Button size="sm" variant="outline">
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="past" className="mt-6 space-y-4">
            {pastRegistrations.map((registration) => (
              <Card key={registration.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="h-48 w-full bg-muted md:h-auto md:w-64">
                    <img
                      src={registration.imageUrl}
                      alt={registration.eventName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-6">
                    <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="mb-2 text-xl font-bold">{registration.eventName}</h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {registration.eventDate} • {registration.eventTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{registration.location}</span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(registration.status)}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Receipt
                      </Button>
                      <Button size="sm" variant="outline">
                        Leave Review
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="cancelled" className="mt-6">
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No cancelled registrations</p>
            </Card>
          </TabsContent>

          <TabsContent value="waitlist" className="mt-6">
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No waitlisted events</p>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No favorite events saved</p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold">Quick Actions</h3>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="justify-start">
                <Download className="mr-2 h-4 w-4" />
                Download All Tickets
              </Button>
              <Button variant="outline" className="justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Add All to Calendar
              </Button>
              <Button variant="outline" className="justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                View Billing History
              </Button>
              <Button variant="outline" className="justify-start">
                <Bell className="mr-2 h-4 w-4" />
                Notification Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
