import { Heart, Mail, LinkedinIcon, XIcon } from 'lucide-react';

const quickLinks = [
  { href: '#/', label: 'Home' },
  { href: '#/projects', label: 'Projects' },
  { href: '#/gallery', label: 'Gallery' },
  { href: '#/contact', label: 'Contact' },
] as const;

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Song Im
            </h3>
            <p className="text-muted-foreground mb-4">
              Game developer and artist creating immersive experiences from sci-fi to fantasy.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:flex md:flex-col md:items-center">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-accent-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Connect
            </h3>
            <div className="flex gap-3">
              <a
                href="mailto:contact@songim.dev"
                title="Email"
                className="text-muted-foreground hover:text-accent-cyan transition-colors group"
              >
                <div className="icon-wrapper-cyan">
                  <Mail className="w-5 h-5 text-accent-cyan" />
                </div>
              </a>
              <a
                href="https://www.linkedin.com/in/song-im/"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="text-muted-foreground hover:text-accent-cyan transition-colors group"
              >
                <div className="icon-wrapper-cyan">
                  <LinkedinIcon className="w-5 h-5 text-accent-cyan" />
                </div>
              </a>
              <a
                href="https://x.com/digitalghoste"
                target="_blank"
                rel="noopener noreferrer"
                title="X (Twitter)"
                className="text-muted-foreground hover:text-accent-cyan transition-colors group"
              >
                <div className="icon-wrapper-cyan">
                  <XIcon className="w-5 h-5 text-accent-cyan" />
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Song Im. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-destructive fill-current" /> for game development
          </p>
        </div>
      </div>
    </footer>
  );
}
