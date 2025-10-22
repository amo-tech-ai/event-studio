import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  RefreshCw,
  CreditCard,
  Phone,
  Mail,
  MessageCircle,
  Search,
  Save,
  Bell,
  ArrowLeft,
} from "lucide-react";

const RegistrationError = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorType = searchParams.get("type") || "payment";
  const errorCode = searchParams.get("code") || "PAY-001";

  // Error messages based on type
  const errorMessages = {
    payment: {
      title: "Payment Processing Failed",
      description: "We couldn't process your payment right now",
      reasons: [
        "Payment processing failed",
        "Your card may have been declined",
        "Network connection issue",
        "No charges were made",
      ],
    },
    soldout: {
      title: "Event Sold Out",
      description: "This event has reached maximum capacity",
      reasons: [
        "All tickets have been sold",
        "Event reached capacity",
        "Limited tickets were available",
        "Try checking back for cancellations",
      ],
    },
    expired: {
      title: "Registration Expired",
      description: "Your registration session has expired",
      reasons: [
        "Session timed out",
        "Registration took too long",
        "Tickets were not reserved",
        "Please start over",
      ],
    },
  };

  const currentError = errorMessages[errorType as keyof typeof errorMessages] || errorMessages.payment;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Error Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Oops!</h1>
            <h2 className="text-xl font-semibold mb-2">{currentError.title}</h2>
            <p className="text-muted-foreground mb-4">
              {currentError.description}
            </p>
            <Badge variant="secondary" className="font-mono">
              Error Code: {errorCode}
            </Badge>
          </div>

          {/* What Happened */}
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">What Happened?</h3>
            <ul className="space-y-2">
              {currentError.reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span className="text-muted-foreground">{reason}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Action Buttons */}
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">What Can You Do?</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <Button
                variant="default"
                className="w-full"
                onClick={() => navigate(-1)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/payment")}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Different Payment
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open("mailto:support@eventos.com")}
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </Card>

          {/* Quick Solutions */}
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Quick Solutions</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox id="solution1" />
                <Label
                  htmlFor="solution1"
                  className="text-sm cursor-pointer leading-relaxed"
                >
                  Check card details and ensure billing information is correct
                </Label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox id="solution2" />
                <Label
                  htmlFor="solution2"
                  className="text-sm cursor-pointer leading-relaxed"
                >
                  Try a different card or payment method
                </Label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox id="solution3" />
                <Label
                  htmlFor="solution3"
                  className="text-sm cursor-pointer leading-relaxed"
                >
                  Use PayPal or Apple Pay as alternative payment
                </Label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox id="solution4" />
                <Label
                  htmlFor="solution4"
                  className="text-sm cursor-pointer leading-relaxed"
                >
                  Contact your bank to ensure card is authorized for online purchases
                </Label>
              </div>
            </div>
          </Card>

          {/* Need Help */}
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open("#chat", "_blank")}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Live Chat
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open("tel:5551234567")}
              >
                <Phone className="h-4 w-4 mr-2" />
                (555) 123-4567
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open("mailto:support@eventos.com")}
              >
                <Mail className="h-4 w-4 mr-2" />
                support@eventos.com
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/faq")}
              >
                <Search className="h-4 w-4 mr-2" />
                FAQ
              </Button>
            </div>

            <div className="mt-4 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
              <p className="mb-2">
                💬 <strong>Live Chat Available</strong>
              </p>
              <p className="mb-2">
                📞 <strong>Phone:</strong> 24/7 Support Available
              </p>
              <p>
                📧 <strong>Email:</strong> Response within 2 hours
              </p>
            </div>
          </Card>

          {/* Alternative Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Or Try Something Else</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/events")}
              >
                <Search className="h-4 w-4 mr-2" />
                Browse Events
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  alert("Event saved for later!");
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                Save for Later
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  alert("You'll receive updates!");
                }}
              >
                <Bell className="h-4 w-4 mr-2" />
                Get Updates
              </Button>
            </div>
          </Card>

          {/* Support Info */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Having trouble? We're here to help 24/7. Reference error code{" "}
              <span className="font-mono font-semibold">{errorCode}</span> when
              contacting support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationError;
