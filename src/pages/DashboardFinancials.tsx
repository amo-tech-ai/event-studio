import { MoreVertical, Download, Search } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DashboardFinancials = () => {
  const stats = [
    { label: "Balance", value: "$75,000", change: "+3.85%", icon: "💳", trend: "up" },
    { label: "Income", value: "$150,000", change: "+2.08%", icon: "📈", trend: "up" },
    { label: "Expenses", value: "$45,000", change: "-0.84%", icon: "📊", trend: "down" }
  ];

  const transactions = [
    {
      id: 1,
      date: "2029/05/01",
      time: "10:00 AM",
      event: "Sunset Park Booking",
      category: "Vendor",
      amount: -7000,
      note: "Echo Beats Festival venue payment",
      status: "Completed"
    },
    {
      id: 2,
      date: "2029/05/02",
      time: "2:00 PM",
      event: "Ticket Sales",
      category: "Event",
      amount: 15000,
      note: "Echo Beats Festival ticket sales",
      status: "Completed"
    },
    {
      id: 3,
      date: "2029/05/03",
      time: "9:30 AM",
      event: "Echo Beats Festival Promotion",
      category: "Marketing",
      amount: -8000,
      note: "Social media promotions",
      status: "Pending"
    },
    {
      id: 4,
      date: "2029/05/04",
      time: "3:00 PM",
      event: "Harmony Audio Deposit",
      category: "Sponsorship",
      amount: 10000,
      note: "-",
      status: "Completed"
    },
    {
      id: 5,
      date: "2029/05/05",
      time: "11:00 AM",
      event: "Sound & Lighting Rental",
      category: "Equipment",
      amount: -3000,
      note: "-",
      status: "Pending"
    }
  ];

  const revenueByCategory = [
    { name: "Music", percentage: 30, amount: 45000, color: "bg-pink-500" },
    { name: "Art & Design", percentage: 14, amount: 21000, color: "bg-blue-900" },
    { name: "Fashion", percentage: 20, amount: 30000, color: "bg-purple-400" },
    { name: "Health & Wellness", percentage: 10, amount: 15000, color: "bg-pink-400" },
    { name: "Sports", percentage: 16, amount: 24000, color: "bg-blue-800" },
    { name: "Technology", percentage: 10, amount: 15000, color: "bg-gray-400" }
  ];

  const expenseBreakdown = [
    { name: "Marketing", percentage: 30.77, amount: 13846.15, color: "bg-pink-500" },
    { name: "Venue", percentage: 26.92, amount: 12115.38, color: "bg-blue-900" },
    { name: "Staffing", percentage: 19.23, amount: 8653.85, color: "bg-purple-400" },
    { name: "Equipment", percentage: 11.54, amount: 5192.31, color: "bg-blue-800" },
    { name: "Miscellaneous", percentage: 7.69, amount: 3461.54, color: "bg-gray-300" },
    { name: "Utilities", percentage: 3.85, amount: 1730.77, color: "bg-gray-400" }
  ];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Financials</h1>
              <p className="text-muted-foreground">Track revenue, expenses, and financial performance</p>
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
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  <p className={`text-sm font-medium ${stat.trend === 'up' ? 'text-primary' : 'text-muted-foreground'}`}>
                    {stat.change}
                  </p>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Cashflow */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold mb-1">Cashflow</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span>Income</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                        <span>Expense</span>
                      </div>
                    </div>
                  </div>
                  <Select defaultValue="10months">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10months">Last 10 Months</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">May 2029</span>
                    <div>
                      <span className="font-medium">Income</span>
                      <span className="ml-2 text-primary">$6,815</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span></span>
                    <div>
                      <span className="font-medium">Expense</span>
                      <span className="ml-2">-$5,120</span>
                    </div>
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between gap-2">
                  {[
                    [60, 40], [65, 45], [58, 48], [70, 42], [75, 50],
                    [68, 55], [72, 52], [78, 48], [80, 45], [85, 50]
                  ].map((bars, i) => (
                    <div key={i} className="flex-1 flex flex-col gap-1">
                      <div className="bg-pink-500 rounded-t" style={{ height: `${bars[0]}%` }}></div>
                      <div className="bg-gray-200 rounded-b" style={{ height: `${bars[1]}%` }}></div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Sales Revenue */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Sales Revenue</h3>
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-8 mb-6">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(var(--muted))" strokeWidth="20" />
                      <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(var(--primary))" strokeWidth="20" 
                        strokeDasharray={`${2 * Math.PI * 70 * 0.3} ${2 * Math.PI * 70}`} />
                      <circle cx="80" cy="80" r="70" fill="none" stroke="#3b82f6" strokeWidth="20" 
                        strokeDasharray={`${2 * Math.PI * 70 * 0.14} ${2 * Math.PI * 70}`}
                        strokeDashoffset={`-${2 * Math.PI * 70 * 0.3}`} />
                      <circle cx="80" cy="80" r="70" fill="none" stroke="#a855f7" strokeWidth="20" 
                        strokeDasharray={`${2 * Math.PI * 70 * 0.2} ${2 * Math.PI * 70}`}
                        strokeDashoffset={`-${2 * Math.PI * 70 * 0.44}`} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-xs text-muted-foreground">Total All Revenue</p>
                      <p className="text-2xl font-bold">$150,000</p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    {revenueByCategory.map((cat, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{cat.name}</span>
                        <span className="font-medium">{cat.percentage}% · ${cat.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Expense Breakdown */}
            <Card className="p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Expense Breakdown</h3>
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-8">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full -rotate-90">
                    {expenseBreakdown.map((exp, i) => {
                      const prevTotal = expenseBreakdown.slice(0, i).reduce((sum, e) => sum + e.percentage, 0);
                      const circumference = 2 * Math.PI * 80;
                      return (
                        <circle
                          key={i}
                          cx="96"
                          cy="96"
                          r="80"
                          fill="none"
                          stroke={exp.color.replace('bg-', '#')}
                          strokeWidth="30"
                          strokeDasharray={`${circumference * exp.percentage / 100} ${circumference}`}
                          strokeDashoffset={`-${circumference * prevTotal / 100}`}
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xs text-muted-foreground">Total All Expenses</p>
                    <p className="text-2xl font-bold">$45,000</p>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  {expenseBreakdown.map((exp, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${exp.color}`}></div>
                        <span className="text-sm">{exp.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{exp.percentage.toFixed(2)}%</p>
                        <p className="text-xs text-muted-foreground">${exp.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Recent Transactions */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Recent Transactions</h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search event, category, etc" 
                      className="pl-10 w-[250px]"
                    />
                  </div>
                  <Select defaultValue="month">
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="text-sm">
                          <div>{transaction.date}</div>
                          <div className="text-muted-foreground">{transaction.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{transaction.event}</div>
                          <div className="text-muted-foreground">{transaction.category}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${transaction.amount > 0 ? 'text-primary' : ''}`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{transaction.note}</TableCell>
                      <TableCell>
                        <Badge className={transaction.status === 'Completed' ? 'bg-primary/10 text-primary' : 'bg-muted'}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">8</span> out of <span className="font-medium">312</span>
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button size="sm" className="bg-primary">1</Button>
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

export default DashboardFinancials;
