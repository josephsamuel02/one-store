/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { MdCheckCircle } from "react-icons/md";

interface AppComponent {
  singleProduct: any;
}

const ProductDetails: React.FC<AppComponent> = ({ singleProduct }) => {
  if (!singleProduct) return null;

  const features: string[] = Array.isArray(singleProduct.features)
    ? singleProduct.features.filter(Boolean)
    : typeof singleProduct.features === "string"
      ? singleProduct.features
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={features.length > 0 ? "lg:col-span-7" : "lg:col-span-12"}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-1 h-6 bg-Storepurple rounded-full" />
            <h3 className="text-lg md:text-xl font-dayone text-gray-900">Product Overview</h3>
          </div>
          <p className="text-sm md:text-base leading-relaxed text-gray-600 font-roboto whitespace-pre-line">
            {singleProduct.productDetails || "No additional description provided for this item."}
          </p>
        </div>

        {features.length > 0 && (
          <div className="lg:col-span-5 bg-gray-50/80 rounded-xl p-5 border border-gray-100">
            <h4 className="text-sm font-dayone text-gray-900 uppercase tracking-wider mb-3">
              Key Features
            </h4>
            <ul className="space-y-2.5">
              {features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm font-roboto text-gray-700">
                  <MdCheckCircle size={18} className="text-Storepurple flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
