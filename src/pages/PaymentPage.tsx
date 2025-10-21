import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

// Mock order data
const mockOrderSummary = {
  event: "AI & ML Summit 2025",
  date: "June 15, 2025",
  location: "San Francisco Convention Center",
  tickets: [
    { name: "Early Bird", qty: 1, price: 99 },
    { name: "Regular", qty: 2, price: 298 },
  ],
  addons: [{ name: "Parking Pass", qty: 1, price: 15 }],
  subtotal: 412,
  fees: 12,
  total: 424,
};

const PaymentPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [savePayment, setSavePayment] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleCompletePayment = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      navigate(`/event/${slug}/confirmation`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link
              to={`/event/${slug}/tickets`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Tickets</span>
            </Link>

            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">SSL Secured</span>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="hidden md:flex items-center justify-center gap-2 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">
                ✓
              </div>
              <span className="text-sm text-muted-foreground">Tickets</span>
            </div>
            <div className="w-12 h-1 bg-green-500" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
            <div className="w-12 h-1 bg-muted" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
                3
              </div>
              <span className="text-sm text-muted-foreground">Confirm</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Complete Your Registration</h1>
              <p className="text-muted-foreground">{mockOrderSummary.event}</p>
            </div>

            {/* Payment Method Selection */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/30"
                  }`}
                >
                  <CreditCard className="h-6 w-6 mx-auto mb-2" />
                  <span className="font-medium">Credit Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("paypal")}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === "paypal"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="text-2xl mb-2">💳</div>
                  <span className="font-medium">PayPal</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("apple")}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === "apple"
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="text-2xl mb-2">🍎</div>
                  <span className="font-medium">Apple Pay</span>
                </button>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                    </div>
                    <div className="col-span-1">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" className="mt-1" />
                    </div>
                    <div className="col-span-1">
                      <Label htmlFor="zip">ZIP</Label>
                      <Input id="zip" placeholder="94105" className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="savePayment"
                      checked={savePayment}
                      onCheckedChange={(checked) => setSavePayment(checked as boolean)}
                    />
                    <Label htmlFor="savePayment" className="font-normal cursor-pointer">
                      Save payment method for future use
                    </Label>
                  </div>
                </div>
              )}
            </Card>

            {/* Billing Address */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Billing Address</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="John Doe" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="address1">Address Line 1</Label>
                  <Input id="address1" placeholder="123 Main St" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                  <Input id="address2" placeholder="Apt 4B" className="mt-1" />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="San Francisco" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="CA" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input id="zipCode" placeholder="94105" className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" placeholder="United States" className="mt-1" />
                </div>
              </div>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">{mockOrderSummary.event}</p>
                  <p className="text-sm text-muted-foreground">{mockOrderSummary.date}</p>
                  <p className="text-sm text-muted-foreground">{mockOrderSummary.location}</p>
                </div>

                <Separator />

                {/* Tickets */}
                <div className="space-y-2">
                  {mockOrderSummary.tickets.map((ticket, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{ticket.name} x{ticket.qty}</span>
                      <span className="font-semibold">${ticket.price}</span>
                    </div>
                  ))}
                  
                  {mockOrderSummary.addons.map((addon, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{addon.name}</span>
                      <span className="font-semibold">${addon.price}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${mockOrderSummary.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee</span>
                    <span>${mockOrderSummary.fees}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${mockOrderSummary.total}</span>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCompletePayment}
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Complete Payment"}
                </Button>

                <Separator />

                {/* Security Badges */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>🔒</span>
                    <span>SSL Secured</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>🛡️</span>
                    <span>PCI Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>💰</span>
                    <span>Money-back Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>📞</span>
                    <span>24/7 Support</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
