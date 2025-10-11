import { MoreVertical, Search, Filter, Download } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DashboardBookings = () => {
  const stats = [
    { label: "Total Bookings", value: "55,000", icon: "📊" },
    { label: "Total Tickets Sold", value: "45,000", icon: "🎫" },
    { label: "Total Earnings", value: "$275,450", icon: "💰" }
  ];

  const bookings = [
    {
      id: "INV10011",
      date: "2029/02/15",
      time: "10:30 AM",
      name: "Jackson Moore",
      event: "Symphony Under the Stars",
      category: "Music",
      ticketType: "Diamond",
      price: "$50",
      qty: 2,
      amount: "$100",
      status: "Confirmed",
      voucher: "123456-MUSIC"
    },
    {
      id: "INV10012",
      date: "2029/02/16",
      time: "03:45 PM",
      name: "Alicia Smithson",
      event: "Runway Revolution 2024",
      category: "Fashion",
      ticketType: "Platinum",
      price: "$120",
      qty: 1,
      amount: "$120",
      status: "Pending",
      voucher: "-"
    },
    {
      id: "INV10013",
      date: "2029/02/17",
      time: "01:15 PM",
      name: "Natalie Johnson",
      event: "Global Wellness Summit",
      category: "Beauty & Wellness",
      ticketType: "CAT 1",
      price: "$80",
      qty: 3,
      amount: "$240",
      status: "Confirmed",
      voucher: "789101-WELLNESS"
    },
    {
      id: "INV10014",
      date: "2029/02/18",
      time: "09:00 AM",
      name: "Patrick Cooper",
      event: "Champions League Screening Night",
      category: "Sport",
      ticketType: "CAT 3",
      price: "$30",
      qty: 4,
      amount: "$120",
      status: "Cancelled",
      voucher: "-"
    },
    {
      id: "INV10015",
      date: "2029/02/18",
      time: "05:30 PM",
      name: "Gilda Ramos",
      event: "Artistry Unveiled: Modern Art Expo",
      category: "Art & Design",
      ticketType: "Silver",
      price: "$25",
      qty: 2,
      amount: "$50",
      status: "Confirmed",
      voucher: "202324-ART"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      "Confirmed": "bg-primary/10 text-primary hover:bg-primary/20",
      "Pending": "bg-accent/30 text-accent-foreground hover:bg-accent/40",
      "Cancelled": "bg-muted text-muted-foreground hover:bg-muted/80"
    };
    return variants[status] || "";
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Bookings</h1>
              <p className="text-muted-foreground">Track all ticket sales and attendee information</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, i) => (
                <Card key={i} className="p-6 hover-lift transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                      {stat.icon}
                    </div>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold mb-1">Bookings Overview</h3>
                    <p className="text-sm text-muted-foreground">This Week</p>
                  </div>
                  <Select defaultValue="week">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground">Chart: Bookings trend line</p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold mb-1">Bookings Category</h3>
                    <p className="text-sm text-muted-foreground">This Week</p>
                  </div>
                  <Select defaultValue="week">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground">Chart: Category donut</p>
                </div>
              </Card>
            </div>

            {/* Filters */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <Button variant="default" size="sm" className="rounded-full">
                  All
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  Confirmed
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  Pending
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  Cancelled
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search name, event, etc" 
                    className="pl-10"
                  />
                </div>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Category</SelectItem>
                    <SelectItem value="music">Music</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="wellness">Wellness</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="month">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="This Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>

              {/* Table */}
              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Ticket Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>E-Voucher</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{booking.date}</div>
                            <div className="text-muted-foreground">{booking.time}</div>
                          </div>
                        </TableCell>
                        <TableCell>{booking.name}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{booking.event}</div>
                            <div className="text-muted-foreground">{booking.category}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{booking.ticketType}</Badge>
                        </TableCell>
                        <TableCell>{booking.price}</TableCell>
                        <TableCell>{booking.qty}</TableCell>
                        <TableCell className="font-semibold">{booking.amount}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(booking.status)}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{booking.voucher}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">5</span> out of <span className="font-medium">312</span>
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button size="sm" className="bg-primary text-primary-foreground">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">...</Button>
                  <Button variant="outline" size="sm">16</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardBookings;
