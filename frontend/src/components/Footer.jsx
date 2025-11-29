import { Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-4">
        {/* Brand / About */}
        <div>
          <img
            src="/Techkey_logo.png"
            alt="TechKey"
            className="w-25 h-auto object-contain"
          />

          <p className="text-sm leading-relaxed text-gray-400 mt-3">
            Genuine digital license keys for Windows, Office, Antivirus,
            security tools, and more. Instant delivery and trusted support.
          </p>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Phone size={16} />
              <a href="tel:+917758073523" className="text-gray-300">
                +91 77580 73523
              </a>
            </div>

            {/* <div className="flex items-center gap-2 text-gray-400">
              <Mail size={16} />
              <span className="text-gray-300">support@techkeyworld.com</span>
            </div> */}
          </div>
        </div>

        {/* Product Categories */}
        <div>
          <h3 className="text-lg font-medium text-white mb-3">Products</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Windows Keys</li>
            <li className="hover:text-white cursor-pointer">MS Office Keys</li>
            <li className="hover:text-white cursor-pointer">Antivirus Keys</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-medium text-white mb-3">Support</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Contact Support</li>
            <li className="hover:text-white cursor-pointer">
              Activation Guide
            </li>
            <li className="hover:text-white cursor-pointer">Order Help</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-medium text-white mb-3">Stay Updated</h3>
          <p className="text-sm text-gray-400 mb-3">
            Get updates on discounts, new keys, and exclusive offers.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-l-md bg-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 rounded-r-md text-sm hover:bg-blue-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 mt-8">
        <p className="text-center text-gray-500 text-sm py-4">
          &copy; {new Date().getFullYear()} TechKey World. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
