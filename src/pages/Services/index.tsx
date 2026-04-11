import React, { useEffect } from "react";
import DefaultNav from "../../components/DefaultNav";
import Footer from "../../components/Footer";
import { FiBriefcase, FiCreditCard, FiPhoneCall, FiMail } from "react-icons/fi";
import { MdInventory, MdLocalShipping, MdStorefront, MdRestaurant } from "react-icons/md";
import ROUTES from "../../utils/Routes";

const servicesDetails = [
  {
    title: "Procurement Services",
    description:
      "End-to-end procurement solutions guaranteeing quality and competitive pricing. We help source the best products globally so you can focus on your core business.",
    icon: <FiBriefcase className="w-8 h-8 text-blue-600" />,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
  },
  {
    title: "Inventory Management",
    description:
      "State-of-the-art inventory tracking and warehousing solutions to minimize waste, prevent stockouts, and keep your supply chain running smoothly.",
    icon: <MdInventory className="w-8 h-8 text-green-600" />,
    bgColor: "bg-green-50",
    borderColor: "border-green-100",
  },
  {
    title: "Logistics Services",
    description:
      "Fast, secure, and reliable delivery network. From warehouse to doorstep, our logistics infrastructure ensures safe transit for all goods.",
    icon: <MdLocalShipping className="w-8 h-8 text-orange-600" />,
    bgColor: "bg-orange-50",
    borderColor: "border-orange-100",
  },
  {
    title: "Supermarket Consultant",
    description:
      "Expert consulting for supermarket layout, inventory strategy, point-of-sale optimization, and maximizing retail floor profitability.",
    icon: <MdStorefront className="w-8 h-8 text-purple-600" />,
    bgColor: "bg-purple-50",
    borderColor: "border-purple-100",
  },
  {
    title: "Restaurant Consultant",
    description:
      "Specialized consultation for restaurants covering menu engineering, kitchen equipment sourcing, staffing workflows, and customer experience.",
    icon: <MdRestaurant className="w-8 h-8 text-red-600" />,
    bgColor: "bg-red-50",
    borderColor: "border-red-100",
  },
  {
    title: "Apply for Moniepoint Loan",
    description:
      "Access capital fast. We assist business owners in processing application documentation for low-interest Moniepoint business loans.",
    icon: <FiCreditCard className="w-8 h-8 text-teal-600" />,
    bgColor: "bg-teal-50",
    borderColor: "border-teal-100",
  },
];

const Services: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col font-roboto">
      <DefaultNav />
      {/* Hero Section */}
      <div className="w-full pt-20 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-gray-900 via-StorepurpleDark to-gray-900 text-white relative flex items-center justify-center overflow-hidden">
        {/* Decorative background vectors */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gridPattern)" />
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center z-10 relative mt-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-dayone mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-white">
            Our Premium Services
          </h1>
          <p className="text-base md:text-lg text-purple-100 leading-relaxed font-light max-w-2xl mx-auto">
            Beyond e-commerce, OneStore provides unparalleled business infrastructure. Our specialized consulting and operational services empower your business to thrive in a competitive market.
          </p>
        </div>
      </div>

      {/* Services Grid Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex-grow">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-dayone mb-4">
            How Can We Help You Grow?
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto font-roboto">
            Discover a suite of tailored services designed by industry experts to streamline your operations and scale your revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesDetails.map((service, idx) => (
            <div
              key={idx}
              className={`group bg-white rounded-2xl p-8 border ${service.borderColor} shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-start`}
            >
              <div className={`w-16 h-16 rounded-xl ${service.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-roboto mb-3 group-hover:text-Storepurple transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Contact CTA Section */}
        <div className="w-full mt-20 p-8 md:p-12 bg-Storepurple/5 border border-purple-100 rounded-3xl text-center flex flex-col items-center">
          <h3 className="text-2xl md:text-3xl font-dayone text-gray-900 mb-4">
            Ready to get started?
          </h3>
          <p className="text-gray-600 max-w-lg mb-8 font-roboto">
            Contact us today to discuss your business needs. Our team of specialists is ready to provide the right solution for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href={ROUTES.CALLLINE}
              className="flex items-center justify-center gap-3 bg-Storepurple text-white px-8 py-4 rounded-xl font-semibold hover:bg-StorepurpleDark transition-colors shadow-sm"
            >
              <FiPhoneCall className="w-5 h-5" />
              <span>Call +234 808 137 6616</span>
            </a>
            
            <a
              href={`mailto:info@onestore.com.ng`}
              className="flex items-center justify-center gap-3 bg-white text-gray-800 border-2 border-gray-100 px-8 py-4 rounded-xl font-semibold hover:border-Storepurple/30 hover:bg-purple-50 transition-colors shadow-sm"
            >
              <FiMail className="w-5 h-5 text-Storepurple" />
              <span>Email Us</span>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Services;
