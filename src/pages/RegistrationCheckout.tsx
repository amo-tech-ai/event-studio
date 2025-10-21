import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Shield, Lock, DollarSign } from "lucide-react";

const RegistrationCheckout = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [isGuest, setIsGuest] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("saved");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Mock order data
  const mockOrder = {
    event: {
      name: "Tech Conference 2024",
      date: "June 15, 2024",
      location: "San Francisco Convention Center",
    },
    tickets: [
      { type: "Early Bird", quantity: 1, price: 99 },
      { type: "Regular", quantity: 2, price: 298 },
      { type: "Parking", quantity: 1, price: 15 },
    ],
    fees: 12,
    total: 424,
  };

  const handleCompleteOrder = () => {
    if (!agreedToTerms) {
      alert("Please agree to terms and conditions");
      return;
    }
    navigate("/confirmation");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold">{mockOrder.event.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {mockOrder.event.date} • {mockOrder.event.location}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">${mockOrder.total}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Checkout Type */}
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Checkbox
                  id="guest"
                  checked={isGuest}
                  onCheckedChange={(checked) => setIsGuest(checked as boolean)}
                />
                <Label htmlFor="guest" className="text-base cursor-pointer">
                  Checkout as guest
                </Label>
                <Checkbox
                  id="account"
                  checked={!isGuest}
                  onCheckedChange={(checked) => setIsGuest(!checked)}
                />
                <Label htmlFor="account" className="text-base cursor-pointer">
                  Create account
                </Label>
              </div>
            </Card>

            {/* Express Checkout */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Express Checkout</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <Button variant="outline" className="w-full h-12">
                  <span className="mr-2">🍎</span>
                  Apple Pay
                </Button>
                <Button variant="outline" className="w-full h-12">
                  <span className="mr-2">🅿️</span>
                  PayPal
                </Button>
                <Button variant="outline" className="w-full h-12">
                  <span className="mr-2">G</span>
                  Google Pay
                </Button>
              </div>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-2 text-muted-foreground">OR</span>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg mb-3">
                  <RadioGroupItem value="saved" id="saved" />
                  <Label htmlFor="saved" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Use saved card: Visa **** 1234</span>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new" className="flex-1 cursor-pointer">
                    Add new payment method
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "new" && (
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" className="mt-1" />
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Billing Address */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St, San Francisco, CA 94105"
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            {/* Terms and Conditions */}
            <Card className="p-6">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm cursor-pointer">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">
                    terms and conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    privacy policy
                  </a>
                </Label>
              </div>
            </Card>

            {/* Complete Order Button */}
            <Button
              size="lg"
              className="w-full h-12"
              onClick={handleCompleteOrder}
              disabled={!agreedToTerms}
            >
              Complete Order
            </Button>

            {/* Trust Signals */}
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>Money-back guarantee</span>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="font-medium">{mockOrder.event.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {mockOrder.event.date}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mockOrder.event.location}
                  </p>
                </div>

                <div className="border-t pt-4 space-y-2">
                  {mockOrder.tickets.map((ticket, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {ticket.type} x{ticket.quantity}
                      </span>
                      <span>${ticket.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee</span>
                    <span>${mockOrder.fees}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${mockOrder.total}</span>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full mb-4"
                onClick={handleCompleteOrder}
                disabled={!agreedToTerms}
              >
                Complete Order
              </Button>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>PCI Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Money-back Guarantee</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationCheckout;
