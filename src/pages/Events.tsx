/**
 * Event Listing Page
 * 
 * Browse all published events with search, filters, and featured sections.
 * Mobile-first, conversion-optimized design following event platform best practices.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Calendar, Tag, ChevronRight, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEvents } from "@/features/events/hooks/useEvents";
import { format } from "date-fns";

const Events = () => {
  const { data: events, isLoading } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");

  // Get unique event types
  const eventTypes = ["all", ...Array.from(new Set(events?.map(e => e.type) || []))];

  // Filter events based on search and filters
  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || event.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Featured events (first 3)
  const featuredEvents = filteredEvents?.slice(0, 3);
  // Latest events (remaining)
  const latestEvents = filteredEvents?.slice(3);

  const formatPrice = (cents: number) => {
    if (cents === 0) return "Free Entry";
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-semibold mb-6 tracking-tight">
              Browse All Events
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover upcoming events, from networking mixers to industry conferences. Find your next experience.
            </p>
          </div>

          {/* Search + Filter Bar */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Filters:</span>
                </div>
                
                {/* Category Filter */}
                <div className="flex gap-2 flex-wrap">
                  {eventTypes.map((type) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type)}
                      className="capitalize"
                    >
                      {type}
                    </Button>
                  ))}
                </div>

                {/* Format Filter - Simple toggle */}
                <div className="flex gap-2 ml-auto">
                  <Button
                    variant={selectedFormat === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFormat("all")}
                  >
                    All Events
                  </Button>
                  <Button
                    variant={selectedFormat === "online" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFormat("online")}
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Virtual
                  </Button>
                  <Button
                    variant={selectedFormat === "inperson" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFormat("inperson")}
                  >
                    <MapPin className="w-3 h-3 mr-1" />
                    In-Person
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      {featuredEvents && featuredEvents.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container-custom max-w-5xl">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Featured Events
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/event/${event.slug}`}
                  className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                        Featured
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category Tag */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-accent/20 text-accent-foreground">
                        {event.type}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {event.name}
                    </h3>

                    {/* Date & Location */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{format(new Date(event.start_at), "MMM d, yyyy • h:mm a")}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>Online Event</span>
                      </div>
                    </div>

                    {/* Description */}
                    {event.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {event.description}
                      </p>
                    )}

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-lg font-semibold text-primary">
                        {formatPrice(event.price_cents)}
                      </span>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Explore Event
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

      {/* Latest Events Grid */}
      <section className="py-16 bg-muted/20">
        <div className="container-custom max-w-5xl">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Latest Events
            </h2>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground mt-4">Loading events...</p>
            </div>
          ) : latestEvents && latestEvents.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestEvents.map((event) => (
                  <Link
                    key={event.id}
                    to={`/event/${event.slug}`}
                    className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Image Placeholder */}
                    <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Category Tag */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                          {event.type}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {event.name}
                      </h3>

                      {/* Date & Location */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{format(new Date(event.start_at), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>Online Event</span>
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-lg font-semibold text-primary">
                          {formatPrice(event.price_cents)}
                        </span>
                        <Button variant="ghost" size="sm" className="gap-1">
                          Explore
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <Button variant="outline" size="lg" className="gap-2">
                  Load More Events
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No events found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-background">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight">
            Host Your Own Event
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            List your event for free or boost visibility with premium placement. Reach thousands of potential attendees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/event-wizard">
              <Button size="lg" className="px-8">
                Post Free Event
              </Button>
            </Link>
            <Link to="/event-wizard">
              <Button size="lg" variant="outline" className="px-8">
                Post Premium Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
