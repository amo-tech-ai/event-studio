import { useParams, Link } from "react-router-dom";
import { CheckCircle, Calendar, Download, Share2, Mail, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Mock confirmation data
const mockConfirmation = {
  orderId: "ORD-12345",
  orderDate: "June 10, 2025",
  event: "AI & ML Summit 2025",
  eventDate: "June 15, 2025",
  eventTime: "9:00 AM - 6:00 PM",
  location: "San Francisco Convention Center",
  locationAddress: "747 Howard St, San Francisco, CA 94103",
  tickets: [
    { name: "Early Bird", qty: 1, price: 99 },
    { name: "Regular", qty: 2, price: 298 },
  ],
  addons: [{ name: "Parking Pass", qty: 1, price: 15 }],
  total: 424,
  paymentMethod: "Visa **** 1234",
  email: "attendee@example.com",
};

const OrderConfirmation = () => {
  const { slug } = useParams();

  const handleAddToCalendar = () => {
    // Visual feedback only
    alert("Calendar invite would be downloaded here!");
  };

  const handleShareEvent = (platform: string) => {
    // Visual feedback only
    alert(`Share to ${platform} would open here!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Registration Confirmed!</h1>
            <p className="text-xl text-muted-foreground mb-1">
              Order #{mockConfirmation.orderId}
            </p>
            <p className="text-sm text-muted-foreground">
              Ordered on {mockConfirmation.orderDate}
            </p>
            
            <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="text-sm">
                Confirmation email sent to {mockConfirmation.email}
              </span>
            </div>
          </div>

          {/* Order Details */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6">Order Details</h2>
            
            <div className="space-y-6">
              {/* Event Info */}
              <div className="bg-primary/5 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">{mockConfirmation.event}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{mockConfirmation.eventDate} • {mockConfirmation.eventTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">📍</span>
                    <span>{mockConfirmation.location}</span>
                  </div>
                  <p className="text-muted-foreground ml-6">
                    {mockConfirmation.locationAddress}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Tickets */}
              <div>
                <h3 className="font-semibold mb-3">Tickets & Add-ons</h3>
                <div className="space-y-2">
                  {mockConfirmation.tickets.map((ticket, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{ticket.name} x{ticket.qty}</span>
                      <span className="font-semibold">${ticket.price}</span>
                    </div>
                  ))}
                  {mockConfirmation.addons.map((addon, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{addon.name} x{addon.qty}</span>
                      <span className="font-semibold">${addon.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Payment */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Total Paid</p>
                  <p className="text-sm text-muted-foreground">
                    {mockConfirmation.paymentMethod}
                  </p>
                </div>
                <p className="text-2xl font-bold">${mockConfirmation.total}</p>
              </div>
            </div>
          </Card>

          {/* What's Next */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6">What's Next?</h2>
            
            <div className="space-y-6">
              {/* Add to Calendar */}
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 flex-shrink-0">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Add to Your Calendar</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Don't forget the date! Add this event to your calendar.
                  </p>
                  <Button onClick={handleAddToCalendar} variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Add to Calendar
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Email Confirmation */}
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Check Your Email</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a confirmation email with your tickets and event details.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Reminders */}
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 flex-shrink-0">
                  <span className="text-2xl">🔔</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Event Reminders</h3>
                  <p className="text-sm text-muted-foreground">
                    You'll receive reminders 1 week and 1 day before the event.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Tickets Available */}
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 flex-shrink-0">
                  <span className="text-2xl">🎫</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Mobile Tickets</h3>
                  <p className="text-sm text-muted-foreground">
                    Your tickets will be available 24 hours before the event starts.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Share Event */}
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">Share Your Excitement</h2>
            <p className="text-muted-foreground mb-6">
              Spread the word and invite your friends to join you!
            </p>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <Button 
                variant="outline" 
                onClick={() => handleShareEvent("Facebook")}
                className="flex-1 min-w-[120px]"
              >
                <span className="mr-2">📱</span>
                Facebook
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleShareEvent("Twitter")}
                className="flex-1 min-w-[120px]"
              >
                <span className="mr-2">🐦</span>
                Twitter
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleShareEvent("LinkedIn")}
                className="flex-1 min-w-[120px]"
              >
                <span className="mr-2">💼</span>
                LinkedIn
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleShareEvent("Instagram")}
                className="flex-1 min-w-[120px]"
              >
                <span className="mr-2">📸</span>
                Instagram
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                #AIMLSummit2025 #TechConference
              </p>
            </div>
          </Card>

          {/* Support */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is here to assist you.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Call Us</p>
                  <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">support@eventos.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Live Chat</p>
                  <p className="text-sm text-muted-foreground">Available 24/7</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button asChild size="lg" className="flex-1">
              <Link to={`/event/${slug}`}>
                View Event Details
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="flex-1">
              <Link to="/events">
                Browse More Events
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
