import { Mail, ArrowRight } from "lucide-react";

interface ContactPreviewProps {
  onNavigateToContact: () => void;
}

export function ContactPreview({ onNavigateToContact }: ContactPreviewProps) {
  return (
    <section className="h-screen flex items-center bg-background-alt">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-lg p-8 md:p-12 border border-border transition duration-100 hover:border-accent-primary hover:bg-accent-primary/5 hover:shadow-lg hover:shadow-accent-primary/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-accent-primary/10 rounded-lg">
              <Mail className="w-8 h-8 text-accent-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Let's Work Together
            </h2>
          </div>

          <p className="text-lg text-muted-foreground mb-8">
            I'm currently available for freelance work and full-time opportunities.
            Whether you're an indie studio or AAA company, I'd love to hear about your project
            and discuss how I can contribute to bringing your vision to life.
          </p>

          <a
            href="#/contact"
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) {
                return;
              }
              event.preventDefault();
              onNavigateToContact();
            }}
            className="btn-primary group"
          >
            <span>Get In Touch</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>
      </div>
    </section>
  );
}
