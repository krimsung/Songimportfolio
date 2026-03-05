import { Mail, ArrowRight } from "lucide-react";

interface ContactPreviewProps {
  onNavigateToContact: () => void;
}

export function ContactPreview({ onNavigateToContact }: ContactPreviewProps) {
  return (
    /*
      section: h-full fills the carousel panel.
      flex flex-col justify-center vertically centers the card.
      Contact is a simple single card — it always fits within one viewport height.
    */
    <section className="w-full h-full flex flex-col justify-center">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-lg p-5 sm:p-6 md:p-8 border border-border transition duration-100 hover:border-accent-amber hover:shadow-lg hover:shadow-accent-amber/50">

          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="p-2 md:p-3 bg-accent-amber/10 rounded-lg flex-shrink-0">
              <Mail className="w-6 h-6 md:w-8 md:h-8 text-accent-amber" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Let's Work Together
            </h2>
          </div>

          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
            I'm currently available for freelance work and full-time opportunities.
            Whether you're an indie studio or AAA company, I'd love to hear about your project
            and discuss how I can contribute to bringing your vision to life.
          </p>

          <div className="flex justify-end">
            <a
              href="#/contact"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
                e.preventDefault();
                onNavigateToContact();
              }}
              className="btn-primary group"
            >
              <span>Get In Touch</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
