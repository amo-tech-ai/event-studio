import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer-dark py-12 md:py-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-serif text-xl font-semibold">EventOS</span>
            </div>
            <p className="text-sm text-white/60 mb-6">
              Plan, launch, and grow events — fast.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-white/60 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/events" className="text-sm text-white/60 hover:text-white transition-colors">Browse Events</Link></li>
              <li><Link to="/contact" className="text-sm text-white/60 hover:text-white transition-colors">Book a Demo</Link></li>
              <li><Link to="/dashboard" className="text-sm text-white/60 hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Case Studies</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Terms of Use</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="font-semibold mb-4 text-sm">We work with agencies across 50+ marketing specialties</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Digital Marketing</li>
              <li>Creative + Brand</li>
              <li>Organic + Paid Social</li>
              <li>Web + Development</li>
              <li>PR + Influencer</li>
              <li>Experiential + Events</li>
              <li>Ecomm + Amazon</li>
              <li>SMS + Email</li>
              <li>AI + Emerging Tech</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60">© 2025 EventOS. All rights reserved.</p>
          <p className="text-sm text-white/60">
            Visit us at <span className="text-white">🇺🇸 New York City</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
