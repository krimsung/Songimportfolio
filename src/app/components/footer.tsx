import { Heart } from 'lucide-react';

export function Footer() {
  const quickLinks = [
    { href: '#/', label: 'Home' },
    { href: '#/projects', label: 'Projects' },
    { href: '#/gallery', label: 'Gallery' },
    { href: '#/contact', label: 'Contact' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Song Im
            </h3>
            <p className="text-muted-foreground mb-4">
              Game developer and artist creating immersive experiences from sci-fi to fantasy.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Connect
            </h3>
            <div className="flex gap-3">
              <p className="text-muted-foreground text-sm">
                Find me on social media
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2026 Song Im. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-destructive fill-current" /> for game development
          </p>
        </div>
      </div>
    </footer>
  );
}
