import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { MapPin, Users, DollarSign, CheckCircle, Bot, Sparkles, Star, Wifi, Car, Utensils, Video, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function AIVenueSelection() {
  const [message, setMessage] = useState("");
  const [priceRange, setPriceRange] = useState([5000]);
  const [capacityRange, setCapacityRange] = useState([200]);

  const venues = [
    {
      id: 1,
      name: "Convention Center Downtown",
      location: "123 Main St, San Francisco",
      capacity: 500,
      price: "$2,500/day",
      priceValue: 2500,
      aiMatch: 95,
      rating: 4.8,
      reviews: 127,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
      amenities: ["WiFi", "Parking", "AV Equipment", "Catering"],
      aiReason: "Perfect capacity match for your 200-person tech conference. Central location with excellent public transport access.",
    },
    {
      id: 2,
      name: "Tech Hub Space",
      location: "456 Innovation Ave, San Francisco",
      capacity: 200,
      price: "$1,500/day",
      priceValue: 1500,
      aiMatch: 88,
      rating: 4.6,
      reviews: 85,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop",
      amenities: ["WiFi", "AV Equipment", "Kitchen"],
      aiReason: "Ideal for tech events with built-in AV equipment. More budget-friendly option with modern amenities.",
    },
    {
      id: 3,
      name: "Waterfront Event Hall",
      location: "789 Harbor Dr, San Francisco",
      capacity: 300,
      price: "$3,200/day",
      priceValue: 3200,
      aiMatch: 82,
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1519167758481-83f29da8c0a1?w=400&h=200&fit=crop",
      amenities: ["WiFi", "Parking", "Outdoor Space", "Catering"],
      aiReason: "Beautiful waterfront views perfect for corporate events. Premium venue with full service.",
    },
  ];

  const amenityIcons = {
    WiFi: <Wifi className="h-4 w-4" />,
    Parking: <Car className="h-4 w-4" />,
    "AV Equipment": <Video className="h-4 w-4" />,
    Catering: <Utensils className="h-4 w-4" />,
  };

  const filteredVenues = venues.filter(
    v => v.priceValue <= priceRange[0] && v.capacity >= capacityRange[0]
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">AI Venue Selection</h1>
          </div>
          <p className="text-muted-foreground">Find the perfect venue with AI-powered recommendations</p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-[60%_40%] gap-6">
          {/* LEFT - Chat & AI Interface */}
          <div className="space-y-6">
            {/* AI Assistant Card */}
            <Card className="p-6 border-primary/20 bg-primary/5">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">AI Venue Assistant</span>
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    I found <strong>{filteredVenues.length} venues</strong> matching your criteria. The Convention Center Downtown is your best match!
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
                  placeholder="Tell me about your event requirements..."
                  className="resize-none"
                  rows={3}
                />
                <Button size="icon" className="h-auto">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button variant="outline" size="sm" onClick={() => setMessage("Need parking for 100 cars")}>
                  Parking needed
                </Button>
                <Button variant="outline" size="sm" onClick={() => setMessage("Budget under $3,000")}>
                  Budget-friendly
                </Button>
                <Button variant="outline" size="sm" onClick={() => setMessage("Downtown location")}>
                  Downtown area
                </Button>
              </div>
            </Card>

            {/* Venue Results */}
            <div className="space-y-4">
              {filteredVenues.map((venue, index) => (
                <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-64 h-48 bg-muted flex-shrink-0">
                      <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
                      <Badge className="absolute top-3 right-3 bg-primary/90">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {venue.aiMatch}% Match
                      </Badge>
                      {index === 0 && (
                        <Badge className="absolute top-3 left-3 bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Best Match
                        </Badge>
                      )}
                    </div>

                    <div className="flex-1 p-4 md:p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg md:text-xl font-semibold">{venue.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{venue.rating}</span>
                          <span className="text-xs text-muted-foreground">({venue.reviews})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{venue.location}</span>
                      </div>

                      <div className="mb-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex items-start gap-2">
                          <Bot className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-xs md:text-sm text-muted-foreground">{venue.aiReason}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 md:gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-sm">Capacity: {venue.capacity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold">{venue.price}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {venue.amenities.map((amenity, i) => (
                          <Badge key={i} variant="secondary" className="gap-1">
                            {amenityIcons[amenity as keyof typeof amenityIcons]}
                            <span className="text-xs">{amenity}</span>
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1 md:flex-none">Select Venue</Button>
                        <Button variant="outline">Details</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* RIGHT - Filters & Summary */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Smart Filters</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Max Budget: ${priceRange[0].toLocaleString()}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={500}
                    max={10000}
                    step={500}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>$500</span>
                    <span>$10,000</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Min Capacity: {capacityRange[0]} people
                  </label>
                  <Slider
                    value={capacityRange}
                    onValueChange={setCapacityRange}
                    min={50}
                    max={1000}
                    step={50}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>50</span>
                    <span>1,000</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Input placeholder="San Francisco" />
                </div>

                <Button variant="outline" className="w-full">Reset Filters</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Search Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Matches Found</span>
                  <span className="font-semibold">{filteredVenues.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">AI Accuracy</span>
                  <span className="font-semibold text-primary">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Top Match Score</span>
                  <span className="font-semibold text-primary">95%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
