import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users, DollarSign, Wifi, Utensils, Car, Monitor, Plus, Map } from "lucide-react";

export default function DashboardVenues() {
  const venues = [
    {
      id: 1,
      name: "Convention Center Downtown",
      location: "123 Main St, San Francisco",
      capacity: 500,
      price: "$2,500/day",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      amenities: ["Wifi", "Catering", "Parking", "AV"],
      availability: "Available",
    },
    {
      id: 2,
      name: "Tech Hub Space",
      location: "456 Innovation Ave, San Francisco",
      capacity: 200,
      price: "$1,500/day",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
      amenities: ["Wifi", "AV", "Parking"],
      availability: "Available",
    },
    {
      id: 3,
      name: "Grand Ballroom",
      location: "789 Luxury Blvd, San Francisco",
      capacity: 800,
      price: "$4,000/day",
      image: "https://images.unsplash.com/photo-1519167758481-83f29da8c9ad?w=400&h=300&fit=crop",
      amenities: ["Wifi", "Catering", "Parking", "AV"],
      availability: "Limited",
    },
    {
      id: 4,
      name: "Creative Workshop Studio",
      location: "321 Design St, San Francisco",
      capacity: 50,
      price: "$800/day",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop",
      amenities: ["Wifi", "AV"],
      availability: "Available",
    },
  ];

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi": return <Wifi className="h-4 w-4" />;
      case "catering": return <Utensils className="h-4 w-4" />;
      case "parking": return <Car className="h-4 w-4" />;
      case "av": return <Monitor className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Event Venues</h1>
          <p className="text-muted-foreground">Browse and manage venue partnerships</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Map className="h-4 w-4" />
            Map View
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Venue
          </Button>
        </div>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search venues by name or location..." className="pl-10" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">Capacity</Button>
            <Button variant="outline" size="sm">Price Range</Button>
            <Button variant="outline" size="sm">Amenities</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-muted">
              <img 
                src={venue.image} 
                alt={venue.name}
                className="w-full h-full object-cover"
              />
              <Badge 
                className="absolute top-4 right-4"
                variant={venue.availability === "Available" ? "secondary" : "default"}
              >
                {venue.availability}
              </Badge>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{venue.name}</h3>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{venue.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{venue.capacity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>{venue.price}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {venue.amenities.map((amenity, i) => (
                  <Badge key={i} variant="outline" className="gap-1">
                    {getAmenityIcon(amenity)}
                    {amenity}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1">View Details</Button>
                <Button variant="outline" className="flex-1">Contact</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 mt-8">
        <h2 className="text-xl font-semibold mb-6">Venue Network Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">12</div>
            <div className="text-sm text-muted-foreground">Total Venues</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">8</div>
            <div className="text-sm text-muted-foreground">Available Now</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">4,250</div>
            <div className="text-sm text-muted-foreground">Total Capacity</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">$1.8k</div>
            <div className="text-sm text-muted-foreground">Avg Daily Rate</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
