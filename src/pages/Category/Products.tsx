/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ROUTES from "../../utils/Routes";
import { MdShoppingCart } from "react-icons/md";

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
  const User = localStorage.getItem("one_store_login");
  const priceFormat = new Intl.NumberFormat("en-US");

  return (
    <div className="w-full min-h-[50vh] md:p-1 bg-white">
      <h1 className="p-4 text-xl md:text-2xl text-gray-800 font-dayone capitalize">{category}</h1>

      {loading && (
        <div className="flex items-center justify-center py-20 bg-purple-100">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-Storepurple rounded-full animate-spin" />
        </div>
      )}

      {!loading && (!categoryProducts || categoryProducts.length === 0) && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-purple-50/50">
          <MdShoppingCart size={56} className="text-gray-300 mb-3" />
          <p className="text-base md:text-lg font-dayone text-gray-700 mb-1">
            No products in {category || "this category"} yet
          </p>
          <p className="text-xs md:text-sm font-roboto text-gray-500 mb-5">
            Check back soon or browse other categories.
          </p>
          <a
            href={ROUTES.LANDINGPAGE}
            className="px-5 py-2.5 bg-Storepurple text-white text-sm font-roboto font-medium rounded-full hover:bg-StorepurpleDark transition-colors"
          >
            Back to Home
          </a>
        </div>
      )}

      {!loading && categoryProducts && categoryProducts.length > 0 && (
        <div className="w-full h-auto md:p-2 grid grid-flow-row grid-cols-3 md:grid-cols-4 bg-purple-100 items-center">
          {categoryProducts.map((i: any, index: number) => (
            <div
              className="w-[125px] md:w-[180px] h-[223px] md:h-[270px] mx-auto my-6 md:my-10 p-1 rounded-lg items-center flex flex-col bg-white cursor-pointer shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:scale-105"
              key={i.id ?? index}
            >
              <a
                href={`${ROUTES.PRODUCT}/${i.id}`}
                className="w-full h-auto mx-auto items-center flex flex-col"
              >
                <img
                  src={i.image}
                  alt={i.name}
                  className="m-auto w-full h-36 md:h-44 object-contain"
                />
                <p className="w-full px-2 text-[10px] md:text-sm truncate text-slate-800 text-center font-bold">
                  {i.name}
                </p>

                <h2 className="text-[10px] md:text-sm py-1 text-black flex flex-col md:flex-row items-center">
                  ₦{priceFormat.format(i.price)}
                  {i.old_price != 0 && i.old_price != null && (
                    <span className="pl-2 text-slate-600 text-sm line-through font-normal">
                      {i.old_price != i.price && `₦${priceFormat.format(i.old_price)}`}
                    </span>
                  )}
                </h2>

                {User && (
                  <button
                    type="button"
                    className="w-full py-2 bg-[#4303a8] hover:bg-[#6d35c7] flex flex-row items-center rounded cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const cartItem = { ...i, inStock: 1 };
                      addToCart(cartItem);
                    }}
                  >
                    <MdShoppingCart className="text-md text-white ml-auto" />
                    <span className="mr-auto pl-2 text-white text-[11px] md:text-sm font-normal">
                      Add to cart
                    </span>
                  </button>
                )}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
