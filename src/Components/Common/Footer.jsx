import React from "react";
import { Link } from "react-router-dom";
import { FaBusAlt, FaFacebookF, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { SiStripe, SiVisa, SiMastercard } from "react-icons/si";

const Footer = () => {
  const year = new Date().getFullYear();

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/all-tickets", label: "All Tickets" },
    { to: "/contact", label: "Contact Us" },
    { to: "/about", label: "About" },
  ];

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      {/* Top */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <FaBusAlt className="h-6 w-6 text-primary" aria-hidden="true" />
              <span className="text-lg font-semibold tracking-tight">
                TicketBari
              </span>
            </Link>

            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Book bus, train, launch & flight tickets easily from one secure
              platform.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Quick Links
            </h3>

            <ul className="mt-4 space-y-2 text-sm">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Contact Info
            </h3>

            <address className="mt-4 not-italic">
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <FaEnvelope
                    className="h-4 w-4 text-primary/90"
                    aria-hidden="true"
                  />
                  <a
                    href="mailto:support@ticketbari.com"
                    className="break-all transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm"
                  >
                    support@ticketbari.com
                  </a>
                </li>

                <li className="flex items-center gap-2">
                  <FaPhoneAlt
                    className="h-4 w-4 text-primary/90"
                    aria-hidden="true"
                  />
                  <a
                    href="tel:+8801234567890"
                    className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm"
                  >
                    +880 1234-567-890
                  </a>
                </li>

                <li className="flex items-center gap-2">
                  <FaFacebookF
                    className="h-4 w-4 text-primary/90"
                    aria-hidden="true"
                  />
                  <a
                    href="https://facebook.com/ticketbari"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm"
                  >
                    Facebook Page
                  </a>
                </li>
              </ul>
            </address>
          </div>

          {/* Payments */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Payment Methods
            </h3>

            <p className="mt-4 text-sm text-muted-foreground">
              Secure payments powered by trusted providers.
            </p>

            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-muted-foreground">
                <SiStripe
                  aria-label="Stripe"
                  title="Stripe"
                  className="text-2xl"
                />
              </span>

              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-muted-foreground">
                <SiVisa aria-label="Visa" title="Visa" className="text-2xl" />
              </span>

              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-muted-foreground">
                <SiMastercard
                  aria-label="Mastercard"
                  title="Mastercard"
                  className="text-2xl"
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © {year} TicketBari. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
