/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ROUTES from "../../utils/Routes";
import { MdShoppingCart } from "react-icons/md";
import StoreProductCard from "../../components/StoreProductCard";

interface AppComponent {
  category: string;
  categoryProducts: any[];
  addToCart: (item: any) => void;
  loading?: boolean;
}

const Products: React.FC<AppComponent> = ({
  category,
  categoryProducts,
  addToCart,
  loading = false,
}) => {
  const count = Array.isArray(categoryProducts) ? categoryProducts.length : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 min-h-[60vh]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-Storepurple rounded-full" />
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-900 font-dayone capitalize">
              {category || "Category"}
            </h1>
            {!loading && (
              <p className="text-xs md:text-sm text-gray-500 font-roboto mt-0.5">
                {count} product{count === 1 ? "" : "s"} available
              </p>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-Storepurple rounded-full animate-spin" />
        </div>
      )}

      {!loading && count === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-Storepurple flex items-center justify-center mb-4">
            <MdShoppingCart size={32} />
          </div>
          <p className="text-lg md:text-xl font-dayone text-gray-800 mb-1">
            No products in {category || "this category"} yet
          </p>
          <p className="text-xs md:text-sm font-roboto text-gray-500 mb-6 max-w-sm">
            We are restocking this section soon. Check back shortly or explore our other categories.
          </p>
          <a
            href={ROUTES.LANDINGPAGE}
            className="px-6 py-2.5 bg-Storepurple text-white text-sm font-roboto font-medium rounded-full hover:bg-StorepurpleDark transition-colors shadow-sm"
          >
            Back to Home
          </a>
        </div>
      )}

      {!loading && count > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 md:gap-5">
          {categoryProducts.map((product: any, index: number) => (
            <StoreProductCard
              key={product.id ?? index}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
