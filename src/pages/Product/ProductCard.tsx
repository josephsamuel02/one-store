/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import { supabase } from "../../DB/supabase";

interface AppComponent {
  singleProduct: any;
  getCartInfo: () => void;
}

const ProductCard: React.FC<AppComponent> = ({ singleProduct, getCartInfo }) => {
  const priceFormat = new Intl.NumberFormat("en-US");
  const User = localStorage.getItem("one_store_login");

  const [quantity, setQuantity] = useState(1);
  const [showBTN, setShowBTN] = useState(true);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("one_store_login");
      if (!token) throw new Error("User not logged in.");

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
      toast.success("Added to cart");
      setShowBTN(false);
    } catch (error: any) {
      console.error("addToCart failed:", error);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="w-11/12 md:w-10/12 h-auto mx-auto my-4 p-4 flex flex-col bg-white rounded-sm">
      {singleProduct && (
        <div className="w-full h-auto mx-auto flex flex-col md:flex-row">
          <img
            src={singleProduct.image}
            alt={singleProduct.name}
            className="m-auto w-52 h-auto object-cover"
          />

          <div className="w-full md:w-2/5 mx-auto h-auto flex flex-col">
            <h2 className="text-xl md:text-2xl py-1 md:py-12 text-gray-800 font-roboto break-words">
              {singleProduct.name}
            </h2>
            <h2 className="text-4xl py-3 text-gray-800 font-dayone break-words">
              ₦{priceFormat.format(singleProduct.price)}
              {singleProduct.old_price != 0 && (
                <span className="pl-2 text-slate-600 text-xl text-decoration-line: line-through font-normal">
                  ₦
                  {priceFormat.format(
                    singleProduct.old_price != singleProduct.price && singleProduct.old_price
                  )}
                </span>
              )}
            </h2>

            {User && showBTN && (
              <div className="w-full h-auto flex flex-row py-6">
                <p className="text-base text-black font-roboto">Quantity</p>
                <input
                  className="mx-3 w-7 h-7 bg-Storepurple rounded shadow font-roboto font-bold text-white"
                  type="button"
                  value="-"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                />
                <p className="text-base text-black font-roboto">
                  {(singleProduct.stock ?? 1) >= 1 ? quantity : 0}
                </p>

                <input
                  className="mx-3 w-7 h-7 bg-Storepurple rounded shadow font-roboto font-bold text-white"
                  type="button"
                  value="+"
                  onClick={() => setQuantity(quantity + 1)}
                />
              </div>
            )}

            {User && (singleProduct.stock ?? 1) >= 1 && showBTN && (
              <p
                className="mx-auto my-6 px-4 w-full h-auto py-4 text-xl text-white font-roboto flex flex-row items-center bg-Storepurple hover:bg-StorepurpleDark rounded-md cursor-pointer"
                onClick={() => addToCart()}
              >
                <span className="px-4">
                  <MdAddShoppingCart size={32} className="mx-auto text-slate-50" />
                </span>
                <span className="mx-auto cursor-pointer">Add to cart</span>
              </p>
            )}
            {(singleProduct.stock ?? 1) < 1 && (
              <p className="mx-auto my-6 px-4 w-full h-auto py-4 text-xl text-white font-roboto flex flex-row items-center bg-gray-500 rounded-md cursor-pointer">
                <span className="px-4">
                  <MdAddShoppingCart size={32} className="mx-auto text-slate-50" />
                </span>
                <span className="mx-auto cursor-pointer">Out of stock</span>
              </p>
            )}
          </div>
        </div>
      )}
      <div className="w-full md:w-2/5 mx-auto md:mx-6 my-4 h-auto flex flex-col">
        <div className="mx-auto w-full md:w-10/12 h-auto p-2 border-2 border-slate-300 rounded-md">
          <h3 className="text-xl py-3 text-slate-900 font-bold text-center border-b-2 border-slate-300">
            SELLER
          </h3>
          <p className="p-3 text-2xl text-slate-900 font-bold">ONESTORE</p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductCard;
