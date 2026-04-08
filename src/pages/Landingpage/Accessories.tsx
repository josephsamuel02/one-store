/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ROUTES from "../../utils/Routes";
import { MdShoppingCart } from "react-icons/md";

interface AppComponent {
  Products: any;
  addToCart: (data: any) => void;
}

const Accessories: React.FC<AppComponent> = ({ Products, addToCart }) => {
  const priceFormat = new Intl.NumberFormat("en-US");
  const User = localStorage.getItem("one_store_login");

  const filtered = Products
    ? Products.filter((i: any) => i.category === "accessories").slice(0, 10)
    : [];

  if (filtered.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-1 h-8 bg-Storepurple rounded-full" />
        <h2 className="text-2xl md:text-3xl text-gray-900 font-dayone">Accessories</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
        {filtered.map((i: any, index: number) => (
          <div
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-1"
            key={index}
          >
            <a
              className="flex flex-col h-full"
              href={`${ROUTES.PRODUCT}/${i.id}`}
            >
              <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
                <img
                  src={i.image}
                  alt={i.name}
                  className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex flex-col flex-1 p-3">
                <p className="text-xs md:text-sm text-gray-700 font-roboto line-clamp-2 leading-snug mb-2">
                  {i.name}
                </p>

                <div className="mt-auto">
                  <p className="text-sm md:text-base font-dayone text-gray-900">
                    ₦{priceFormat.format(i.price)}
                  </p>
                  {i.old_price != 0 && i.old_price != i.price && (
                    <p className="text-xs text-gray-400 line-through font-roboto">
                      ₦{priceFormat.format(i.old_price)}
                    </p>
                  )}
                </div>

                {User && (
                  <button
                    className="mt-2.5 w-full py-2 flex items-center justify-center gap-1.5 bg-Storepurple hover:bg-purple-800 text-white text-xs md:text-sm font-roboto font-medium rounded-lg transition-colors"
                    onClick={(e: any) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart({ ...i, inStock: 1 });
                    }}
                  >
                    <MdShoppingCart size={16} />
                    <span>Add to cart</span>
                  </button>
                )}
              </div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Accessories;
