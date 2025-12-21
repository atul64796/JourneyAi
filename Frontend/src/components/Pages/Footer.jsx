import { Brain, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-gray-200 ">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Brain className="text-sky-400" />
            <h2 className="text-xl font-semibold">Journey AI</h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
          Journey AI helps transform ideas into meaningful stories, combining intelligent guidance with creative freedom to support every step of your storytelling journey and bring imagination to life.
          </p>
        </div>

        {/* Product */}
        <div>
          <h3 className="font-medium mb-4">Product</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white">Features</a></li>
            <li><a href="#" className="hover:text-white">Use Cases</a></li>
            <li><a href="#" className="hover:text-white">Pricing</a></li>
            <li><a href="#" className="hover:text-white">Integrations</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-medium mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-medium mb-4">Get in Touch</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <Mail size={16} /> hello@journeyai.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +1 (555) 987-6543
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Remote · Global
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 gap-2">
          <span>© {new Date().getFullYear()} Journey AI. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">LinkedIn</a>
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
