import { ArrowLeft, Mail, LinkedinIcon, GithubIcon, XIcon, Send, Download } from "lucide-react";
import { useState } from "react";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data
    alert("Thank you for your message! I'll get back to you soon.");
    setFormData({ name: "", email: "", company: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#F3F2F0] pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <a
          href="#/"
          className="inline-flex items-center gap-2 text-[#D47A2B] hover:text-[#C07A2C] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="flex flex-col">
            <div className="bg-[#1C1A1F] rounded-lg p-8 border border-[#26242A] mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Connect With Me</h2>
              <p className="text-[#C9C6C0] mb-6">
                I'm currently available for freelance projects and full-time opportunities. 
                Whether you're looking for a character artist, environment designer, or 
                technical artist, I'd love to hear from you.
              </p>
              <div className="space-y-4">
                <a
                  href="mailto:contact@songim.dev"
                  className="flex items-center gap-3 text-[#C9C6C0] hover:text-[#D47A2B] transition-colors group"
                >
                  <div className="p-2 bg-[#D47A2B]/10 rounded-lg group-hover:bg-[#D47A2B]/20 transition-colors">
                    <Mail className="w-5 h-5 text-[#D47A2B]" />
                  </div>
                  <span>contact@songim.dev</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/song-im/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#C9C6C0] hover:text-[#D47A2B] transition-colors group"
                >
                  <div className="p-2 bg-[#D47A2B]/10 rounded-lg group-hover:bg-[#D47A2B]/20 transition-colors">
                     <LinkedinIcon className="w-5 h-5 text-[#D47A2B]" />
                  </div>
                  <span>linkedin.com/in/song-im</span>
                </a>
                <a
                  href="https://github.com/songim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#C9C6C0] hover:text-[#D47A2B] transition-colors group"
                >
                  <div className="p-2 bg-[#D47A2B]/10 rounded-lg group-hover:bg-[#D47A2B]/20 transition-colors">
                     <GithubIcon className="w-5 h-5 text-[#D47A2B]" />
                  </div>
                  <span>github.com/songim</span>
                </a>
                <a
                  href="https://twitter.com/songim_dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#C9C6C0] hover:text-[#D47A2B] transition-colors group"
                >
                  <div className="p-2 bg-[#D47A2B]/10 rounded-lg group-hover:bg-[#D47A2B]/20 transition-colors">
                     <XIcon className="w-5 h-5 text-[#D47A2B]" />
                  </div>
                  <span>@songim_dev</span>
                </a>
              </div>
            </div>

            <div className="bg-[#1C1A1F] rounded-lg p-8 border border-[#26242A] flex-1 flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-4">Availability</h2>
              <div className="flex-1">
                <p className="text-[#C9C6C0] text-lg">
                  I'm currently accepting <span className="text-[#D47A2B] font-semibold">new projects</span> and <span className="text-[#D47A2B] font-semibold">full-time positions</span>.
                </p>
                <p className="text-white font-semibold mt-2">
                  Expected response time: 24-48 hours.
                </p>
              </div>
              <div className="mt-auto">
                <a
                  href="/cv.pdf"
                  download
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#D47A2B] text-white rounded-lg hover:bg-[#C07A2C] transition-colors group"
                >
                  <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                  <span>Download CV</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-[#1C1A1F] rounded-lg p-8 border border-[#26242A]">
              <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-[#C9C6C0] mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#26242A] border border-[#26242A] rounded-lg text-white focus:border-[#D47A2B] focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[#C9C6C0] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#26242A] border border-[#26242A] rounded-lg text-white focus:border-[#D47A2B] focus:outline-none transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-[#C9C6C0] mb-2">
                    Company / Studio
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#26242A] border border-[#26242A] rounded-lg text-white focus:border-[#D47A2B] focus:outline-none transition-colors"
                    placeholder="Your company or studio name"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[#C9C6C0] mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-[#26242A] border border-[#26242A] rounded-lg text-white focus:border-[#D47A2B] focus:outline-none transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#D47A2B] text-white rounded-lg hover:bg-[#C07A2C] transition-colors group"
                >
                  <span>Send Message</span>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
