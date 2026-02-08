import { Mail, ArrowRight } from "lucide-react";

export function ContactPreview() {
  return (
    <section className="py-20 px-4 bg-[#F3F2F0]">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1C1A1F] rounded-lg p-8 md:p-12 border border-[#26242A] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D47A2B]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2F6DAA]/5 rounded-full blur-3xl"></div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#D47A2B]/10 rounded-lg">
                <Mail className="w-8 h-8 text-[#D47A2B]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Let's Work Together
              </h2>
            </div>
            
            <p className="text-lg text-[#C9C6C0] mb-8 max-w-2xl">
              I'm currently available for freelance work and full-time opportunities. 
              Whether you're an indie studio or AAA company, I'd love to hear about your project 
              and discuss how I can contribute to bringing your vision to life.
            </p>
            
            <a
              href="#/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#D47A2B] text-white rounded-lg hover:bg-[#C07A2C] transition-all group"
            >
              <span className="text-lg">Get In Touch</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
