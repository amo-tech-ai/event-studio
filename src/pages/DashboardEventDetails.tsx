import { ArrowLeft, Calendar, MapPin, Bookmark, Share2, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const DashboardEventDetails = () => {
  const seatPlan = [
    { name: "Diamond", price: 120, status: "Seating", color: "bg-pink-200" },
    { name: "Platinum", price: 100, status: "Seating", color: "bg-purple-200" },
    { name: "Gold", price: 85, status: "Seating", color: "bg-yellow-200" },
    { name: "Silver", price: 70, status: "Seating", color: "bg-gray-300" },
    { name: "Bronze", price: 60, status: "Seating", color: "bg-orange-200" },
    { name: "General Admission", price: 50, status: "Standing", color: "bg-blue-200" },
    { name: "Backstage Access", price: 200, status: "-", color: "bg-yellow-300" },
    { name: "VIP Lounge", price: 150, status: "Seating", color: "bg-pink-400" }
  ];

  const packages = [
    { name: "General Admission Package", price: 50, features: ["Standing", "Access to Festival Grounds"] },
    { name: "Silver Package", price: 70, features: ["Seating", "Mid-tier View"] },
    { name: "Gold Package", price: 85, features: ["Seating", "Prime View"] },
    { name: "Platinum Package", price: 100, features: ["Seating", "Near Stage"] },
    { name: "Diamond Package", price: 120, features: ["Seating", "Front-Row View"] },
    { name: "VIP Lounge Package", price: 150, features: ["Seating", "Exclusive Lounge"] },
    { name: "Artist Meet-and-Greet Package", price: 180, features: ["Standing", "Backstage Access"] },
    { name: "Ultimate Access Package", price: 200, features: ["Standing", "All-Inclusive Benefits"] }
  ];

  const merchandise = [
    { name: "Echo Beats Cap", price: 20, image: "bg-gradient-to-br from-pink-300 to-pink-400" },
    { name: "Festival T-Shirt", price: 25, image: "bg-gradient-to-br from-purple-200 to-purple-300" },
    { name: "Light-Up Wristband", price: 15, image: "bg-gradient-to-br from-pink-400 to-pink-500" }
  ];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <Link to="/dashboard/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>

            {/* Event Header */}
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <div className="relative h-80 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-pink-500">Music</Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary">Active</Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/30"></div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h1 className="text-3xl font-bold mb-4">Echo Beats Festival</h1>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>May 20, 2029 - 6:00 PM</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>Sunset Park, Los Angeles, CA</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <p className="text-sm text-muted-foreground">Tickets Sold</p>
                            <p className="text-2xl font-bold">21,000<span className="text-sm text-muted-foreground">/30,000</span></p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Starts from</p>
                            <p className="text-2xl font-bold text-primary">$60</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="font-bold text-lg mb-3">About Event</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        The Echo Beats Festival brings together a stellar lineup of artists across EDM, pop, and hip-hop genres. 
                        Prepare to experience a night of electrifying music, vibrant light shows, and unforgettable performances 
                        under the stars. Explore food trucks, art installations, and VIP lounges for an elevated experience.
                      </p>
                    </div>

                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Terms & Conditions</h3>
                        <Button variant="ghost" size="sm">Expand</Button>
                      </div>
                      <div className="space-y-4 text-sm text-muted-foreground">
                        <div>
                          <p className="font-medium text-foreground mb-2">1. Ticket Purchase and Entry</p>
                          <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>All attendees must possess a valid ticket for entry.</li>
                            <li>Tickets are non-refundable and non-transferable unless specified by the event organizer.</li>
                            <li>Attendees must present a valid government-issued ID along with their ticket at the gate.</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-foreground mb-2">2. Security and Safety</p>
                          <ul className="list-disc list-inside space-y-1 pl-4">
                            <li>Attendees are subject to security checks, including bag inspections, upon entry.</li>
                            <li>Prohibited items include weapons, drugs, alcohol, fireworks, and other hazardous materials.</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Official Merchandise</h3>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {merchandise.map((item, i) => (
                          <Card key={i} className="p-4 text-center hover-lift transition-all cursor-pointer">
                            <div className={`h-32 rounded-lg mb-3 ${item.image}`}></div>
                            <p className="font-medium text-sm mb-1">{item.name}</p>
                            <p className="text-primary font-bold">USD ${item.price}</p>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">Our Partners</h3>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                          <div key={i} className="h-16 rounded-lg border flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">Logo {i}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Seat Plan */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Seat Plan</h3>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="mb-6 p-4 bg-muted rounded-lg">
                    <div className="text-center text-xs text-muted-foreground mb-2">STAGE</div>
                    <div className="grid grid-cols-3 gap-2">
                      {seatPlan.slice(0, 8).map((seat, i) => (
                        <div key={i} className={`h-8 rounded ${seat.color} flex items-center justify-center text-xs font-medium`}>
                          {seat.name.split(' ')[0]}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {seatPlan.map((seat, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded ${seat.color}`}></div>
                          <span>{seat.name}</span>
                        </div>
                        <span className="font-medium">${seat.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-bold mb-3">Notes</h4>
                    <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                      <li>Seating categories include reserved seating with an unobstructed stage view.</li>
                      <li>Standing categories include access to open floor areas near the stage.</li>
                    </ul>
                  </div>
                </Card>

                {/* Packages */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Packages</h3>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {packages.map((pkg, i) => (
                      <div key={i} className="flex items-start justify-between py-3 border-b last:border-0">
                        <div className="flex-1">
                          <p className="font-medium text-sm mb-1">{pkg.name}</p>
                          <div className="flex gap-2">
                            {pkg.features.map((feature, j) => (
                              <div key={j} className="flex items-center gap-1">
                                <Checkbox id={`pkg-${i}-${j}`} className="w-3 h-3" />
                                <label htmlFor={`pkg-${i}-${j}`} className="text-xs text-muted-foreground">
                                  {feature}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="text-primary font-bold">${pkg.price}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardEventDetails;
