import React from "react";
import { FaBusAlt, FaFacebookF, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { SiStripe, SiVisa, SiMastercard } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 border-t">
      {/* Top section */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: Logo + Description */}
          <div>
            <div className="flex items-center mt-1 mb-3">
              <FaBusAlt className="mr-2 h-7 w-7 text-indigo-500" />
              <span className="text-xl font-bold text-white">TicketBari</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Book bus, train, launch & flight tickets easily from one secure platform.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:ml-17">
            <h3 className="text-black text-sm font-semibold uppercase tracking-wide mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-indigo-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/tickets" className="hover:text-indigo-400 transition-colors">
                  All Tickets
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-indigo-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-indigo-400 transition-colors">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-black text-sm font-semibold uppercase tracking-wide mb-4">
              Contact Info
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <FaEnvelope className="mr-2 h-4 w-4 text-indigo-400" />
                <a
                  href="mailto:support@ticketbari.com"
                  className="hover:text-indigo-400 transition-colors break-all"
                >
                  support@ticketbari.com
                </a>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="mr-2 h-4 w-4 text-indigo-400" />
                <a
                  href="tel:+8801234567890"
                  className="hover:text-indigo-400 transition-colors"
                >
                  +880 1234-567-890
                </a>
              </li>
              <li className="flex items-center">
                <FaFacebookF className="mr-2 h-4 w-4 text-indigo-400" />
                <a
                  href="https://facebook.com/ticketbari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Facebook Page
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment Methods */}
          <div>
            <h3 className="text-black text-sm font-semibold uppercase tracking-wide mb-4">
              Payment Methods
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Secure payments powered by trusted providers.
            </p>
            <div className="flex items-center space-x-4 text-3xl *:border *:rounded-full">
              <SiStripe className="text-indigo-400" title="Stripe" />
              <SiVisa className="text-blue-400" title="Visa" />
              <SiMastercard className="text-orange-400" title="Mastercard" />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm sm:text-base">
            © 2025 TicketBari. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;