/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  MdAddShoppingCart,
  MdCheckCircleOutline,
  MdContentCopy,
  MdLocalShipping,
  MdOutlineVerified,
  MdShare,
} from "react-icons/md";
import { toast } from "react-toastify";
import { supabase } from "../../DB/supabase";
import ROUTES from "../../utils/Routes";
import { getCategoryDisplayLabel } from "../../utils/categories";
import { copyProductLink, shareProduct } from "../../utils/shareProduct";

interface AppComponent {
  singleProduct: any;
  getCartInfo: () => void;
}

const ProductCard: React.FC<AppComponent> = ({ singleProduct, getCartInfo }) => {
  const priceFormat = new Intl.NumberFormat("en-US");
  const User = localStorage.getItem("one_store_login");

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  if (!singleProduct) return null;

  const price = Number(singleProduct.price) || 0;
  const oldPrice = Number(singleProduct.old_price) || 0;
  const hasDiscount = oldPrice > price && price > 0;
  const discountPercent = hasDiscount ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const inStock = singleProduct.stock === null || singleProduct.stock === undefined || Number(singleProduct.stock) >= 1;

  const addToCart = async () => {
    const token = localStorage.getItem("one_store_login");
    if (!token) {
      toast.info("Please login to add items to your cart");
      setTimeout(() => {
        window.location.href = ROUTES.LOGIN;
      }, 900);
      return;
    }

    setAdding(true);
    try {
      const newProduct = {
        id: singleProduct.id,
        image: singleProduct.image,
        name: singleProduct.name,
        productDetails: singleProduct.productDetails,
        features: singleProduct.features,
        price: singleProduct.price,
        old_price: singleProduct.old_price,
        item_count: quantity,
        category: singleProduct.category,
      };

      const { data: cartRow, error: fetchErr } = await supabase
        .from("cart")
        .select("id, products")
        .eq("user_id", token)
        .maybeSingle();

      if (fetchErr) throw fetchErr;

      if (cartRow) {
        const existing: any[] = cartRow.products ?? [];
        const idx = existing.findIndex((p: any) => p.id === newProduct.id);

        if (idx >= 0) {
          existing[idx].item_count = (existing[idx].item_count ?? 1) + quantity;
        } else {
          existing.push(newProduct);
        }

        const { error } = await supabase
          .from("cart")
          .update({ products: existing })
          .eq("id", cartRow.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cart")
          .insert({ user_id: token, products: [newProduct] });
        if (error) throw error;
      }

      getCartInfo();
      toast.success("Added to cart!");
    } catch (error: any) {
      console.error("addToCart failed:", error);
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Product Image Column */}
        <div className="lg:col-span-5">
          <div className="relative aspect-square w-full bg-gradient-to-b from-gray-50 to-gray-100/50 rounded-2xl border border-gray-100 flex items-center justify-center p-6 overflow-hidden">
            {hasDiscount && discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-roboto font-bold text-white bg-rose-500 rounded-full shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}
            <img
              src={singleProduct.image}
              alt={singleProduct.name}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Product Info Column */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {singleProduct.category && (
              <a
                href={`${ROUTES.CATEGORY}?category=${singleProduct.category}`}
                className="px-3 py-1 text-xs font-roboto font-bold uppercase tracking-wider text-Storepurple bg-purple-50 hover:bg-purple-100 rounded-full transition-colors"
              >
                {getCategoryDisplayLabel(singleProduct.category)}
              </a>
            )}
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-roboto font-semibold rounded-full ${
                inStock
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <MdCheckCircleOutline size={14} />
              {inStock
                ? singleProduct.stock
                  ? `In Stock (${singleProduct.stock} available)`
                  : "In Stock"
                : "Out of Stock"}
            </span>
            {singleProduct.PayOnDelivery && (
              <span className="px-3 py-1 text-xs font-roboto font-semibold text-amber-700 bg-amber-50 rounded-full">
                Pay on Delivery Available
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-dayone text-gray-900 leading-snug mb-4">
            {singleProduct.name}
          </h1>

          {/* Price Block */}
          <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4 mb-5 flex flex-wrap items-baseline gap-3">
            <span className="text-2xl sm:text-3xl md:text-4xl font-dayone text-Storepurple">
              ₦{priceFormat.format(price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-base md:text-lg text-gray-400 line-through font-roboto">
                  ₦{priceFormat.format(oldPrice)}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-roboto font-semibold text-emerald-700 bg-emerald-100/80 rounded-full">
                  You save ₦{priceFormat.format(oldPrice - price)}
                </span>
              </>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          {inStock ? (
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-roboto font-medium text-gray-600">Quantity:</span>
                <div className="inline-flex items-center bg-gray-100 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-9 h-9 rounded-lg bg-white shadow-sm text-gray-800 font-bold text-lg hover:bg-Storepurple hover:text-white transition-colors disabled:opacity-40"
                  >
                    &minus;
                  </button>
                  <span className="w-10 text-center text-sm font-roboto font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const maxStock = singleProduct.stock ? Number(singleProduct.stock) : 99;
                      if (quantity < maxStock) setQuantity(quantity + 1);
                    }}
                    className="w-9 h-9 rounded-lg bg-Storepurple text-white font-bold text-lg hover:bg-StorepurpleDark transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={adding}
                  onClick={() => void addToCart()}
                  className="flex-1 py-3.5 px-6 text-base font-roboto font-bold text-white bg-Storepurple hover:bg-StorepurpleDark active:scale-[0.99] rounded-xl shadow-md shadow-purple-600/20 flex items-center justify-center gap-2.5 transition-all disabled:opacity-60"
                >
                  <MdAddShoppingCart size={22} />
                  <span>
                    {adding
                      ? "Adding..."
                      : User
                        ? "Add to Cart"
                        : "Login to Add to Cart"}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <button
                type="button"
                disabled
                className="w-full py-3.5 px-6 text-base font-roboto font-bold text-gray-400 bg-gray-100 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
              >
                <MdAddShoppingCart size={22} />
                <span>Currently Out of Stock</span>
              </button>
            </div>
          )}

          {/* Share & Copy Actions */}
          <div className="flex flex-wrap items-center gap-2.5 pb-6 border-b border-gray-100">
            <span className="text-xs font-roboto font-medium text-gray-500 mr-1">Share:</span>
            <button
              type="button"
              onClick={() => void shareProduct(singleProduct)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-roboto font-medium text-Storepurple bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-full transition-colors"
            >
              <MdShare size={16} />
              <span>Share Product</span>
            </button>
            <button
              type="button"
              onClick={() => void copyProductLink(singleProduct)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-roboto font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <MdContentCopy size={15} />
              <span>Copy Link</span>
            </button>
          </div>

          {/* Seller & Delivery Assurance Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-9 h-9 rounded-lg bg-purple-100/80 text-Storepurple flex items-center justify-center flex-shrink-0">
                <MdOutlineVerified size={20} />
              </div>
              <div>
                <p className="text-xs font-roboto font-bold text-gray-900">
                  Sold by OneStore Official
                </p>
                <p className="text-[11px] font-roboto text-gray-500 mt-0.5">
                  100% quality checked &amp; verified product
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-9 h-9 rounded-lg bg-purple-100/80 text-Storepurple flex items-center justify-center flex-shrink-0">
                <MdLocalShipping size={20} />
              </div>
              <div>
                <p className="text-xs font-roboto font-bold text-gray-900">
                  Fast &amp; Reliable Delivery
                </p>
                <p className="text-[11px] font-roboto text-gray-500 mt-0.5">
                  Dispatched promptly via trusted delivery agents
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
