import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-navy text-navy-foreground py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent">
                <Shield className="w-5 h-5 text-navy-foreground" />
              </div>
              <span className="text-xl font-bold">SafeLaylar</span>
            </div>
            <p className="text-navy-foreground/70 max-w-md">
              Protecting women and girls from digital threats with intelligent browser security.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-navy-foreground/70 hover:text-secondary transition-colors">Features</a></li>
              <li><a href="#" className="text-navy-foreground/70 hover:text-secondary transition-colors">How It Works</a></li>
              <li><Link to="/install" className="text-navy-foreground/70 hover:text-secondary transition-colors">Downloads</Link></li>
              <li><Link to="/dashboard" className="text-navy-foreground/70 hover:text-secondary transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-navy-foreground/70 hover:text-secondary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-navy-foreground/70 hover:text-secondary transition-colors">Safety Tips</a></li>
              <li><a href="#" className="text-navy-foreground/70 hover:text-secondary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-navy-foreground/70 hover:text-secondary transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-navy-foreground/20">
          <p className="text-center text-navy-foreground/60 text-sm">
            © 2025 SafeLaylar. All rights reserved. Built to protect, designed to empower.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
