import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  Check,
  Clock,
  Shield,
  Award,
  Zap,
} from "lucide-react";

const speakers = [
  { name: "Jane Smith", company: "Google", role: "VP Engineering", imageUrl: "/placeholder.svg" },
  { name: "John Doe", company: "Microsoft", role: "CTO", imageUrl: "/placeholder.svg" },
  { name: "Sarah Lee", company: "Apple", role: "Design Lead", imageUrl: "/placeholder.svg" },
  { name: "Mike Chen", company: "Amazon", role: "Director", imageUrl: "/placeholder.svg" },
];

const testimonials = [
  {
    quote: "Amazing event! Learned so much from industry leaders. Highly recommended!",
    author: "Sarah K.",
    role: "Software Engineer",
    company: "Tech Corp",
  },
  {
    quote: "Best tech conference I've been to! Great networking and content.",
    author: "Mike R.",
    role: "Product Manager",
    company: "Startup Inc",
  },
  {
    quote: "Incredible networking and learning experience. Worth every penny!",
    author: "Alex T.",
    role: "Designer",
    company: "Design Co",
  },
];

const benefits = [
  "50+ Industry Leaders",
  "Hands-on Workshops",
  "Networking Opportunities",
  "Exclusive Swag Bag",
  "Certificate of Attendance",
  "Lifetime Access to Recordings",
];

const agenda = [
  { time: "9:00 AM", title: "Keynote: The Future of AI", speaker: "Jane Smith" },
  { time: "10:30 AM", title: "Workshop: Building Scalable Apps", speaker: "John Doe" },
  { time: "12:00 PM", title: "Networking Lunch", speaker: "" },
  { time: "2:00 PM", title: "Panel: Industry Trends", speaker: "Various Speakers" },
  { time: "4:00 PM", title: "Networking Session", speaker: "" },
];

export default function RegistrationLanding() {
  const { eventSlug } = useParams();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/60 py-20 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4" variant="secondary">
              <Clock className="mr-1 h-3 w-3" />
              Early Bird Pricing Ends Soon!
            </Badge>
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">Tech Conference 2024</h1>
            <p className="mb-8 text-xl md:text-2xl">The Future of Technology is Here</p>
            <div className="mb-8 flex flex-col items-center justify-center gap-4 text-lg md:flex-row">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>June 15, 2024</span>
              </div>
              <div className="hidden md:block">•</div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>San Francisco Convention Center</span>
              </div>
              <div className="hidden md:block">•</div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>9:00 AM - 6:00 PM</span>
              </div>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 rounded-lg bg-white/10 p-3">
                  <Check className="h-5 w-5 flex-shrink-0" />
                  <span className="text-left text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="text-lg" variant="secondary">
                🎫 Register Now - $149
              </Button>
              <Button size="lg" variant="outline" className="border-white text-lg text-white hover:bg-white/10">
                📖 Learn More
              </Button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>Early Bird ends in: 3 days, 14 hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="border-b py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">What Attendees Say</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Speakers */}
      <section className="border-b bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold">Featured Speakers</h2>
          <p className="mb-12 text-center text-muted-foreground">
            Learn from the best in the industry
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {speakers.map((speaker, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex h-32 w-full items-center justify-center rounded-lg bg-muted">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 font-semibold">{speaker.name}</h3>
                  <p className="mb-1 text-sm font-medium text-primary">{speaker.company}</p>
                  <p className="text-sm text-muted-foreground">{speaker.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda Highlights */}
      <section className="border-b py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center text-3xl font-bold">Agenda Highlights</h2>
          <p className="mb-12 text-center text-muted-foreground">
            Packed with valuable content and networking
          </p>
          <div className="mx-auto max-w-3xl">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {agenda.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 border-b pb-4 last:border-0 md:flex-row md:items-center"
                    >
                      <div className="flex items-center gap-2 md:w-32">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{item.time}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        {item.speaker && (
                          <p className="text-sm text-muted-foreground">{item.speaker}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-br from-primary to-primary/60 py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Join Us?</h2>
          <p className="mb-8 text-xl">
            Limited spots available. Secure your ticket today!
          </p>
          <div className="mb-8 flex justify-center gap-8">
            <div className="text-center">
              <p className="mb-1 text-3xl font-bold">50+</p>
              <p className="text-sm">Speakers</p>
            </div>
            <div className="text-center">
              <p className="mb-1 text-3xl font-bold">1000+</p>
              <p className="text-sm">Attendees</p>
            </div>
            <div className="text-center">
              <p className="mb-1 text-3xl font-bold">20+</p>
              <p className="text-sm">Workshops</p>
            </div>
          </div>
          <Button size="lg" variant="secondary" className="text-lg">
            🎫 Register Now - $149
          </Button>
        </div>
      </section>

      {/* Trust Signals Footer */}
      <section className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Secure Registration</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">30-Day Money Back</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Instant Confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-sm">4.9/5 Rating (1,247 reviews)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
