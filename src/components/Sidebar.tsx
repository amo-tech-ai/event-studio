import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  BarChart3, 
  CalendarDays, 
  Settings,
  Users,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
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
    { title: "Settings", icon: Settings, path: "/dashboard/settings" }
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="font-serif text-xl font-semibold">EventOS</span>
        </Link>
        <p className="text-xs text-foreground/60 mt-1">Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3 px-4">
            Main
          </p>
          {menuItems.slice(0, 7).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "sidebar-nav",
                location.pathname === item.path && "active"
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
              className={cn(
                "sidebar-nav",
                location.pathname === item.path && "active"
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
          className={cn(
            "sidebar-nav",
            location.pathname === "/dashboard/settings" && "active"
          )}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
