import { Mail, Linkedin, Github, Twitter, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1C1A1F] border-t border-[#26242A]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Song Im</h3>
            <p className="text-[#C9C6C0] mb-4">
              Game developer and artist creating immersive experiences from sci-fi to fantasy.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#/" className="text-[#C9C6C0] hover:text-[#D47A2B] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#/projects" className="text-[#C9C6C0] hover:text-[#D47A2B] transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="#/gallery" className="text-[#C9C6C0] hover:text-[#D47A2B] transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#/contact" className="text-[#C9C6C0] hover:text-[#D47A2B] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Connect</h3>
            <div className="flex gap-3">
              <a
                href="mailto:song.im@example.com"
                className="p-2 bg-[#26242A] hover:bg-[#D47A2B] text-[#C9C6C0] hover:text-white rounded-lg transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#26242A] hover:bg-[#D47A2B] text-[#C9C6C0] hover:text-white rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#26242A] hover:bg-[#D47A2B] text-[#C9C6C0] hover:text-white rounded-lg transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#26242A] hover:bg-[#D47A2B] text-[#C9C6C0] hover:text-white rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#26242A] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#C9C6C0] text-sm">
            © 2026 Song Im. All rights reserved.
          </p>
          <p className="text-[#C9C6C0] text-sm flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-[#FF0000] fill-current" /> for game development
          </p>
        </div>
      </div>
    </footer>
  );
}
