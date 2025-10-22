import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Users,
  DollarSign,
  Star,
  TrendingUp,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function OrganizerDetail() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <Link to="/dashboard/organizers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Organizers
        </Link>

        {/* 1. Header Section - Organizer Profile */}
        <Card className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <Avatar className="w-24 h-24 ring-4 ring-primary/10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-3xl font-semibold">
                SJ
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Sarah Johnson</h1>
              <p className="text-lg text-muted-foreground mb-1">Event Marketing Specialist</p>
              <p className="text-sm text-muted-foreground mb-4">TechEvents Inc. • 8 years experience</p>
              
              <div className="flex flex-wrap gap-3">
                <Button size="sm" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>sarah.johnson@techevents.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 2-5. KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Events"
            value="24"
            change="+4 this month"
            trend="up"
            icon={Calendar}
            gradient="from-blue-500 to-blue-600"
          />
          <KPICard
            title="Total Attendees"
            value="1,250"
            change="+15% vs last month"
            trend="up"
            icon={Users}
            gradient="from-green-500 to-green-600"
          />
          <KPICard
            title="Revenue Generated"
            value="$125,400"
            change="+22% vs last month"
            trend="up"
            icon={DollarSign}
            gradient="from-purple-500 to-purple-600"
          />
          <KPICard
            title="Average Rating"
            value="4.8"
            change="+0.2 this month"
            trend="up"
            icon={Star}
            gradient="from-yellow-500 to-yellow-600"
          />
        </div>

        {/* 6. Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Attendance Overview</h3>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="80" fill="none" stroke="hsl(var(--muted))" strokeWidth="16" />
                  <circle cx="96" cy="96" r="80" fill="none" stroke="hsl(var(--primary))" strokeWidth="16" strokeDasharray="502" strokeDashoffset="125" className="transition-all" />
                  <circle cx="96" cy="96" r="80" fill="none" stroke="#10b981" strokeWidth="16" strokeDasharray="502" strokeDashoffset="377" className="transition-all" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold">89%</div>
                    <div className="text-xs text-muted-foreground">Attendance</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-3 h-3 rounded-full bg-primary mx-auto mb-2" />
                <div className="text-sm font-semibold">1,112</div>
                <div className="text-xs text-muted-foreground">Attended</div>
              </div>
              <div>
                <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-2" />
                <div className="text-sm font-semibold">88</div>
                <div className="text-xs text-muted-foreground">No-Shows</div>
              </div>
              <div>
                <div className="w-3 h-3 rounded-full bg-muted mx-auto mb-2" />
                <div className="text-sm font-semibold">50</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </div>
          </Card>

          {/* Revenue Trend */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Revenue Trend</h3>
              <Button variant="ghost" size="sm">6 Months</Button>
            </div>
            <div className="h-48 flex items-end justify-between gap-2">
              {[42, 55, 48, 68, 62, 78].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${height}%` }} />
                  <span className="text-xs text-muted-foreground">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-semibold">+22%</span>
              </div>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </Card>
        </div>

        {/* 7. Top Events by Performance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Top Performing Events</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Tech Conference 2024", date: "Apr 20, 2024", attendees: 450, satisfaction: 96, image: "🎯" },
              { title: "Startup Pitch Night", date: "Mar 15, 2024", attendees: 280, satisfaction: 92, image: "🚀" },
              { title: "Corporate Workshop", date: "Feb 10, 2024", attendees: 180, satisfaction: 88, image: "💼" },
            ].map((event, i) => (
              <Card key={i} className="p-4 hover:shadow-lg transition-all cursor-pointer">
                <div className="text-4xl mb-3 bg-gradient-to-br from-primary/10 to-secondary/10 w-16 h-16 rounded-lg flex items-center justify-center">
                  {event.image}
                </div>
                <h4 className="font-semibold mb-2 line-clamp-1">{event.title}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{event.attendees}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    {event.satisfaction}% satisfaction
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* 8 & 9. Calendar and Upcoming Event Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Organizer Calendar */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Event Calendar</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium">March 2025</span>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => {
                const day = i - 2;
                const hasEvent = [5, 12, 14, 20, 27].includes(day);
                return (
                  <button
                    key={i}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center text-sm transition-all
                      ${day < 1 || day > 31 ? 'text-muted-foreground/30' : 'hover:bg-accent'}
                      ${hasEvent ? 'bg-primary text-primary-foreground font-semibold' : ''}
                      ${day === 14 ? 'ring-2 ring-primary ring-offset-2' : ''}
                    `}
                  >
                    {day > 0 && day <= 31 ? day : ''}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary" />
                <span>Event Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded ring-2 ring-primary" />
                <span>Today</span>
              </div>
            </div>
          </Card>

          {/* Upcoming Event Widget */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Next Event</h3>
            <div className="relative h-40 rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-purple-500 to-pink-500">
              <div className="absolute inset-0 flex items-center justify-center text-6xl">
                🎪
              </div>
            </div>
            <h4 className="font-semibold mb-2">Design Summit 2025</h4>
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>March 20, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>2:00 PM - 6:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>SF Convention Center</span>
              </div>
            </div>
            <Button className="w-full">View Details</Button>
          </Card>
        </div>

        {/* 10 & 11. Recent Bookings and Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings Table */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 font-semibold">Booking ID</th>
                    <th className="text-left py-3 font-semibold">Event</th>
                    <th className="text-left py-3 font-semibold">Date</th>
                    <th className="text-right py-3 font-semibold">Amount</th>
                    <th className="text-right py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'BK-10234', event: 'Tech Conference', date: 'Apr 20', amount: '$2,400', status: 'confirmed' },
                    { id: 'BK-10235', event: 'Startup Pitch', date: 'Mar 15', amount: '$1,800', status: 'confirmed' },
                    { id: 'BK-10236', event: 'Workshop Series', date: 'May 5', amount: '$3,200', status: 'pending' },
                    { id: 'BK-10237', event: 'Networking Event', date: 'Feb 28', amount: '$950', status: 'cancelled' },
                  ].map((booking, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                      <td className="py-3 font-mono text-xs">{booking.id}</td>
                      <td className="py-3">{booking.event}</td>
                      <td className="py-3 text-muted-foreground">{booking.date}</td>
                      <td className="py-3 text-right font-semibold">{booking.amount}</td>
                      <td className="py-3 text-right">
                        <Badge
                          className={
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-700 hover:bg-green-100'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                              : 'bg-red-100 text-red-700 hover:bg-red-100'
                          }
                        >
                          {booking.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Recent Activity Feed */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { icon: Calendar, text: 'Created new event "Design Summit"', time: '2 hours ago', color: 'bg-blue-100 text-blue-600' },
                { icon: Users, text: 'Updated ticket prices for Tech Conf', time: '5 hours ago', color: 'bg-purple-100 text-purple-600' },
                { icon: DollarSign, text: 'Payment received $2,400', time: '1 day ago', color: 'bg-green-100 text-green-600' },
                { icon: Mail, text: 'Sent invitation to 250 contacts', time: '2 days ago', color: 'bg-yellow-100 text-yellow-600' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${activity.color} flex items-center justify-center flex-shrink-0`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-1 line-clamp-2">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 12. Feedback & Ratings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Organizer Reviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Michael Chen', rating: 5, comment: 'Exceptional event management! Sarah handled everything perfectly from start to finish.', event: 'Tech Conference 2024' },
              { name: 'Emma Rodriguez', rating: 5, comment: 'Professional, responsive, and delivered beyond expectations. Highly recommended!', event: 'Startup Pitch Night' },
              { name: 'James Wilson', rating: 4, comment: 'Great experience overall. Very organized and attentive to details.', event: 'Corporate Workshop' },
            ].map((review, i) => (
              <Card key={i} className="p-4 bg-muted/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {review.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{review.name}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-3">{review.comment}</p>
                <p className="text-xs text-muted-foreground">Event: {review.event}</p>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  gradient: string;
}

function KPICard({ title, value, change, trend, icon: Icon, gradient }: KPICardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
        <Badge variant={trend === "up" ? "default" : "destructive"} className="text-xs">
          <TrendingUp className="w-3 h-3 mr-1" />
          {change}
        </Badge>
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground">{title}</p>
    </Card>
  );
}
