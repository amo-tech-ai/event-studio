import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, DollarSign, CheckCircle, Bot, Sparkles } from "lucide-react";

export default function AIVenueSelection() {
  const venues = [
    {
      id: 1,
      name: "Convention Center Downtown",
      location: "123 Main St, San Francisco",
      capacity: 500,
      price: "$2,500/day",
      aiMatch: 95,
      availability: "Available",
      aiReason: "Perfect capacity match for your 200-person tech conference. Central location with excellent public transport access.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Tech Hub Space",
      location: "456 Innovation Ave, San Francisco",
      capacity: 200,
      price: "$1,500/day",
      aiMatch: 88,
      availability: "Available",
      aiReason: "Ideal for tech events with built-in AV equipment. More budget-friendly option with modern amenities.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">AI Venue Assistant</h1>
        </div>
        <p className="text-muted-foreground">Let AI help you find the perfect venue</p>
      </div>

      <Card className="p-6 mb-8 border-primary/20 bg-primary/5">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">AI Assistant</span>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <p className="text-muted-foreground">
              I found <strong>3 venues</strong> that perfectly match your criteria. The Convention Center Downtown is your best match!
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        {venues.map((venue, index) => (
          <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-80 h-48 bg-muted flex-shrink-0">
                <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
                <Badge className="absolute top-4 right-4 bg-primary/90">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {venue.aiMatch}% Match
                </Badge>
                {index === 0 && (
                  <Badge className="absolute top-4 left-4 bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Best Match
                  </Badge>
                )}
              </div>

              <div className="flex-1 p-6">
                <h3 className="text-xl font-semibold mb-2">{venue.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{venue.location}</span>
                </div>

                <div className="mb-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex items-start gap-2">
                    <Bot className="h-4 w-4 text-primary mt-0.5" />
                    <p className="text-sm text-muted-foreground">{venue.aiReason}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Capacity: {venue.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">{venue.price}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button>Select This Venue</Button>
                  <Button variant="outline">View Details</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
