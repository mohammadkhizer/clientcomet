import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE_NAME, NAV_LINKS, CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">{SITE_NAME}</h3>
            <p className="mb-4">
              Delivering premium IT solutions and services with innovation and excellence.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors duration-200"
                  aria-label={`Visit our social media`}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="hover:text-foreground transition-colors duration-200"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>{CONTACT_INFO.address}</li>
              <li>
                <a 
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="hover:text-foreground transition-colors duration-200"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a 
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="hover:text-foreground transition-colors duration-200"
                >
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li>{CONTACT_INFO.hours}</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="mb-3">Stay updated with our latest news and offers.</p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 bg-bg-fields rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {currentYear} {SITE_NAME}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}