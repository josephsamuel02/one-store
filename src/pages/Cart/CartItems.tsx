/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import CheckoutDetails from "../Checkout/CheckoutDetails";
import { toast, ToastContainer } from "react-toastify";
import ROUTES from "../../utils/Routes";
import { supabase } from "../../DB/supabase";

interface AppComponent {
  cartItems: any[];
  cartRowId: number | null;
  totalPrice: number;
  getCart: () => void;
}

const CartItems: React.FC<AppComponent> = ({ cartItems, cartRowId, totalPrice, getCart }) => {
  const token = localStorage.getItem("one_store_login");
  const priceFormat = new Intl.NumberFormat("en-US");
  const [order, setOrder] = useState<any>(null);
  const [checkout, setCheckOut] = useState(false);

  const getOrders = async () => {
    if (!token) return;
    try {
      const { data, error } = await supabase
        .from("order")
        .select("*")
        .eq("user_id", token)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Unable to get orders", error);
        return;
      }
      setOrder(data);
    } catch (error) {
      console.error("Unable to get orders", error);
    }
  };

  const updateCartQuantity = async (productId: any, newCount: number) => {
    if (!cartRowId) return;
    try {
      const updated = cartItems.map((p: any) =>
        p.id === productId ? { ...p, item_count: newCount } : p
      );

      const { error } = await supabase
        .from("cart")
        .update({ products: updated })
        .eq("id", cartRowId);

      if (error) {
        toast.error("Unable to update quantity");
        return;
      }
      getCart();
    } catch {
      toast.error("Unable to update quantity");
    }
  };

  const deleteCartItem = async (productId: any) => {
    if (!cartRowId) return;
    try {
      const updated = cartItems.filter((p: any) => p.id !== productId);

      const { error } = await supabase
        .from("cart")
        .update({ products: updated })
        .eq("id", cartRowId);

      if (error) {
        toast.error("Error removing item");
        return;
      }
      toast.success("Item removed");
      getCart();
    } catch {
      toast.error("Error removing item");
    }
  };

  useEffect(() => {
    void getOrders();
  }, []);

  return (
    <>
      {!checkout ? (
        <div className="w-full md:w-10/12 md:p-6 h-auto mx-auto my-4 p-4 flex flex-col bg-white">
          <h3 className="text-2xl md:text-3xl p-4 text-black font-bold font-dayone">Cart</h3>

          {cartItems.length > 0 ? (
            cartItems.map((i: any, index: number) => (
              <div
                className="w-full h-auto my-2 flex flex-col bg-white rounded-md shadow-lg"
                key={`${i.id}-${index}`}
              >
                <div className="w-full h-auto flex flex-row">
                  <img
                    src={i.image}
                    alt={i.name}
                    className="w-32 h-32 mx-auto object-contain"
                  />

                  <div className="w-4/6 flex my-auto flex-col md:flex-row">
                    <h3 className="text-md md:text-lg p-2 text-black font-roboto">{i.name}</h3>
                    <div className="w-64 h-auto flex flex-col">
                      <h3 className="text-2xl py-2 text-black font-dayone">
                        ₦{priceFormat.format((Number(i.price) || 0) * (Number(i.item_count) || 1))}
                      </h3>
                      <div className="w-full h-auto flex flex-row py-6">
                        <input
                          className="mx-3 w-7 h-7 bg-Storepurple rounded shadow font-roboto font-bold text-white"
                          type="button"
                          value="-"
                          onClick={async () => {
                            const count = (i.item_count ?? 1) - 1;
                            if (count >= 1) {
                              await updateCartQuantity(i.id, count);
                            }
                          }}
                        />
                        <p className="text-base text-black font-roboto">{i.item_count ?? 1}</p>
                        <input
                          className="mx-3 w-7 h-7 bg-Storepurple rounded shadow font-roboto font-bold text-white"
                          type="button"
                          value="+"
                          onClick={() => {
                            const count = (i.item_count ?? 1) + 1;
                            updateCartQuantity(i.id, count);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="w-36 m-2 h-auto px-4 py-2 flex flex-row cursor-pointer items-center rounded-md hover:bg-slate-200"
                  onClick={() => deleteCartItem(i.id)}
                >
                  <span>
                    <RiDeleteBin6Line size={24} className="text-red-600" />
                  </span>
                  <span className="text-xl px-3 text-red-600">Remove</span>
                </div>
              </div>
            ))
          ) : (
            <h3 className="text-2xl md:text-3xl p-4 text-black font-bold font-dayone">
              No products in your cart
            </h3>
          )}

          <div className="mx-auto my-4 w-full rounded-2xl overflow-hidden border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50">
            <div className="flex gap-4 px-5 py-4">
              {/* Icon column */}
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mt-0.5">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              {/* Text column */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-roboto font-bold uppercase tracking-widest text-amber-700 mb-1">
                  Delivery Notice
                </p>
                <p className="text-sm font-roboto text-amber-900 leading-relaxed">
                  All products are shipped via a delivery agent.{" "}
                  <span className="font-semibold">Delivery cost is covered by the buyer</span>{" "}
                  and will be negotiated directly with the delivery agent.
                </p>
              </div>
            </div>
            {/* Bottom strip */}
            <div className="flex items-center gap-2 px-5 py-2.5 bg-amber-100/60 border-t border-amber-200/60">
              <svg className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[11px] font-roboto text-amber-700">
                Delivery fee is <span className="font-semibold">not included</span> in your subtotal
              </p>
            </div>
          </div>

          {totalPrice > 0 && (
            <div className="w-full h-auto my-6 flex flex-col bg-white gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline gap-3 py-1">
                  <h3 className="text-lg text-black px-3 font-roboto font-bold">Subtotal:</h3>
                  <h3 className="text-xl text-black font-dayone">
                    ₦{priceFormat.format(totalPrice)}
                  </h3>
                </div>
               
              </div>
              <button
                className="w-2/5 h-auto py-3 text-lg text-center text-white font-bold cursor-pointer rounded bg-Storepurple hover:bg-purple-800"
                onClick={() => setCheckOut(true)}
              >
                Checkout
              </button>
            </div>
          )}

          {order && (
            <div className="w-11/12 md:w-10/12 md:p-6 h-auto mx-auto my-4 p-4 flex flex-col bg-white rounded-xl border border-gray-100">
              <h3 className="text-xl md:text-2xl p-3 text-gray-900 font-bold font-dayone">
                Latest Order
              </h3>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={
                    order.products?.length > 0
                      ? order.products[0].image
                      : "/img/shopping-cart.png"
                  }
                  className="w-16 h-16 rounded-lg object-contain bg-white"
                />
                <div className="flex-1">
                  <p className="text-sm font-roboto font-bold text-gray-800">
                    {order.products?.length ?? 0} item{(order.products?.length ?? 0) !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs font-roboto text-gray-500">
                    Status: {order.orderLevel === 0 ? "Pending" : order.orderLevel === 1 ? "Confirmed" : order.orderLevel === 2 ? "Shipped" : "Completed"}
                  </p>
                </div>
                <a
                  className="px-4 py-2 text-sm text-Storepurple font-roboto font-bold hover:bg-purple-50 rounded-lg transition-colors"
                  href={ROUTES.ORDERS}
                >
                  View All
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        <CheckoutDetails CheckOutData={cartItems} />
      )}
      <ToastContainer />
    </>
  );
};

export default CartItems;
