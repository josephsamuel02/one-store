import React from "react";
import DefaultNav from "../components/DefaultNav";
import Footer from "../components/Footer";

const Page404: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 pt-16 md:pt-24 flex flex-col">
      <DefaultNav Cart={[]} />
      <div className="flex-1 max-w-lg w-full mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <img
            src="/img/undraw_page_not_found_re_e9o6.svg"
            alt="Page not found"
            className="mx-auto w-56 h-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-gray-900 font-dayone mb-2">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            The page you are looking for might have been moved or no longer exists.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 text-white text-sm font-bold bg-Storepurple hover:bg-StorepurpleDark rounded-xl shadow-sm transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page404;
