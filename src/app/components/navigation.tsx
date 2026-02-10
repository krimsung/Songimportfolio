import { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1C1A1F] border-b border-[#26242A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Status */}
          <div className="flex items-center gap-4">
            <a
              href="#/"
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) {
                  return;
                }
                event.preventDefault();
                onNavigate("home");
              }}
              className="text-white hover:text-[#D47A2B] transition-colors"
            >
              <span className="text-xl font-semibold">Song Im</span>
            </a>
            <span className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F7A5E]/20 border border-[#2F7A5E]/40">
              <span className="w-2 h-2 rounded-full bg-[#2F7A5E] animate-pulse"></span>
              <span className="text-sm text-[#C9C6C0]">Available for work</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.id === "home" ? "#/" : `#/${item.id}`}
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) {
                    return;
                  }
                  event.preventDefault();
                  onNavigate(item.id);
                }}
                className={`transition-colors ${
                  currentPage === item.id
                    ? "text-[#D47A2B]"
                    : "text-[#C9C6C0] hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1C1A1F] border-t border-[#26242A]">
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#2F7A5E]/20 border border-[#2F7A5E]/40 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#2F7A5E] animate-pulse"></span>
              <span className="text-sm text-[#C9C6C0]">Available for work</span>
            </div>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.id === "home" ? "#/" : `#/${item.id}`}
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) {
                    return;
                  }
                  event.preventDefault();
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                  currentPage === item.id
                    ? "text-[#D47A2B] bg-[#D47A2B]/10"
                    : "text-[#C9C6C0] hover:text-white hover:bg-[#26242A]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
