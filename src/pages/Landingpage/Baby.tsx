/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ROUTES from "../../utils/Routes";
import StoreProductCard from "../../components/StoreProductCard";

interface AppComponent {
  Products: any;
  addToCart: (data: any) => void;
}

const Baby: React.FC<AppComponent> = ({ Products, addToCart }) => {
  const filtered = Products
    ? Products.filter((i: any) => i.category === "baby").slice(0, 10)
    : [];

  if (filtered.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="flex items-center justify-between gap-3 mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-Storepurple rounded-full" />
          <h2 className="text-xl md:text-3xl text-gray-900 font-dayone">Baby</h2>
        </div>
        <a
          href={`${ROUTES.CATEGORY}?category=baby`}
          className="px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-xs md:text-sm font-roboto font-semibold text-Storepurple transition-colors"
        >
          See all &rarr;
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 md:gap-5">
        {filtered.map((product: any, index: number) => (
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

export default Baby;
