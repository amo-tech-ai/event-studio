import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-serif text-xl font-semibold">EventOS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/how-it-works" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link to="/features" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/events" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Events
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="/contact" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" className="text-sm font-medium">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-primary text-white hover:bg-primary/90 shadow-sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link to="/how-it-works" className="text-sm font-medium">How It Works</Link>
              <Link to="/features" className="text-sm font-medium">Features</Link>
              <Link to="/events" className="text-sm font-medium">Events</Link>
              <Link to="/pricing" className="text-sm font-medium">Pricing</Link>
              <Link to="/contact" className="text-sm font-medium">Contact</Link>
              <div className="flex flex-col gap-2 pt-4">
                <Link to="/auth">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button className="w-full bg-primary text-white">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
