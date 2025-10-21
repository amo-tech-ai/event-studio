import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data
const mockEvent = {
  name: "AI & ML Summit 2025",
  date: "June 15, 2025",
  location: "San Francisco Convention Center",
  deadline: "3 days, 14 hours",
};

const mockTicketTiers = [
  {
    id: "t1",
    name: "Early Bird",
    price: 99,
    description: "Limited time special offer",
    benefits: ["All sessions access", "Networking events", "Lunch included", "Digital materials"],
    badge: "Best Value",
    badgeColor: "bg-green-500",
    available: 45,
  },
  {
    id: "t2",
    name: "Regular",
    price: 149,
    description: "Standard admission ticket",
    benefits: ["All sessions access", "Networking events", "Lunch included", "Digital materials", "Exclusive swag bag"],
    badge: "Most Popular",
    badgeColor: "bg-blue-500",
    available: 120,
  },
  {
    id: "t3",
    name: "VIP",
    price: 299,
    description: "Premium conference experience",
    benefits: ["All sessions access", "Premium seating", "VIP lounge access", "Meet & greet with speakers", "Exclusive dinner", "Premium swag pack"],
    badge: null,
    badgeColor: "",
    available: 20,
  },
];

const mockAddOns = [
  { id: "a1", name: "Parking Pass", price: 15, icon: "🚗", description: "All-day parking access" },
  { id: "a2", name: "Meal Plan", price: 25, icon: "🍽️", description: "Breakfast + Lunch + Coffee" },
  { id: "a3", name: "Swag Bag", price: 20, icon: "🎒", description: "Exclusive merchandise bundle" },
];

const TicketSelection = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({
    t1: 0,
    t2: 0,
    t3: 0,
  });
  
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, boolean>>({
    a1: false,
    a2: false,
    a3: false,
  });

  const updateQuantity = (ticketId: string, change: number) => {
    setTicketQuantities(prev => ({
      ...prev,
      [ticketId]: Math.max(0, (prev[ticketId] || 0) + change)
    }));
  };

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => ({
      ...prev,
      [addOnId]: !prev[addOnId]
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    
    // Calculate ticket total
    mockTicketTiers.forEach(tier => {
      total += tier.price * (ticketQuantities[tier.id] || 0);
    });
    
    // Calculate add-ons total
    mockAddOns.forEach(addOn => {
      if (selectedAddOns[addOn.id]) {
        total += addOn.price;
      }
    });
    
    const fees = total > 0 ? 12 : 0;
    return { subtotal: total, fees, total: total + fees };
  };

  const { subtotal, fees, total } = calculateTotal();
  const hasSelectedTickets = Object.values(ticketQuantities).some(qty => qty > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link
              to={`/event/${slug}/register`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>

            {/* Progress Steps - Compact */}
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <span className="text-sm font-medium">Tickets</span>
              </div>
              <div className="w-12 h-1 bg-muted" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm">
                  2
                </div>
                <span className="text-sm text-muted-foreground">Payment</span>
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
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{mockEvent.name}</h1>
              <p className="text-muted-foreground">{mockEvent.date} • {mockEvent.location}</p>
              <div className="mt-2 inline-flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                <span className="text-lg">⏰</span>
                <span>Registration ends in: {mockEvent.deadline}</span>
              </div>
            </div>

            {/* Ticket Tiers */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Select Your Tickets</h2>
              
              <div className="grid md:grid-cols-1 gap-4">
                {mockTicketTiers.map(tier => (
                  <Card key={tier.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{tier.name}</h3>
                          {tier.badge && (
                            <Badge className={`${tier.badgeColor} text-white`}>
                              {tier.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{tier.description}</p>
                        <ul className="space-y-1">
                          {tier.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <Check className="h-4 w-4 text-green-600" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-sm text-muted-foreground mt-3">
                          {tier.available} tickets available
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="text-3xl font-bold">${tier.price}</div>
                        
                        <div className="flex items-center gap-3 bg-muted rounded-lg p-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateQuantity(tier.id, -1)}
                            disabled={ticketQuantities[tier.id] === 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-semibold w-8 text-center">
                            {ticketQuantities[tier.id]}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateQuantity(tier.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Optional Add-ons</h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                {mockAddOns.map(addOn => (
                  <Card key={addOn.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedAddOns[addOn.id]}
                        onCheckedChange={() => toggleAddOn(addOn.id)}
                      />
                      <div className="flex-1">
                        <div className="text-2xl mb-2">{addOn.icon}</div>
                        <h3 className="font-semibold">{addOn.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{addOn.description}</p>
                        <p className="font-bold">${addOn.price}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">{mockEvent.name}</p>
                  <p className="text-sm text-muted-foreground">{mockEvent.date}</p>
                  <p className="text-sm text-muted-foreground">{mockEvent.location}</p>
                </div>

                <Separator />

                {/* Selected Tickets */}
                <div className="space-y-2">
                  {mockTicketTiers.map(tier => {
                    const qty = ticketQuantities[tier.id];
                    if (qty === 0) return null;
                    return (
                      <div key={tier.id} className="flex justify-between text-sm">
                        <span>{tier.name} x{qty}</span>
                        <span className="font-semibold">${tier.price * qty}</span>
                      </div>
                    );
                  })}
                  
                  {mockAddOns.map(addOn => {
                    if (!selectedAddOns[addOn.id]) return null;
                    return (
                      <div key={addOn.id} className="flex justify-between text-sm">
                        <span>{addOn.name}</span>
                        <span className="font-semibold">${addOn.price}</span>
                      </div>
                    );
                  })}
                </div>

                {hasSelectedTickets && (
                  <>
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Processing Fee</span>
                        <span>${fees}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${total}</span>
                    </div>

                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => navigate(`/event/${slug}/payment`)}
                    >
                      Continue to Payment
                    </Button>
                  </>
                )}

                {!hasSelectedTickets && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Select tickets to continue
                  </p>
                )}

                <Separator />

                {/* Trust Badges */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>🔒</span>
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>💰</span>
                    <span>Money-back Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>📱</span>
                    <span>Mobile Tickets</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSelection;
