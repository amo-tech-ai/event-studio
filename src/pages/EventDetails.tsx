/**
 * Event Details Page
 * 
 * Single event view with full details, registration CTA, and related events.
 * Conversion-optimized design to drive ticket sales and registrations.
 */

import { useParams, Link } from "react-router-dom";
import { 
  Calendar, MapPin, Clock, Users, Share2, Heart, 
  ChevronRight, Download, ExternalLink 
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/features/events/hooks/useEvents";
import { format } from "date-fns";

const EventDetails = () => {
  const { slug } = useParams();
  const { data: allEvents, isLoading } = useEvents();
  
  // Find the event by slug
  const event = allEvents?.find(e => e.slug === slug);
  
  // Related events (same type, exclude current)
  const relatedEvents = allEvents
    ?.filter(e => e.type === event?.type && e.slug !== slug)
    .slice(0, 3);

  const formatPrice = (cents: number) => {
    if (cents === 0) return "Free Entry";
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground mt-4">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-semibold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-8">The event you're looking for doesn't exist.</p>
          <Link to="/events">
            <Button>Browse All Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-24 pb-0 overflow-hidden">
        {/* Large Event Image/Banner */}
        <div className="relative h-[50vh] md:h-[60vh] bg-gradient-to-br from-primary/30 via-accent/30 to-primary/20">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          {/* Overlaid Title & Info */}
          <div className="absolute bottom-0 left-0 right-0 pb-12">
            <div className="container-custom max-w-7xl">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Event Info */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Category Tag */}
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-primary text-primary-foreground">
                      {event.type}
                    </span>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-card/90 backdrop-blur-sm border border-border">
                      Published
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
                    {event.name}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-background">
        <div className="container-custom max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column: Event Details */}
            <div className="lg:col-span-2 space-y-10">
              {/* Event Overview */}
              <div className="bg-card rounded-2xl p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6">Event Overview</h2>
                <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                  {event.description || "Join us for an amazing event experience. This event brings together industry professionals and enthusiasts for networking, learning, and collaboration."}
                </p>
                
                {/* Key Details Grid */}
                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
                      <p className="font-medium">{format(new Date(event.start_at), "EEEE, MMMM d, yyyy")}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.start_at), "h:mm a")} - {format(new Date(event.end_at), "h:mm a")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="font-medium">Online Event</p>
                      <a href="#" className="text-sm text-primary hover:underline flex items-center gap-1">
                        View on Map <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Capacity</p>
                      <p className="font-medium">{event.capacity || "Unlimited"} attendees</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Duration</p>
                      <p className="font-medium">
                        {Math.round((new Date(event.end_at).getTime() - new Date(event.start_at).getTime()) / (1000 * 60 * 60))} hours
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add to Calendar */}
                <div className="pt-6 border-t border-border mt-6">
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Add to Calendar
                  </Button>
                </div>
              </div>

              {/* Schedule Section */}
              <div className="bg-card rounded-2xl p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6">Event Schedule</h2>
                
                <div className="space-y-6">
                  {[
                    { time: format(new Date(event.start_at), "h:mm a"), title: "Registration & Check-in", desc: "Welcome reception and networking" },
                    { time: format(new Date(event.start_at), "h:mm a"), title: "Opening Keynote", desc: "Industry insights and trends" },
                    { time: "2:00 PM", title: "Panel Discussion", desc: "Expert perspectives and Q&A" },
                    { time: "3:30 PM", title: "Networking Break", desc: "Refreshments and connections" },
                    { time: format(new Date(event.end_at), "h:mm a"), title: "Closing Remarks", desc: "Recap and next steps" }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Clock className="w-5 h-5" />
                        </div>
                        {i < 4 && <div className="w-px flex-1 bg-border mt-2" />}
                      </div>
                      <div className="flex-1 pb-8">
                        <p className="text-sm font-medium text-primary mb-1">{item.time}</p>
                        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo Gallery */}
              <div className="bg-card rounded-2xl p-8 border border-border">
                <h2 className="text-2xl font-semibold mb-6">Event Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div 
                      key={i} 
                      className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 hover:scale-105 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Registration Card */}
                <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Price</p>
                    <p className="text-4xl font-bold text-primary mb-1">
                      {formatPrice(event.price_cents)}
                    </p>
                    {event.price_cents > 0 && (
                      <p className="text-sm text-muted-foreground">per person</p>
                    )}
                  </div>

                  <Button size="lg" className="w-full mb-4 text-lg py-6">
                    Register Now
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline" size="lg" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="lg" className="flex-1">
                      <Heart className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>

                  <div className="pt-6 mt-6 border-t border-border space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Spots Remaining</span>
                      <span className="font-medium">{event.capacity ? Math.floor(event.capacity * 0.7) : "Many"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Response Time</span>
                      <span className="font-medium">Within 24 hours</span>
                    </div>
                  </div>
                </div>

                {/* Organizer Card */}
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="font-semibold mb-4">Hosted By</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold">
                      E
                    </div>
                    <div>
                      <p className="font-medium">EventOS</p>
                      <p className="text-sm text-muted-foreground">Event Organizer</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Professional event management platform creating memorable experiences.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Contact Organizer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Events */}
      {relatedEvents && relatedEvents.length > 0 && (
        <section className="py-16 bg-muted/20">
          <div className="container-custom max-w-7xl">
            <h2 className="text-3xl md:text-4xl font-semibold mb-10 tracking-tight">
              Similar Events You May Like
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((relatedEvent) => (
                <Link
                  key={relatedEvent.id}
                  to={`/event/${relatedEvent.slug}`}
                  className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20" />
                  <div className="p-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground mb-3">
                      {relatedEvent.type}
                    </span>
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {relatedEvent.name}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(relatedEvent.start_at), "MMM d, yyyy")}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-lg font-semibold text-primary">
                        {formatPrice(relatedEvent.price_cents)}
                      </span>
                      <Button variant="ghost" size="sm" className="gap-1">
                        View Event
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Footer */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-background">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight">
            Ready to Join Us?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Don't miss out on this amazing opportunity. Register now to secure your spot.
          </p>
          <Button size="lg" className="px-12 py-6 text-lg">
            Register Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventDetails;
