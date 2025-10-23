import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  DollarSign,
  Star,
  Wifi,
  Car,
  Coffee,
  Mic2,
  Accessibility,
  Shield,
  Calendar,
  Clock,
  Phone,
  Mail,
  Globe,
  Edit,
  Share2,
  TrendingUp,
  Search,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function VenueDetail() {
  const [activeTab, setActiveTab] = useState("overview");

  const venueImages = [
    "🏢", "🎪", "🏛️", "🎭", "🎨", "🎪", "🏟️", "🎪"
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <Link
          to="/dashboard/venues"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Venues
        </Link>

        {/* Hero Image Gallery */}
        <Card className="overflow-hidden">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 p-4">
            {venueImages.map((emoji, i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center text-4xl hover:scale-105 transition-transform cursor-pointer"
              >
                {emoji}
              </div>
            ))}
          </div>
          <div className="relative h-64 md:h-96 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-8xl mb-4">🏢</div>
              <div className="flex gap-4 justify-center">
                <Button variant="secondary" size="sm">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button variant="secondary" size="sm">
                  Full Gallery
                </Button>
                <Button variant="secondary" size="sm">
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Venue Information Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">Convention Center Downtown</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>123 Main St, San Francisco, CA 94105</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>Capacity: 500</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>$2,500/day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8/5 (127 reviews)</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <MapPin className="w-4 h-4" />
                  Map
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button size="sm" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Book Now
                </Button>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              {[
                { icon: Wifi, label: "WiFi" },
                { icon: Car, label: "Parking" },
                { icon: Mic2, label: "AV Equipment" },
                { icon: Coffee, label: "Catering" },
                { icon: Accessibility, label: "Accessible" },
                { icon: Shield, label: "Security" },
              ].map((amenity, i) => (
                <Badge key={i} variant="secondary" className="gap-2 py-2 px-3">
                  <amenity.icon className="w-4 h-4" />
                  {amenity.label}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Bookings This Month"
            value="12"
            icon={Calendar}
            gradient="from-blue-500 to-blue-600"
            change="+3 from last month"
          />
          <StatCard
            title="Monthly Revenue"
            value="$45,200"
            icon={DollarSign}
            gradient="from-green-500 to-green-600"
            change="+18% from last month"
          />
          <StatCard
            title="Occupancy Rate"
            value="78%"
            icon={TrendingUp}
            gradient="from-purple-500 to-purple-600"
            change="+5% from last month"
          />
          <StatCard
            title="Average Rating"
            value="4.8"
            icon={Star}
            gradient="from-yellow-500 to-yellow-600"
            change="127 reviews"
          />
        </div>

        {/* Tab Navigation */}
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">About This Venue</h3>
                  <p className="text-muted-foreground mb-4">
                    Premium convention center in downtown San Francisco, perfect for conferences,
                    exhibitions, and large corporate events. Modern facilities with state-of-the-art
                    technology and professional event support services.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Operating Hours</p>
                        <p className="text-sm text-muted-foreground">Mon-Sun: 8:00 AM - 10:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">(555) 123-4567</p>
                        <p className="text-sm text-muted-foreground">Available 24/7</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">info@conventioncenter.com</p>
                        <p className="text-sm text-muted-foreground">Response within 2 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">www.conventioncenter.com</p>
                        <p className="text-sm text-muted-foreground">Virtual tours available</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
                  <div className="space-y-3">
                    {[
                      { event: "Tech Conference 2025", date: "Mar 20-22", status: "confirmed", amount: "$7,500" },
                      { event: "Corporate Summit", date: "Apr 5", status: "confirmed", amount: "$2,500" },
                      { event: "Startup Pitch Night", date: "Apr 18", status: "tentative", amount: "$1,800" },
                      { event: "Design Workshop", date: "May 2", status: "confirmed", amount: "$3,200" },
                      { event: "Product Launch", date: "May 15", status: "tentative", amount: "$4,500" },
                    ].map((booking, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="flex-1">
                          <p className="font-medium">{booking.event}</p>
                          <p className="text-sm text-muted-foreground">{booking.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-sm">{booking.amount}</span>
                          <Badge
                            variant={booking.status === "confirmed" ? "default" : "secondary"}
                            className={
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6 mt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search bookings..." className="pl-10" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                  <Button size="sm">New Booking</Button>
                </div>
              </div>

              <Card className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Event</th>
                      <th className="text-left py-3 px-4 font-semibold">Client</th>
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                      <th className="text-right py-3 px-4 font-semibold">Amount</th>
                      <th className="text-right py-3 px-4 font-semibold">Status</th>
                      <th className="text-right py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { event: "Tech Conference 2025", client: "TechCorp Inc.", date: "Mar 20-22, 2025", amount: "$7,500", status: "confirmed" },
                      { event: "Corporate Summit", client: "Global Solutions", date: "Apr 5, 2025", amount: "$2,500", status: "confirmed" },
                      { event: "Startup Pitch Night", client: "Venture Capital", date: "Apr 18, 2025", amount: "$1,800", status: "tentative" },
                      { event: "Design Workshop", client: "Creative Agency", date: "May 2, 2025", amount: "$3,200", status: "confirmed" },
                      { event: "Product Launch", client: "StartupXYZ", date: "May 15, 2025", amount: "$4,500", status: "tentative" },
                    ].map((booking, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{booking.event}</td>
                        <td className="py-3 px-4 text-muted-foreground">{booking.client}</td>
                        <td className="py-3 px-4 text-muted-foreground">{booking.date}</td>
                        <td className="py-3 px-4 text-right font-semibold">{booking.amount}</td>
                        <td className="py-3 px-4 text-right">
                          <Badge
                            className={
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="space-y-6 mt-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Availability Calendar</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium">March 2025</span>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 2;
                    const isBooked = [5, 6, 12, 18, 20, 21, 27].includes(day);
                    const isTentative = [15, 28].includes(day);
                    return (
                      <button
                        key={i}
                        className={`
                          aspect-square rounded-lg flex items-center justify-center text-sm transition-all
                          ${day < 1 || day > 31 ? "text-muted-foreground/30" : "hover:bg-accent"}
                          ${isBooked ? "bg-primary text-primary-foreground font-semibold" : ""}
                          ${isTentative ? "bg-yellow-100 text-yellow-700 font-semibold" : ""}
                          ${day === 14 ? "ring-2 ring-primary ring-offset-2" : ""}
                        `}
                      >
                        {day > 0 && day <= 31 ? day : ""}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-primary" />
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-300" />
                    <span>Tentative</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded border-2 border-primary" />
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-muted" />
                    <span>Available</span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Revenue Trend</h3>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[42, 55, 48, 68, 62, 78].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-lg transition-all hover:opacity-80"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Booking Distribution</h3>
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-48 h-48">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="80" fill="none" stroke="hsl(var(--muted))" strokeWidth="16" />
                        <circle
                          cx="96"
                          cy="96"
                          r="80"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="16"
                          strokeDasharray="502"
                          strokeDashoffset="125"
                        />
                        <circle
                          cx="96"
                          cy="96"
                          r="80"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="16"
                          strokeDasharray="502"
                          strokeDashoffset="377"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold">78%</div>
                          <div className="text-xs text-muted-foreground">Occupancy</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="w-3 h-3 rounded-full bg-primary mx-auto mb-2" />
                      <div className="text-sm font-semibold">65%</div>
                      <div className="text-xs text-muted-foreground">Confirmed</div>
                    </div>
                    <div>
                      <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-2" />
                      <div className="text-sm font-semibold">13%</div>
                      <div className="text-xs text-muted-foreground">Tentative</div>
                    </div>
                    <div>
                      <div className="w-3 h-3 rounded-full bg-muted mx-auto mb-2" />
                      <div className="text-sm font-semibold">22%</div>
                      <div className="text-xs text-muted-foreground">Available</div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6 mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-6">Venue Settings</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="venue-name">Venue Name</Label>
                      <Input id="venue-name" defaultValue="Convention Center Downtown" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input id="capacity" type="number" defaultValue="500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue="123 Main St, San Francisco, CA 94105" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      defaultValue="Premium convention center in downtown San Francisco, perfect for conferences, exhibitions, and large corporate events."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price">Base Price (per day)</Label>
                      <Input id="price" type="number" defaultValue="2500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Contact Phone</Label>
                      <Input id="phone" type="tel" defaultValue="(555) 123-4567" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-semibold">Amenities</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: "WiFi Available", checked: true },
                        { label: "Parking Available", checked: true },
                        { label: "AV Equipment", checked: true },
                        { label: "Catering Services", checked: true },
                        { label: "Wheelchair Accessible", checked: true },
                        { label: "Security Services", checked: true },
                      ].map((amenity, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Switch id={`amenity-${i}`} defaultChecked={amenity.checked} />
                          <Label htmlFor={`amenity-${i}`} className="cursor-pointer">
                            {amenity.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <Button>Save Changes</Button>
                    <Button variant="outline">Cancel</Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  gradient: string;
  change: string;
}

function StatCard({ title, value, icon: Icon, gradient, change }: StatCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground mb-2">{title}</p>
      <p className="text-xs text-green-600 font-medium">{change}</p>
    </Card>
  );
}
