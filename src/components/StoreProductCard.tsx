/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { MdShoppingCart } from "react-icons/md";
import { toast } from "react-toastify";
import ROUTES from "../utils/Routes";

interface StoreProductCardProps {
  product: any;
  onAddToCart: (product: any) => void;
}

const priceFormat = new Intl.NumberFormat("en-US");

const StoreProductCard: React.FC<StoreProductCardProps> = ({ product, onAddToCart }) => {
  const userLoggedIn = Boolean(localStorage.getItem("one_store_login"));
  const price = Number(product.price) || 0;
  const oldPrice = Number(product.old_price) || 0;
  const hasDiscount = oldPrice > price && price > 0;
  const discountPercent = hasDiscount ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const outOfStock = product.stock !== null && product.stock !== undefined && Number(product.stock) <= 0;

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userLoggedIn) {
      toast.info("Please login to add items to your cart");
      setTimeout(() => {
        window.location.href = ROUTES.LOGIN;
      }, 900);
      return;
    }

    if (outOfStock) {
      toast.warning("This item is currently out of stock");
      return;
    }

    onAddToCart({ ...product, inStock: 1 });
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100/90 hover:border-purple-200/80 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <a className="flex flex-col h-full" href={`${ROUTES.PRODUCT}/${product.id}`}>
        <div className="relative w-full aspect-square bg-gradient-to-b from-gray-50/80 to-gray-100/40 overflow-hidden">
          {hasDiscount && discountPercent > 0 && (
            <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 text-[10px] md:text-xs font-roboto font-bold text-white bg-rose-500 rounded-full shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {outOfStock && (
            <span className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 text-[10px] font-roboto font-semibold text-gray-700 bg-gray-200/90 backdrop-blur-sm rounded-full">
              Out of stock
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-3.5 group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex flex-col flex-1 p-3.5 md:p-4">
          {product.category && (
            <span className="text-[10px] font-roboto font-semibold uppercase tracking-wider text-purple-600/80 mb-1 truncate">
              {String(product.category).replace(/_/g, " ")}
            </span>
          )}

          <p className="text-xs md:text-sm text-gray-800 font-roboto font-medium line-clamp-2 leading-snug mb-2.5 group-hover:text-Storepurple transition-colors">
            {product.name}
          </p>

          <div className="mt-auto pt-1">
            <div className="flex items-baseline flex-wrap gap-1.5">
              <p className="text-sm md:text-base font-dayone text-gray-900">
                ₦{priceFormat.format(price)}
              </p>
              {hasDiscount && (
                <p className="text-[11px] md:text-xs text-gray-400 line-through font-roboto">
                  ₦{priceFormat.format(oldPrice)}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={outOfStock}
            className={`mt-3 w-full py-2.5 px-3 flex items-center justify-center gap-1.5 text-xs md:text-sm font-roboto font-medium rounded-xl transition-all active:scale-[0.98] ${
              outOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-Storepurple hover:bg-StorepurpleDark text-white shadow-sm shadow-purple-600/15 hover:shadow-md hover:shadow-purple-600/25"
            }`}
            onClick={handleCartClick}
          >
            <MdShoppingCart size={16} />
            <span>{outOfStock ? "Out of stock" : "Add to cart"}</span>
          </button>
        </div>
      </a>
    </div>
  );
};

export default StoreProductCard;
