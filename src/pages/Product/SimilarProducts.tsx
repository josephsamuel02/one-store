/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ROUTES from "../../utils/Routes";
import StoreProductCard from "../../components/StoreProductCard";

interface AppComponent {
  categoryProducts: any[];
  category?: string;
  onAddToCart?: (product: any) => void;
}

const SimilarProducts: React.FC<AppComponent> = ({
  categoryProducts,
  category,
  onAddToCart,
}) => {
  if (!Array.isArray(categoryProducts) || categoryProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-7 bg-Storepurple rounded-full" />
          <h3 className="text-lg md:text-2xl font-dayone text-gray-900">You May Also Like</h3>
        </div>
        {category && (
          <a
            href={`${ROUTES.CATEGORY}?category=${category}`}
            className="px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-xs md:text-sm font-roboto font-semibold text-Storepurple transition-colors"
          >
            More in category &rarr;
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 md:gap-5">
        {categoryProducts.slice(0, 5).map((item: any, index: number) => (
          <StoreProductCard
            key={item.id ?? index}
            product={item}
            onAddToCart={(p) => onAddToCart && onAddToCart(p)}
          />
        ))}
      </div>
    </section>
  );
};

export default SimilarProducts;
