import React from "react";
import ROUTES from "../utils/Routes";

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-24">
          <div className="flex flex-col gap-4">
            <img
              src="/img/OneStore logo.svg"
              alt="OneStore"
              className="w-32 h-auto brightness-0 invert"
            />
            <p className="max-w-xs text-sm text-gray-400 font-roboto leading-relaxed">
              Your one-stop online store for quality products at great prices. We provide unmatched services and business solutions.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-roboto font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-3">
              <a
                href={ROUTES.LANDINGPAGE}
                className="text-sm text-gray-400 font-roboto hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href={ROUTES.ABOUTUS}
                className="text-sm text-gray-400 font-roboto hover:text-white transition-colors"
              >
                About Us
              </a>
              <a
                href={ROUTES.SERVICES}
                className="text-sm text-gray-400 font-roboto hover:text-white transition-colors"
              >
                Services
              </a>
              <a
                href={ROUTES.ADMIN_LOGIN}
                className="text-sm text-gray-400 font-roboto hover:text-white transition-colors"
              >
                Admin Area
              </a>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-roboto font-bold text-white uppercase tracking-wider">
              Contact Us
            </h4>
            <div className="flex flex-col gap-3 text-sm text-gray-400 font-roboto">
              <p>
                <strong className="text-gray-300 font-semibold">Address:</strong> Lagos, Nigeria
              </p>
              <p>
                <strong className="text-gray-300 font-semibold">Phone:</strong> +234 808 137 6616
              </p>
              <p>
                <strong className="text-gray-300 font-semibold">Email:</strong> info@onestore.com.ng
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-gray-500 font-roboto">
            &copy; {new Date().getFullYear()} OneStore. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 font-roboto">Built with care in Nigeria</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
