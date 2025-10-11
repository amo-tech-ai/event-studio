import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Search, TrendingUp, Users, Calendar, DollarSign, MessageSquare, BarChart3, Heart, Building2, Music, PartyPopper } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="section-hero pt-32">
        <div className="container-custom text-center">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Plan, launch, and grow<br />
              events — <span className="text-primary">fast.</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              There's an easier way to run events. Let AI do the heavy lifting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button className="btn-hero">
                  Get Started
                </Button>
              </Link>
              <Link to="/contact">
                <Button className="btn-outline-hero">
                  Book a Demo
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-foreground/60">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">750+ Agencies</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">50+ Project Types</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">20+ Countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How it works</h2>
            <p className="text-lg text-foreground/70">Three simple steps to perfect-scale events</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-feature hover-lift">
              <div className="icon-box mx-auto">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Plan with AI</h3>
              <p className="text-foreground/70">
                Describe your event, and let AI generate your event outline, timeline, and budget.
              </p>
            </div>

            <div className="card-feature hover-lift">
              <div className="icon-box mx-auto">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Get Recommendations</h3>
              <p className="text-foreground/70">
                Receive curated vendor, sponsor, and venue suggestions matching your needs.
              </p>
            </div>

            <div className="card-feature hover-lift">
              <div className="icon-box mx-auto">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Manage & Grow</h3>
              <p className="text-foreground/70">
                Track sales, attendees, and ROI with real-time dashboards and analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What you can run with EventOS</h2>
            <p className="text-lg text-foreground/70">Built for every event type imaginable</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Building2, title: "Corporate Events", desc: "Conferences, team-building, networking" },
              { icon: Music, title: "Galas", desc: "Award ceremonies, fundraiser dinners" },
              { icon: Heart, title: "Weddings", desc: "Custom branding, RSVP, seating" },
              { icon: Calendar, title: "Fundraisers", desc: "Charity events, auctions, donations" },
              { icon: PartyPopper, title: "Festivals", desc: "Music festivals, food fairs, art expos" },
              { icon: Users, title: "Hybrid Events", desc: "In-person + virtual experiences" }
            ].map((type, i) => (
              <div key={i} className="card-soft hover-lift">
                <div className="icon-box">
                  <type.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                <p className="text-sm text-foreground/70">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful features, zero complexity</h2>
            <p className="text-lg text-foreground/70">From planning to post-event analytics, EventOS handles it all</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: "AI Event Wizard", desc: "Build complete event outlines in 5 minutes, including timelines and budget." },
              { icon: DollarSign, title: "Stripe Payments", desc: "Accept ticket sales and process payouts securely and quickly." },
              { icon: MessageSquare, title: "WhatsApp Automation", desc: "Send smart reminders and updates via WhatsApp and email." },
              { icon: BarChart3, title: "ROI Analytics", desc: "Real-time dashboards showing sales, engagement, and attendance rate." },
              { icon: Users, title: "Multi-Stakeholder", desc: "Manage dashboards for organizers, sponsors, vendors, venues in one place." },
              { icon: Calendar, title: "Compliance Ready", desc: "In-built legal agreements and contracts, so you're launch-ready." }
            ].map((feature, i) => (
              <div key={i} className="card-feature hover-lift">
                <div className="icon-box mx-auto">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-foreground/70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className="text-primary text-2xl">★</span>
              ))}
            </div>
            <p className="text-2xl md:text-3xl font-serif italic mb-8 text-foreground/90">
              "EventOS reduced our pre-launch time from 6 weeks to 3 days. It's magical — our budget was actually on-point, and the WhatsApp automation saved us 100+ manual messages."
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20"></div>
              <div className="text-left">
                <p className="font-semibold">Sarah Chen</p>
                <p className="text-sm text-foreground/60">Head of Events, TechCorp 2025</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to streamline your event planning?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of organizers who've moved from mess to magic with EventOS. Launch your first AI-powered event in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8">
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
