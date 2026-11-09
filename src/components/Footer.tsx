import React from "react";
import ROUTES from "../utils/Routes";
import { MdCall, MdEmail, MdLocationOn, MdWhatsapp } from "react-icons/md";

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-16 bg-gray-950 text-gray-400 border-t border-gray-800/80">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <a href={ROUTES.LANDINGPAGE} className="inline-block">
              <img
                src="/img/OneStore logo.svg"
                alt="OneStore"
                className="w-32 h-auto brightness-0 invert"
              />
            </a>
            <p className="text-sm text-gray-400 font-roboto leading-relaxed">
              Your trusted one-stop online shopping mall for quality electronics, household
              essentials, groceries, fashion, and everyday needs at unbeatable prices.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={ROUTES.WHATSAPP}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-gray-800/80 hover:bg-green-600 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <MdWhatsapp size={18} />
              </a>
              <a
                href={ROUTES.CALLLINE}
                aria-label="Call Us"
                className="w-9 h-9 rounded-full bg-gray-800/80 hover:bg-Storepurple text-gray-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <MdCall size={18} />
              </a>
              <a
                href="mailto:info@onestore.com.ng"
                aria-label="Email Us"
                className="w-9 h-9 rounded-full bg-gray-800/80 hover:bg-Storepurple text-gray-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <MdEmail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-roboto font-bold text-white uppercase tracking-widest">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2.5">
              <a
                href={ROUTES.LANDINGPAGE}
                className="text-sm text-gray-400 font-roboto hover:text-purple-400 transition-colors"
              >
                Home
              </a>
              <a
                href={ROUTES.ABOUTUS}
                className="text-sm text-gray-400 font-roboto hover:text-purple-400 transition-colors"
              >
                About Us
              </a>
              <a
                href={ROUTES.SERVICES}
                className="text-sm text-gray-400 font-roboto hover:text-purple-400 transition-colors"
              >
                Our Services
              </a>
              <a
                href={ROUTES.CART}
                className="text-sm text-gray-400 font-roboto hover:text-purple-400 transition-colors"
              >
                Shopping Cart
              </a>
              <a
                href={ROUTES.ORDERS}
                className="text-sm text-gray-400 font-roboto hover:text-purple-400 transition-colors"
              >
                Track Orders
              </a>
              <a
                href={ROUTES.ADMIN_LOGIN}
                className="text-sm text-gray-500 font-roboto hover:text-purple-400 transition-colors"
              >
                Admin Portal
              </a>
            </nav>
          </div>

          {/* Popular Categories */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-roboto font-bold text-white uppercase tracking-widest">
              Top Categories
            </h4>
            <nav className="flex flex-col gap-2.5">
              <a
                href={`${ROUTES.CATEGORY}?category=electronics`}
                className="text-sm text-gray-400 font-roboto hover:text-purple-400 transition-colors"
              >
                Electronics
              </a>
              <a
                href={`${ROUTES.CATEGORY}?category=household`}
                className="text-sm text-gray-400 font-roboto hover:text-purple-400 transition-colors"
              >
                Household
              </a>
              <a
                href={`${ROUTES.CATEGORY}?category=groceries`}
                className="text-sm text-gray-400 font-roboto hover:text-purple-400 transition-colors"
              >
                Groceries & Food
              </a>
              <a
                href={`${ROUTES.CATEGORY}?category=phones`}
                className="text-sm text-gray-400 font-roboto hover:text-purple-400 transition-colors"
              >
                Phones & Tablets
              </a>
              <a
                href={`${ROUTES.CATEGORY}?category=accessories`}
                className="text-sm text-gray-400 font-roboto hover:text-purple-400 transition-colors"
              >
                Accessories
              </a>
              <a
                href={`${ROUTES.CATEGORY}?category=fashion`}
                className="text-sm text-gray-400 font-roboto hover:text-purple-400 transition-colors"
              >
                Fashion & Body Care
              </a>
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-roboto font-bold text-white uppercase tracking-widest">
              Contact Us
            </h4>
            <div className="flex flex-col gap-3 text-sm text-gray-400 font-roboto">
              <div className="flex items-start gap-2.5">
                <MdLocationOn size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
                <span>Lagos, Nigeria</span>
              </div>
              <a
                href={ROUTES.CALLLINE}
                className="flex items-center gap-2.5 hover:text-purple-400 transition-colors"
              >
                <MdCall size={18} className="text-purple-400 flex-shrink-0" />
                <span>+234 808 137 6616</span>
              </a>
              <a
                href="mailto:info@onestore.com.ng"
                className="flex items-center gap-2.5 hover:text-purple-400 transition-colors"
              >
                <MdEmail size={18} className="text-purple-400 flex-shrink-0" />
                <span>info@onestore.com.ng</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800/80 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs sm:text-sm text-gray-500 font-roboto">
            &copy; {new Date().getFullYear()} OneStore. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 font-roboto">
            Quality Guaranteed &bull; Fast Nationwide Delivery
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
