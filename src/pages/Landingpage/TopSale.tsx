/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import StoreProductCard from "../../components/StoreProductCard";

interface AppComponent {
  Products: any;
  addToCart: (data: any) => void;
}

const TopeSale: React.FC<AppComponent> = ({ Products, addToCart }) => {
  const list = Array.isArray(Products) ? Products.slice(0, 15) : [];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="flex items-center justify-between gap-3 mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-Storepurple rounded-full" />
          <div>
            <h2 className="text-xl md:text-3xl text-gray-900 font-dayone">Top Sales</h2>
            <p className="text-xs md:text-sm text-gray-500 font-roboto mt-0.5">
              Most popular picks this week
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 md:gap-5">
        {list.map((product: any, index: number) => (
          <StoreProductCard
            key={product.id ?? index}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </section>
  );
};

export default TopeSale;
