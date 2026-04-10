import React from "react";
import ROUTES from "../utils/Routes";

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="flex flex-col gap-3">
            <img
              src="/img/OneStore logo.svg"
              alt="OneStore"
              className="w-32 h-auto brightness-0 invert"
            />
            <p className="max-w-xs text-sm text-gray-400 font-roboto leading-relaxed">
              Your one-stop online store for quality products at great prices.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-roboto font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
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
                href={ROUTES.ADMIN_LOGIN}
                className="text-sm text-gray-400 font-roboto hover:text-white transition-colors"
              >
                Admin
              </a>
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-roboto font-bold text-white uppercase tracking-wider">
              Categories
            </h4>
            <nav className="flex flex-col gap-2">
              <a
                href={`${ROUTES.CATEGORY}?category=electronics`}
                className="text-sm text-gray-400 font-roboto hover:text-white transition-colors"
              >
                Electronics
              </a>
              <a
                href={`${ROUTES.CATEGORY}?category=computers`}
                className="text-sm text-gray-400 font-roboto hover:text-white transition-colors"
              >
                Computing
              </a>
              <a
                href={`${ROUTES.CATEGORY}?category=accessories`}
                className="text-sm text-gray-400 font-roboto hover:text-white transition-colors"
              >
                Accessories
              </a>
              <a
                href={`${ROUTES.CATEGORY}?category=phone`}
                className="text-sm text-gray-400 font-roboto hover:text-white transition-colors"
              >
                Phones & Tablets
              </a>
            </nav>
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
