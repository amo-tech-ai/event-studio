import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  XCircle,
  DollarSign,
  MessageCircle,
  Phone,
  Mail,
  HelpCircle,
} from "lucide-react";

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Mock order data
  const mockOrder = {
    orderId: "12345",
    orderDate: "June 10, 2024",
    status: "confirmed",
    event: {
      name: "Tech Conference 2024",
      date: "June 15, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "San Francisco Convention Center",
    },
    tickets: [
      { type: "Early Bird", quantity: 1, price: 99 },
      { type: "Regular", quantity: 2, price: 298 },
      { type: "Parking", quantity: 1, price: 15 },
    ],
    fees: 12,
    total: 424,
    payment: {
      method: "Visa",
      last4: "1234",
    },
  };

  // Mock timeline data
  const timeline = [
    {
      status: "completed",
      title: "Order Placed",
      date: "June 10, 2024",
      time: "2:30 PM",
      icon: CheckCircle2,
    },
    {
      status: "completed",
      title: "Payment Confirmed",
      date: "June 10, 2024",
      time: "2:31 PM",
      icon: CheckCircle2,
    },
    {
      status: "completed",
      title: "Tickets Issued",
      date: "June 10, 2024",
      time: "2:32 PM",
      icon: CheckCircle2,
    },
    {
      status: "pending",
      title: "Reminder Sent",
      date: "June 12, 2024",
      time: "10:00 AM",
      icon: Clock,
    },
    {
      status: "upcoming",
      title: "Event Day",
      date: "June 15, 2024",
      time: "9:00 AM",
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                Order #{mockOrder.orderId}
              </h1>
              <p className="text-muted-foreground">{mockOrder.orderDate}</p>
            </div>
            <Badge
              variant={
                mockOrder.status === "confirmed"
                  ? "default"
                  : mockOrder.status === "pending"
                  ? "secondary"
                  : "destructive"
              }
              className="text-base px-4 py-2"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {mockOrder.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Status: Payment confirmed • Tickets issued
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Order Timeline</h2>
              <div className="space-y-6">
                {timeline.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`rounded-full p-2 ${
                            item.status === "completed"
                              ? "bg-primary text-primary-foreground"
                              : item.status === "pending"
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        {index < timeline.length - 1 && (
                          <div className="w-0.5 h-16 bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.date} • {item.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Order Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {mockOrder.event.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {mockOrder.event.date} • {mockOrder.event.time}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mockOrder.event.location}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Tickets</h4>
                  <div className="space-y-2">
                    {mockOrder.tickets.map((ticket, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm"
                      >
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
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total Paid</span>
                    <span>${mockOrder.total}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Payment: {mockOrder.payment.method} ****{" "}
                    {mockOrder.payment.last4}
                  </p>
                </div>
              </div>
            </Card>

            {/* Ticket Management */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Ticket Management</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Button variant="default" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Transfer
                </Button>
                <Button variant="outline" className="w-full">
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button variant="outline" className="w-full">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Refund
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
              
              <div className="space-y-3">
                <Button variant="default" className="w-full justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Live Chat
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Us
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  (555) 123-4567
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  support@eventos.com
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  24/7 Support Available
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
