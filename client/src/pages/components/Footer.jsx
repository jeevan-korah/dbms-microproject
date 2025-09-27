import React from "react";
import { Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react";

const quickLinks = [
  { name: "Destinations", href: "/search" },
  { name: "Dashboard", href: "/profile/user" },
  { name: "About", href: "/about" },
  { name: "Admin Panel", href: "/profile/admin" },
];

const Footer = () => {
  return (
    <footer className="bg-[#002b11] text-white text-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-3">TravelHub</h3>
            <p className="text-gray-300 leading-relaxed">
              Discover amazing destinations and create unforgettable memories.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Connect</h4>
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+91 9946655199</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>jeevanbijukorah@gmail.com</span>
              </div>
            </div>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-4 flex flex-col md:flex-row items-center justify-between text-gray-400">
          <span>© 2025 TravelHub. All rights reserved.</span>
          <div className="flex space-x-6 mt-3 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
