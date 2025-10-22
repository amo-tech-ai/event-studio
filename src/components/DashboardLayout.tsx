import { ReactNode, useState } from "react";
import { Menu, X, Bell, Settings, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  BarChart3, 
  CalendarDays, 
  Users,
  Building2,
  Settings as SettingsIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Events", icon: Calendar, path: "/dashboard/events" },
    { title: "Bookings", icon: Users, path: "/dashboard/bookings" },
    { title: "Financials", icon: BarChart3, path: "/dashboard/financials" },
    { title: "Gallery", icon: Calendar, path: "/dashboard/gallery" },
    { title: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
    { title: "Calendar", icon: CalendarDays, path: "/dashboard/calendar" },
    { title: "Organizers", icon: Users, path: "/dashboard/organizers" },
    { title: "Venues", icon: Building2, path: "/dashboard/venues" },
    { title: "Settings", icon: SettingsIcon, path: "/dashboard/settings" }
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border flex flex-col z-50 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo & Close Button */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-serif text-xl font-semibold">EventOS</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={closeSidebar}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3 px-4">
              Main
            </p>
            {menuItems.slice(0, 7).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px]",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            ))}

            <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3 mt-6 px-4">
              CRM
            </p>
            {menuItems.slice(7, 9).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px]",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Settings at bottom */}
        <div className="p-4 border-t border-border">
          <Link
            to="/dashboard/settings"
            onClick={closeSidebar}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px]",
              location.pathname === "/dashboard/settings"
                ? "bg-primary text-primary-foreground"
                : "text-foreground/70 hover:bg-accent hover:text-foreground"
            )}
          >
            <SettingsIcon className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-background border-b border-border px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Hamburger Menu (Mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden min-h-[44px] min-w-[44px]"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search anything" 
                  className="pl-10 bg-muted/50 border-0"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              <button className="w-10 h-10 lg:w-10 lg:h-10 rounded-full bg-accent/50 flex items-center justify-center hover:bg-accent transition-colors">
                <Bell className="w-5 h-5 text-foreground" />
              </button>
              <button className="w-10 h-10 lg:w-10 lg:h-10 rounded-full bg-accent/50 flex items-center justify-center hover:bg-accent transition-colors">
                <Settings className="w-5 h-5 text-foreground" />
              </button>
              <div className="hidden lg:flex items-center gap-3 ml-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground">OL</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-semibold">Orlando Laurentius</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
