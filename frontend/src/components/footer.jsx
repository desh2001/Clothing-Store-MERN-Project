import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ShoppingBag
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-300 mt-20 overflow-hidden">


      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_70%)] pointer-events-none"></div>


      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">


          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <ShoppingBag size={30} className="text-blue-500 animate-pulse" />
              <h3 className="text-2xl font-bold text-white tracking-wide">
                Clothing<span className="text-blue-500">Store</span>
              </h3>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">
              Trendsetting fashion, quality apparel, and style solutions.
              Elevating your wardrobe with elegance and comfort.
            </p>


            <div className="flex gap-4 pt-3">
              {[
                { icon: Facebook, color: "hover:bg-blue-600" },
                { icon: Twitter, color: "hover:bg-sky-500" },
                { icon: Instagram, color: "hover:bg-pink-600" },
                { icon: Linkedin, color: "hover:bg-blue-700" },
              ].map(({ icon: Icon, color }, i) => (
                <a
                  key={i}
                  href="#"
                  className={`p-2 rounded-full bg-gray-800 ${color}
                  transition-all duration-300 hover:scale-125 hover:-translate-y-1`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>


          <div>
            <h4 className="text-lg font-semibold text-white mb-6 relative inline-block after:absolute after:left-0 after:-bottom-1 after:w-10 after:h-0.5 after:bg-blue-500">
              Navigation
            </h4>

            <ul className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "Orders", path: "/orders" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.path}
                    className="group inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition"
                  >
                    <span className="w-0 h-0.5 bg-blue-500 group-hover:w-4 transition-all duration-300"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>


          <div>
            <h4 className="text-lg font-semibold text-white mb-6 relative inline-block after:absolute after:left-0 after:-bottom-1 after:w-10 after:h-0.5 after:bg-blue-500">
              Contact
            </h4>

            <ul className="space-y-4 text-sm">
              <li className="flex gap-3 hover:text-blue-400 transition">
                <MapPin size={18} className="text-blue-500" />
                Colombo 07, Sri Lanka
              </li>

              <li className="flex gap-3 hover:text-blue-400 transition">
                <Phone size={18} className="text-blue-500" />
                +94 11 234 5678
              </li>

              <li className="flex gap-3 hover:text-blue-400 transition">
                info@clothingstore.com
              </li>
            </ul>

            <div className="mt-6 text-xs text-gray-400">
              <p className="font-semibold text-gray-300 mb-1">Business Hours</p>
              Mon–Fri: 9.00 AM – 6.00 PM<br />
              Sat: 10.00 AM – 4.00 PM
            </div>
          </div>
        </div>
      </div>


      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Clothing Store. All rights reserved.
          </p>

          <div className="flex gap-5 text-xs">
            {["Privacy Policy", "Terms", "Cookies"].map((item, i) => (
              <a
                key={i}
                href="#"
                className="hover:text-blue-400 transition"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
