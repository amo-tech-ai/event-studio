import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Mock data for the event
const mockEvent = {
  id: "e1111111",
  slug: "ai-ml-summit-2025",
  name: "AI & ML Summit 2025",
  date: "June 15, 2025",
  time: "9:00 AM - 6:00 PM",
  location: "San Francisco Convention Center",
};

const steps = [
  { number: 1, label: "Tickets", path: "tickets" },
  { number: 2, label: "Payment", path: "payment" },
  { number: 3, label: "Confirmation", path: "confirmation" },
];

const EventRegistration = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const handleStepClick = (stepNumber: number, path: string) => {
    setCurrentStep(stepNumber);
    navigate(`/event/${slug}/${path}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link
              to={`/event/${slug}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Event</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Need Help?</span>
              <Button variant="ghost" size="sm">
                Support
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <h1 className="text-3xl font-bold">{mockEvent.name}</h1>
            <p className="text-muted-foreground mt-1">
              {mockEvent.date} • {mockEvent.location}
            </p>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <button
                      onClick={() => handleStepClick(step.number, step.path)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                        currentStep === step.number
                          ? "bg-primary text-primary-foreground shadow-lg scale-110"
                          : currentStep > step.number
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        step.number
                      )}
                    </button>
                    <span
                      className={`text-sm font-medium ${
                        currentStep === step.number
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-4 rounded transition-colors ${
                        currentStep > step.number ? "bg-green-500" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Card className="p-8">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                <div className="text-4xl">🎫</div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Complete Your Registration
                </h2>
                <p className="text-muted-foreground">
                  Follow the steps below to secure your spot at {mockEvent.name}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <Card className="p-6 text-left hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-3">🎟️</div>
                  <h3 className="font-semibold mb-2">Step 1: Select Tickets</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose your ticket tier and add any optional extras
                  </p>
                </Card>

                <Card className="p-6 text-left hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-3">💳</div>
                  <h3 className="font-semibold mb-2">Step 2: Payment</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your payment and billing information securely
                  </p>
                </Card>

                <Card className="p-6 text-left hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-3">✅</div>
                  <h3 className="font-semibold mb-2">Step 3: Confirmation</h3>
                  <p className="text-sm text-muted-foreground">
                    Get your tickets and event details instantly
                  </p>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button
                  size="lg"
                  onClick={() => navigate(`/event/${slug}/tickets`)}
                  className="px-8"
                >
                  Start Registration
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate(`/event/${slug}`)}
                >
                  View Event Details
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-8 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-lg">🔒</span>
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-lg">💰</span>
                  <span>Money-back Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-lg">📱</span>
                  <span>Mobile Tickets</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-lg">📧</span>
                  <span>Instant Confirmation</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
