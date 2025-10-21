import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Sparkles, Search, TrendingUp, Users, Calendar, DollarSign, MessageSquare, BarChart3, 
  Heart, Building2, Music, PartyPopper, MapPin, Calculator, Clock, AlertTriangle, 
  FileText, Handshake, Brain, Globe, Target, Zap, Bot, CheckCircle2, 
  ArrowRight, Play, BarChart, TrendingDown, Palette, ShoppingBag, Video
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative section-hero overflow-hidden">
        {/* Wave Background Layers */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute bottom-0 w-full h-[120%]" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <path d="M0,400 C360,320 720,480 1440,400 L1440,800 L0,800 Z" fill="hsl(var(--accent)/0.15)" />
            <path d="M0,480 C360,400 720,560 1440,480 L1440,800 L0,800 Z" fill="hsl(var(--accent)/0.1)" />
            <path d="M0,560 C360,480 720,640 1440,560 L1440,800 L0,800 Z" fill="hsl(var(--muted)/0.2)" />
          </svg>
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-[10%] w-24 h-24 rounded-3xl bg-primary/10 blur-sm animate-float" style={{ animationDelay: '0s', animationDuration: '8s' }} />
          <div className="absolute top-40 right-[15%] w-16 h-16 rounded-full bg-accent/15 blur-sm animate-float" style={{ animationDelay: '2s', animationDuration: '10s' }} />
          <div className="absolute bottom-32 left-[20%] w-20 h-20 rounded-2xl bg-primary/12 blur-sm animate-float" style={{ animationDelay: '4s', animationDuration: '12s' }} />
          <div className="absolute top-[30%] right-[8%] w-28 h-28 rounded-3xl bg-accent/10 blur-sm animate-float" style={{ animationDelay: '1s', animationDuration: '9s' }} />
          <div className="absolute bottom-48 right-[25%] w-14 h-14 rounded-full bg-primary/15 blur-sm animate-float" style={{ animationDelay: '3s', animationDuration: '11s' }} />
        </div>

        <div className="container-custom text-center relative z-10">
          <div className="max-w-5xl mx-auto animate-fade-in-up">
            {/* White Content Box */}
            <div className="bg-card/95 backdrop-blur-sm rounded-3xl shadow-lg p-12 md:p-16 border border-border/50">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold mb-8 leading-tight tracking-tight">
                Create, Manage & Grow<br />
                Events in Minutes
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto" style={{ lineHeight: '1.6' }}>
                EventOS automates event planning, marketing, and analytics through multi-agent AI orchestration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/event-wizard">
                  <Button className="btn-hero px-8 py-4">
                    Start Your Free Trial
                  </Button>
                </Link>
                <Button className="btn-outline-hero px-8 py-4">
                  <Play className="w-4 h-4 mr-2" />
                  Watch the 3-Minute AI Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About EventOS - Metrics */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="text-lg text-foreground leading-relaxed mb-12">
              EventOS uses intelligent AI agents to manage planning, marketing, sponsorship, and analytics — reducing time from weeks to minutes.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { value: "80%", label: "Faster event planning" },
              { value: "400%", label: "Increase in marketing reach" },
              { value: "45%", label: "Higher ticket conversions" },
              { value: "60%", label: "Sponsor retention boost" }
            ].map((metric, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-semibold text-primary mb-2">{metric.value}</div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="section-padding bg-muted/20">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">
              Core AI Features That Save<br />Time and Boost Results
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: MapPin, title: "Intelligent Venue Selection", desc: "AI matches your event with perfect venues based on capacity, location, and budget." },
              { icon: Calculator, title: "Automated Budget Optimization", desc: "Smart budget allocation across vendors, marketing, and operations." },
              { icon: Clock, title: "Smart Scheduling", desc: "Optimal timeline generation with conflict detection and best practices." },
              { icon: AlertTriangle, title: "Predictive Issue Detection", desc: "AI identifies potential problems before they impact your event." },
              { icon: FileText, title: "AI Description & Copywriting", desc: "Generate compelling event descriptions and marketing copy instantly." },
              { icon: Handshake, title: "Vendor Coordination", desc: "Automated vendor matching, communication, and contract management." }
            ].map((feature, i) => (
              <div key={i} className="card-soft hover-lift">
                <div className="icon-box">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced AI Features */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">
              Advanced Intelligence for<br />Power Users
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {[
              { icon: Brain, title: "Multi-Agent Orchestration (CrewAI)", desc: "Coordinated AI agents work together to plan, execute, and optimize every aspect of your event." },
              { icon: Globe, title: "Web & Social Data Mining", desc: "Real-time market research and trend analysis from across the web to inform your strategy." },
              { icon: Target, title: "Predictive Attendance Forecasting", desc: "Machine learning models predict attendance patterns and optimize capacity planning." },
              { icon: BarChart, title: "ROI Dashboards for Sponsors", desc: "Real-time sponsor value tracking with engagement metrics and conversion analytics." },
              { icon: Zap, title: "Automation Layer: WhatsApp, SendGrid, Stripe", desc: "Integrated communication, email marketing, and payment processing — all automated." }
            ].map((feature, i) => (
              <div key={i} className="text-left">
                <div className="icon-box mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents Overview */}
      <section className="section-padding bg-muted/20">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">
              Meet Your EventOS AI Agents
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Specialized AI agents work 24/7 to handle every aspect of your event management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Bot, name: "Event Planner Agent", role: "Creates comprehensive event plans with timelines and resource allocation." },
              { icon: Search, name: "Market Researcher Agent", role: "Analyzes trends, competitors, and audience demographics." },
              { icon: FileText, name: "Content Writer Agent", role: "Generates marketing copy, descriptions, and promotional content." },
              { icon: CheckCircle2, name: "Quality Verifier Agent", role: "Reviews all outputs for accuracy, compliance, and best practices." },
              { icon: Palette, name: "Media Producer Agent", role: "Creates visual assets and optimizes media for all channels." },
              { icon: TrendingUp, name: "ROI Analyst Agent", role: "Tracks performance metrics and provides actionable insights." }
            ].map((agent, i) => (
              <div key={i} className="card-soft hover-lift text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <agent.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{agent.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Wizard Walkthrough */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">
              The 3-Minute Event Wizard
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From concept to published event in seven intelligent steps.
            </p>
          </div>

          {/* Single Column Layout */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="space-y-6">
              {[
                { step: "1", title: "Basic Info", desc: "Event name, type, date, and core details", icon: FileText },
                { step: "2", title: "AI Description", desc: "Generate compelling copy instantly", icon: Sparkles },
                { step: "3", title: "Venue Matching", desc: "Smart location and capacity planning", icon: MapPin },
                { step: "4", title: "Ticket Tiers", desc: "Flexible pricing and access levels", icon: DollarSign },
                { step: "5", title: "Designer Invites", desc: "Curate talent and manage RSVPs", icon: Users },
                { step: "6", title: "Marketing Plan", desc: "Multi-channel campaign automation", icon: MessageSquare },
                { step: "7", title: "Publish & Track", desc: "Go live and monitor performance", icon: BarChart3 }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Icon - Centered */}
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-xl bg-primary/5 flex items-center justify-center">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                  </div>
                  
                  {/* Text Content - Centered */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-3 text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link to="/event-wizard">
              <Button className="btn-hero px-10 py-6 text-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                Launch Event Wizard
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • 14-day free trial
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section-padding bg-muted/20">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">
              AI Solutions for Every<br />Event Type
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Calendar, title: "Organizers", desc: "End-to-end event automation" },
              { icon: DollarSign, title: "Sponsors", desc: "Real-time ROI dashboards" },
              { icon: Palette, title: "Designers", desc: "AI-powered matching" },
              { icon: Heart, title: "Attendees", desc: "Personalized discovery" },
              { icon: ShoppingBag, title: "Vendors", desc: "Smart scheduling tools" }
            ].map((useCase, i) => (
              <div key={i} className="card-soft hover-lift text-center">
                <div className="icon-box mx-auto">
                  <useCase.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-World Examples */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">
              Proven in Real Events
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { title: "Fashion Week Medellín", workflow: "AI venue selection + automated invites", impact: "2,400 attendees, 90% satisfaction" },
              { title: "Eco-Runway Bogotá", workflow: "Sustainability analysis + vendor matching", impact: "Zero-waste event, 30+ sponsors" },
              { title: "Virtual Design Summit", workflow: "Hybrid event orchestration + global reach", impact: "15,000 virtual attendees" },
              { title: "Community Pop-Up Market", workflow: "Budget optimization + local discovery", impact: "$45K revenue, 200 vendors" }
            ].map((example, i) => (
              <div key={i} className="card-soft hover-lift">
                <h3 className="text-lg font-semibold mb-3">{example.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{example.workflow}</p>
                <p className="text-sm font-medium text-primary">{example.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-muted/20">
        <div className="container-custom">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">
              Everything You Need to<br />Run Smarter Events
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Brain, title: "AI Event Planning", desc: "Automated workflows" },
              { icon: Zap, title: "AI Marketing & Automation", desc: "Multi-channel campaigns" },
              { icon: DollarSign, title: "Sponsorship Management", desc: "ROI tracking" },
              { icon: Users, title: "Designer & Talent Curation", desc: "Smart matching" },
              { icon: BarChart3, title: "Analytics & Insights", desc: "Real-time dashboards" }
            ].map((service, i) => (
              <div key={i} className="text-center">
                <div className="icon-box mx-auto">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-8 tracking-tight">
            Transform Your Events<br />with AI
          </h2>
          <p className="text-lg mb-10 opacity-95 max-w-2xl mx-auto leading-relaxed">
            From idea to ROI in 3 minutes — join thousands using EventOS to simplify event management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/event-wizard">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90 font-medium px-10 py-4 rounded">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border border-background text-background hover:bg-background hover:text-foreground font-medium px-10 py-4 rounded">
              Schedule Demo
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm opacity-80">
            <span>Trusted by industry leaders:</span>
            <span>Forbes</span>
            <span>TechCrunch</span>
            <span>Adweek</span>
            <span>EventMB</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
