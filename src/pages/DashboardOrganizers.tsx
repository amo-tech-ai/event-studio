import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Phone, Calendar, Star, Plus } from "lucide-react";

export default function DashboardOrganizers() {
  return (
    <DashboardLayout>
      <OrganizersContent />
    </DashboardLayout>
  );
}

function OrganizersContent() {
  const organizers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "(555) 123-4567",
      avatar: "SJ",
      events: 12,
      rating: 4.8,
      specialization: ["Tech", "Corporate"],
      status: "Active",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael@example.com",
      phone: "(555) 234-5678",
      avatar: "MC",
      events: 8,
      rating: 4.9,
      specialization: ["Startup", "Networking"],
      status: "Active",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily@example.com",
      phone: "(555) 345-6789",
      avatar: "ER",
      events: 15,
      rating: 4.7,
      specialization: ["Workshop", "Design"],
      status: "Active",
    },
    {
      id: 4,
      name: "David Kim",
      email: "david@example.com",
      phone: "(555) 456-7890",
      avatar: "DK",
      events: 6,
      rating: 4.6,
      specialization: ["Conference", "Tech"],
      status: "Active",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Event Organizers</h1>
          <p className="text-muted-foreground">Manage organizer profiles and performance</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Organizer
        </Button>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search organizers..." className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">All Status</Button>
            <Button variant="outline" size="sm">Specialization</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {organizers.map((organizer) => (
          <Card key={organizer.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-semibold">
                {organizer.avatar}
              </div>
              <Badge variant="secondary">{organizer.status}</Badge>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <h3 className="font-semibold text-lg">{organizer.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{organizer.rating}</span>
                  <span className="mx-1">•</span>
                  <Calendar className="h-3 w-3" />
                  <span>{organizer.events} events</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{organizer.email}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{organizer.phone}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {organizer.specialization.map((spec, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" size="sm" className="flex-1 gap-2">
                <Mail className="h-3 w-3" />
                Contact
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                View Profile
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 mt-8">
        <h2 className="text-xl font-semibold mb-6">Performance Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">41</div>
            <div className="text-sm text-muted-foreground">Total Events</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">4.75</div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">4</div>
            <div className="text-sm text-muted-foreground">Active Organizers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">96%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
