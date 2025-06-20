import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { 
      Icon: Facebook, 
      url: "https://facebook.com/jerseytown",
      label: "Facebook"
    },
    { 
      Icon: Twitter, 
      url: "https://twitter.com/jerseytown",
      label: "Twitter"
    },
    { 
      Icon: Instagram, 
      url: "https://instagram.com/kitsznstore",
      label: "Instagram"
    }
  ];

  return (
    <footer className="mt-20 border-t border-white/10">
      <div className="glass-card border-0 rounded-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg" />
                <span className="text-xl font-bold font-['Space_Grotesk'] text-gradient">
                  Jersey Town
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Premium jerseys for champions who refuse to settle for ordinary.
              </p>
              <div className="flex space-x-3">
                {socialLinks.map(({ Icon, url, label }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 glass rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-300"
                    aria-label={`Follow us on ${label}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { to: "/", label: "Home" },
                  { to: "/shop", label: "Shop" },
                  { to: "/about", label: "About" },
                  { to: "/contact", label: "Contact" }
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="block text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Customer Service */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Support</h3>
              <div className="space-y-2">
                {["Size Guide", "Returns", "Shipping", "Custom Orders"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact</h3>
              <div className="space-y-3">
                {[
                  { icon: Mail, text: "kitsznstore@gmail.com" },
                  { icon: Phone, text: "1234567890" },
                  { icon: MapPin, text: "Bihar" }
                ].map((contact, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <contact.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">{contact.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Jersey Town. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
