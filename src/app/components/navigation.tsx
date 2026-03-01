import { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

/** Returns true when a click has a modifier key held — allow default browser behavior. */
function isModifiedClick(e: React.MouseEvent): boolean {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1;
}

const navItems = [
  { id: "home",     label: "Home",     activeClass: "text-accent-primary",  activeBg: "bg-accent-primary/10",  hoverClass: "hover:text-accent-primary"  },
  { id: "projects", label: "Projects", activeClass: "text-accent-lime",     activeBg: "bg-accent-lime/10",     hoverClass: "hover:text-accent-lime"     },
  { id: "gallery",  label: "Gallery",  activeClass: "text-accent-amber",    activeBg: "bg-accent-amber/10",    hoverClass: "hover:text-accent-amber"    },
  { id: "contact",  label: "Contact",  activeClass: "text-accent-primary",  activeBg: "bg-accent-primary/10",  hoverClass: "hover:text-accent-primary"  },
] as const;

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setMobileMenuOpen(false);
  }, []);

  // Close mobile menu on outside click
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest("nav")) setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [mobileMenuOpen, handleKeyDown, handleOutsideClick]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Status */}
          <div className="flex items-center gap-4">
            <a
              href="#/"
              onClick={(e) => {
                if (isModifiedClick(e)) return;
                e.preventDefault();
                onNavigate("home");
              }}
              className="text-foreground hover:text-accent transition-colors"
            >
              <span className="text-xl font-semibold">Song Im</span>
            </a>
            <span className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--status-success)]/10 border border-[var(--status-success)]/30">
              <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
              <span className="text-sm text-[var(--status-success)] font-medium">Available for work</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.id === "home" ? "#/" : `#/${item.id}`}
                onClick={(e) => {
                  if (isModifiedClick(e)) return;
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                className={`transition-colors font-medium ${
                  currentPage === item.id
                    ? item.activeClass
                    : `text-muted-foreground ${item.hoverClass}`
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-card border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--status-success)]/10 border border-[var(--status-success)]/30 mb-4">
              <span className="w-2 h-2 rounded-full bg-[var(--status-success)] animate-pulse shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
              <span className="text-sm text-[var(--status-success)] font-medium">Available for work</span>
            </div>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.id === "home" ? "#/" : `#/${item.id}`}
                onClick={(e) => {
                  if (isModifiedClick(e)) return;
                  e.preventDefault();
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded transition-colors font-medium ${
                  currentPage === item.id
                    ? `${item.activeClass} ${item.activeBg}`
                    : `text-muted-foreground ${item.hoverClass} hover:bg-border`
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
