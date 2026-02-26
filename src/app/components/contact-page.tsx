import { ArrowLeft, Mail, LinkedinIcon, GithubIcon, XIcon, Send, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    // Use Vite env var if available; fallback shows placeholder string.
    const WEB3FORMS_API_KEY = import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_WEB3FORMS_KEY_GOES_HERE";

    try {
      const payload = {
        access_key: WEB3FORMS_API_KEY,
        subject: "New message from portfolio contact form",
        name: formData.name,
        email: formData.email,
        company: formData.company,
        message: formData.message,
      } as Record<string, string>;

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (res.ok && json && (json.success === true || json.success === "true")) {
        toast.success("Message sent!", {
          description: "Thanks for reaching out — I'll get back to you within 24–48 hours.",
          duration: 5000,
        });
        setFormData({ name: "", email: "", company: "", message: "" });
      } else {
        console.error("Web3Forms error", json);
        toast.error("Failed to send message. Please try again or email contact@songim.dev.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while sending the message.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <a
          href="#/"
          className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-primary/80 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Home</span>
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="flex flex-col">
              <div className="bg-card rounded-lg p-8 border border-border mb-6 transition duration-100 hover:border-accent-primary hover:bg-accent-primary/5 hover:shadow-lg hover:shadow-accent-primary/50">
              <h2 className="text-2xl font-bold text-foreground mb-4">Connect With Me</h2>
              <p className="text-muted-foreground mb-6">
                I'm currently available for freelance projects and full-time opportunities. 
                Whether you're looking for a character artist, environment designer, or 
                technical artist, I'd love to hear from you.
              </p>
              <div className="space-y-4">
                <a
                  href="mailto:contact@songim.dev"
                  className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors group"
                >
                  <div className="icon-wrapper">
                    <Mail className="w-5 h-5 text-accent-primary" />
                  </div>
                  <span>contact@songim.dev</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/song-im/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-accent-cyan transition-colors group"
                >
                  <div className="icon-wrapper-cyan">
                    <LinkedinIcon className="w-5 h-5 text-accent-cyan" />
                  </div>
                  <span>linkedin.com/in/song-im</span>
                </a>
                <a
                  href="https://github.com/songim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-accent-violet transition-colors group"
                >
                  <div className="icon-wrapper-violet">
                    <GithubIcon className="w-5 h-5 text-accent-violet" />
                  </div>
                  <span>github.com/songim</span>
                </a>
                <a
                  href="https://twitter.com/songim_dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-accent-lime transition-colors group"
                >
                  <div className="icon-wrapper-lime">
                    <XIcon className="w-5 h-5 text-accent-lime" />
                  </div>
                  <span>@songim_dev</span>
                </a>
              </div>
            </div>

            <div className="bg-card rounded-lg p-8 border border-border flex-1 flex flex-col transition duration-100 hover:border-accent-primary hover:bg-accent-primary/5 hover:shadow-lg hover:shadow-accent-primary/50">
              <h2 className="text-2xl font-bold text-foreground mb-4">Availability</h2>
              <p className="text-muted-foreground mb-6">
                I'm currently accepting new projects and full-time positions. Expected response time: 24-48 hours.
              </p>
              <div>
                <a
                   href="/cv.pdf"
                  download
                  className="btn-primary w-full justify-center group"
                >
                  <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-200" />
                  <span>Download CV</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-card rounded-lg p-8 border border-border transition duration-100 hover:border-accent-primary hover:bg-accent-primary/5 hover:shadow-lg hover:shadow-accent-primary/50">
              <h2 className="text-2xl font-bold text-foreground mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-muted-foreground mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-muted-foreground mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-muted-foreground mb-2">
                    Company / Studio
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none transition-colors"
                    placeholder="Your company or studio name"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-muted-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-input-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full justify-center group"
                >
                  <span>Send Message</span>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
