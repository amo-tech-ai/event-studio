import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Menu, Plus, Minus, CreditCard } from "lucide-react";

const MobileRegistration = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [quantities, setQuantities] = useState({ earlyBird: 1, regular: 2, vip: 0 });

  // Mock event data
  const mockEvent = {
    name: "Tech Conference 2024",
    date: "June 15, 2024",
    location: "San Francisco",
    tickets: [
      {
        id: "earlyBird",
        name: "Early Bird",
        price: 99,
        benefits: ["All sessions", "Networking", "Lunch"],
      },
      {
        id: "regular",
        name: "Regular",
        price: 149,
        benefits: ["All sessions", "Networking", "Lunch", "Swag bag"],
        popular: true,
      },
      {
        id: "vip",
        name: "VIP",
        price: 299,
        benefits: ["All sessions", "Premium seat", "VIP lounge", "Meet speakers"],
      },
    ],
  };

  const updateQuantity = (ticketId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketId]: Math.max(0, prev[ticketId as keyof typeof prev] + change),
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    mockEvent.tickets.forEach((ticket) => {
      total += ticket.price * quantities[ticket.id as keyof typeof quantities];
    });
    return total + 27; // Adding fees
  };

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/confirmation");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="font-semibold text-base">{mockEvent.name}</h1>
            <p className="text-xs text-muted-foreground">{mockEvent.date}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 pb-4">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-2 w-2 rounded-full transition-colors ${
                step === currentStep
                  ? "bg-primary w-6"
                  : step < currentStep
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {currentStep === 1 && (
          <>
            <h2 className="text-xl font-bold mb-4">Select Your Tickets</h2>
            {mockEvent.tickets.map((ticket) => (
              <Card key={ticket.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{ticket.name}</h3>
                      {ticket.popular && (
                        <Badge variant="secondary" className="text-xs">
                          Most Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-primary mt-1">
                      ${ticket.price}
                    </p>
                  </div>
                </div>
                <ul className="space-y-1 mb-4">
                  {ticket.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Quantity</span>
                  <div className="flex items-center gap-3">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-10 w-10"
                      onClick={() => updateQuantity(ticket.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-semibold w-8 text-center">
                      {quantities[ticket.id as keyof typeof quantities]}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-10 w-10"
                      onClick={() => updateQuantity(ticket.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}

        {currentStep === 2 && (
          <>
            <h2 className="text-xl font-bold mb-4">Contact Information</h2>
            <Card className="p-4 space-y-4">
              <div>
                <Label htmlFor="mobile-email">Email</Label>
                <Input
                  id="mobile-email"
                  type="email"
                  placeholder="john@example.com"
                  className="mt-1 h-12"
                />
              </div>
              <div>
                <Label htmlFor="mobile-phone">Phone</Label>
                <Input
                  id="mobile-phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="mt-1 h-12"
                />
              </div>
              <div>
                <Label htmlFor="mobile-name">Full Name</Label>
                <Input
                  id="mobile-name"
                  placeholder="John Doe"
                  className="mt-1 h-12"
                />
              </div>
            </Card>
          </>
        )}

        {currentStep === 3 && (
          <>
            <h2 className="text-xl font-bold mb-4">Payment</h2>
            
            {/* Express Payment */}
            <Card className="p-4 space-y-3">
              <h3 className="font-semibold mb-3">Express Payment</h3>
              <Button variant="outline" className="w-full h-12 justify-start">
                <span className="mr-2">🍎</span>
                Apple Pay
              </Button>
              <Button variant="outline" className="w-full h-12 justify-start">
                <span className="mr-2">G</span>
                Google Pay
              </Button>
            </Card>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">OR</span>
              </div>
            </div>

            {/* Card Payment */}
            <Card className="p-4 space-y-4">
              <div>
                <Label htmlFor="mobile-card">Card Number</Label>
                <Input
                  id="mobile-card"
                  placeholder="1234 5678 9012 3456"
                  className="mt-1 h-12"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mobile-expiry">Expiry</Label>
                  <Input
                    id="mobile-expiry"
                    placeholder="MM/YY"
                    className="mt-1 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="mobile-cvv">CVV</Label>
                  <Input
                    id="mobile-cvv"
                    placeholder="123"
                    className="mt-1 h-12"
                  />
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-card p-4 space-y-3">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {mockEvent.name}
            </span>
            <Button variant="ghost" size="sm" className="h-auto p-0 text-primary">
              Details
            </Button>
          </div>
          <div className="space-y-1 text-sm mb-2">
            <div className="flex justify-between">
              <span>Early Bird x{quantities.earlyBird}</span>
              <span>${99 * quantities.earlyBird}</span>
            </div>
            <div className="flex justify-between">
              <span>Regular x{quantities.regular}</span>
              <span>${149 * quantities.regular}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Fees</span>
              <span>$27</span>
            </div>
          </div>
          <div className="flex items-center justify-between font-bold border-t pt-2">
            <span>Total</span>
            <span className="text-lg">${calculateTotal()}</span>
          </div>
        </Card>
        <Button size="lg" className="w-full h-12" onClick={handleContinue}>
          {currentStep === 3 ? "Complete Payment" : "Continue"}
        </Button>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            🔒 Secure Payment
          </span>
          <span>💰 Money-back Guarantee</span>
        </div>
      </div>
    </div>
  );
};

export default MobileRegistration;
