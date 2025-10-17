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
      <section className="section-hero">
        <div className="container-custom text-center">
          <div className="max-w-5xl mx-auto animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold mb-8 leading-tight tracking-tight">
              The easiest way to<br />
              find a <span className="text-primary">design</span> agency
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto" style={{ lineHeight: '1.6' }}>
              Find vetted top-tier agencies for your marketing projects in minutes — zero hassle, fully transparent.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/event-wizard">
                <Button className="btn-hero px-8 py-4">
                  Get Started
                </Button>
              </Link>
              <Link to="/contact">
                <Button className="btn-outline-hero px-8 py-4">
                  See Demo
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <span className="text-foreground font-medium">Access 25K+ agencies — curated for you:</span>
              <span>Forbes</span>
              <span>TechCrunch</span>
              <span>Adweek</span>
              <span>BizDev</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">The new agency standard</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No more guessing who's good — let EventOS find your perfect-fit agency partners using AI curation and transparent reviews.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="icon-box mx-auto">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Matched Experts</h3>
              <p className="text-muted-foreground leading-relaxed">
                Describe your event, and let AI generate your event outline, timeline, and budget instantly.
              </p>
            </div>

            <div className="text-center">
              <div className="icon-box mx-auto">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Transparent Proposals</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive curated vendor, sponsor, and venue suggestions perfectly matched to your needs.
              </p>
            </div>

            <div className="text-center">
              <div className="icon-box mx-auto">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Launch in Days</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track sales, attendees, and ROI with real-time dashboards and comprehensive analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="section-padding bg-muted/20">
        <div className="container-custom">
          <div className="text-center mb-20">
            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Turn to us for all</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">
              marketing projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From concept to launch, EventOS powers every event type — conferences, festivals, fundraisers, and beyond.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Building2, title: "Corporate Events", desc: "Conferences, team-building, networking summits" },
              { icon: Music, title: "Galas & Awards", desc: "Award ceremonies, fundraiser dinners, charity galas" },
              { icon: Heart, title: "Weddings", desc: "Custom branding, RSVP, seating arrangements" },
              { icon: Calendar, title: "Fundraisers", desc: "Charity events, auctions, donation campaigns" },
              { icon: PartyPopper, title: "Festivals", desc: "Music festivals, food fairs, cultural expos" },
              { icon: Users, title: "Hybrid Events", desc: "In-person + virtual experiences seamlessly" }
            ].map((type, i) => (
              <div key={i} className="card-soft hover-lift">
                <div className="icon-box">
                  <type.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{type.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">
              What makes a perfect<br />agency match?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We've analyzed 250K+ agency projects to define what actually drives success. Our platform is purpose-built for perfect fit.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {[
              { icon: Sparkles, title: "AI Event Wizard", desc: "Build complete event outlines in 5 minutes, including timelines and budget projections." },
              { icon: DollarSign, title: "Secure Payments", desc: "Accept ticket sales and process payouts securely through integrated payment systems." },
              { icon: MessageSquare, title: "Smart Automation", desc: "Send intelligent reminders and updates via WhatsApp, email, and SMS channels." },
              { icon: BarChart3, title: "ROI Analytics", desc: "Real-time dashboards showing sales performance, engagement, and attendance metrics." },
              { icon: Users, title: "Multi-Stakeholder", desc: "Unified dashboards for organizers, sponsors, vendors, and venues in one place." },
              { icon: Calendar, title: "Launch Ready", desc: "Built-in legal agreements and contracts ensure you're compliant and launch-ready." }
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="icon-box mx-auto">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-padding bg-muted/20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-lg p-12 md:p-16 border border-border">
              <div className="flex justify-center mb-8">
                {[1, 2, 3, 4, 5].map(i => (
                  <span key={i} className="text-primary text-xl">★</span>
                ))}
              </div>
              <p className="text-xl md:text-2xl text-center mb-10 leading-relaxed text-foreground">
                "I've tried every platform out there. EventOS reduced our pre-launch time from 6 weeks to 3 days. The WhatsApp automation alone saved us 100+ manual messages per event."
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full bg-muted"></div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">Sarah Chen</p>
                  <p className="text-sm text-muted-foreground">Head of Events, TechCorp 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-8 tracking-tight">
            Get custom pitches<br />in &lt; 5 days
          </h2>
          <p className="text-lg mb-10 opacity-95 max-w-2xl mx-auto leading-relaxed">
            Join thousands of organizers who've moved from chaos to clarity with EventOS. Launch your first AI-powered event in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/event-wizard">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90 font-medium px-10 py-4 rounded">
                Get Started
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border border-background text-background hover:bg-background hover:text-foreground font-medium px-10 py-4 rounded">
                Contact Sales
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
