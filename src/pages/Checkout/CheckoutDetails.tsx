/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { supabase } from "../../DB/supabase";
import ROUTES from "../../utils/Routes";
import PayOfflineCard from "./payOfflineCard";

interface AppComponent {
  CheckOutData: any[];
}

const CheckoutDetails: React.FC<AppComponent> = ({ CheckOutData }) => {
  const token = localStorage.getItem("one_store_login");
  const priceFormat = new Intl.NumberFormat("en-US");

  const [userInfo, setUserInfo] = useState<any>(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [alternativePhone, setAlternativePhone] = useState("");
  const [placing, setPlacing] = useState(false);
  const [showOfflineCard, setShowOfflineCard] = useState(false);
  const [orderId, setOrderId] = useState("");

  const computedTotal = CheckOutData.reduce(
    (sum: number, p: any) => sum + (Number(p.price) || 0) * (Number(p.item_count) || 1),
    0
  );

  const fetchUser = async () => {
    if (!token) return;
    try {
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("id", token)
        .maybeSingle();

      if (error || !data) {
        console.error("Unable to fetch user", error);
        return;
      }
      setUserInfo(data);
    } catch (error) {
      console.error("Unable to fetch user", error);
    }
  };

  const placeOrder = async (paymentMedium: string) => {
    if (!token || !userInfo) {
      toast.error("Please login first");
      return;
    }
    if (!deliveryAddress.trim()) {
      toast.warning("Please enter a delivery address");
      return;
    }

    setPlacing(true);
    try {
      const orderRow = {
        user_id: token,
        products: CheckOutData,
        total_price: computedTotal,
        email: userInfo.email ?? null,
        name: userInfo.name ?? null,
        surname: userInfo.surname ?? null,
        phone: userInfo.phone ?? null,
        paymentMedium,
        orderLevel: 0,
      };

      const { data: newOrder, error } = await supabase
        .from("order")
        .insert(orderRow)
        .select("id")
        .single();

      if (error) {
        console.error("Order error:", error);
        if (
          error.code === "23505" &&
          String(error.message).toLowerCase().includes("email")
        ) {
          toast.error(
            "Cannot place another order: your Supabase `order` table has a unique constraint on email. Remove it (see supabase/fix_order_email_unique.sql in this project)."
          );
        } else {
          toast.error(error.message || "Failed to place order");
        }
        return;
      }

      setOrderId(newOrder.id);

      const { data: cartRow } = await supabase
        .from("cart")
        .select("id")
        .eq("user_id", token)
        .maybeSingle();

      if (cartRow) {
        await supabase
          .from("cart")
          .update({ products: [] })
          .eq("id", cartRow.id);
      }

      if (paymentMedium === "offline_payment") {
        setShowOfflineCard(true);
      } else {
        toast.success("Order placed successfully!");
        setTimeout(() => {
          window.location.href = ROUTES.ORDERS;
        }, 1500);
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.replace("/login");
      return;
    }
    void fetchUser();
  }, []);

  return (
    <div className="max-w-5xl mx-auto w-full py-4 px-2 md:px-0">
      <h2 className="text-2xl md:text-3xl p-4 text-gray-900 font-dayone">Checkout</h2>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/5 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-roboto font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">
            Order Summary
          </h3>

          {CheckOutData.map((item: any, index: number) => (
            <div
              key={index}
              className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-contain bg-gray-50 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 font-roboto truncate">{item.name}</p>
                <p className="text-xs text-gray-400 font-roboto">Qty: {item.item_count ?? 1}</p>
              </div>
              <p className="text-sm font-dayone text-gray-900 flex-shrink-0">
                ₦{priceFormat.format((Number(item.price) || 0) * (Number(item.item_count) || 1))}
              </p>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200">
            <span className="text-base font-roboto font-bold text-gray-800">Total</span>
            <span className="text-xl font-dayone text-gray-900">
              ₦{priceFormat.format(computedTotal)}
            </span>
          </div>
        </div>

        <div className="w-full md:w-3/5 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-roboto font-bold text-gray-800 mb-4">Delivery Details</h3>

          {userInfo && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-roboto font-medium text-gray-600 mb-1">
                  Recipient
                </label>
                <p className="text-base text-gray-900 font-roboto">
                  {userInfo.surname} {userInfo.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-roboto font-medium text-gray-600 mb-1">
                  Email
                </label>
                <p className="text-base text-gray-900 font-roboto">{userInfo.email ?? "—"}</p>
              </div>

              <div>
                <label className="block text-sm font-roboto font-medium text-gray-600 mb-1">
                  Phone
                </label>
                <p className="text-base text-gray-900 font-roboto">{userInfo.phone ?? "—"}</p>
              </div>

              <div>
                <label className="block text-sm font-roboto font-medium text-gray-600 mb-1">
                  WhatsApp Number (optional)
                </label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="e.g. 08012345678"
                  className="w-full px-3 py-2 text-sm font-roboto border border-gray-200 rounded-lg outline-none focus:border-Storepurple focus:ring-1 focus:ring-purple-100"
                />
              </div>

              <div>
                <label className="block text-sm font-roboto font-medium text-gray-600 mb-1">
                  Alternative Phone (optional)
                </label>
                <input
                  type="tel"
                  value={alternativePhone}
                  onChange={(e) => setAlternativePhone(e.target.value)}
                  placeholder="e.g. 08012345678"
                  className="w-full px-3 py-2 text-sm font-roboto border border-gray-200 rounded-lg outline-none focus:border-Storepurple focus:ring-1 focus:ring-purple-100"
                />
              </div>

              <div>
                <label className="block text-sm font-roboto font-medium text-gray-600 mb-1">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your full delivery address..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm font-roboto border border-gray-200 rounded-lg outline-none resize-none focus:border-Storepurple focus:ring-1 focus:ring-purple-100"
                />
              </div>
            </div>
          )}

          <div className="mt-5 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800 font-roboto">
              <strong>Note:</strong> Delivery cost will be covered by the buyer and can be negotiated
              with the delivery agent.
            </p>
          </div>

          <div className="mt-6">
            <h4 className="text-base font-roboto font-bold text-gray-800 mb-3">Payment Method</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                disabled={placing}
                onClick={() => toast.info("Online payment not available at the moment")}
                className="flex-1 py-3 px-4 text-sm font-roboto font-medium text-Storepurple border-2 border-Storepurple rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
              >
                Pay Online
              </button>
              <button
                disabled={placing}
                onClick={() => placeOrder("offline_payment")}
                className="flex-1 py-3 px-4 text-sm font-roboto font-medium text-white bg-Storepurple rounded-lg hover:bg-purple-800 transition-colors disabled:opacity-50"
              >
                {placing ? "Placing Order..." : "Pay Offline"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Partner store banner */}
      <div className="mt-8 rounded-2xl overflow-hidden border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-purple-50/30">
        <div className="flex flex-col sm:flex-row items-center gap-6 px-6 py-6 md:px-8 md:py-7">
          {/* Logo slot */}
          <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border-2 border-purple-100 shadow-sm flex items-center justify-center overflow-hidden">
            {/* Replace the img src with your actual P-ONE store logo path, e.g. "/img/p-one-logo.png" */}
            <img
              src="/img/p-one-logo.png"
              alt="P-ONE Store"
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = "none";
                const parent = el.parentElement;
                if (parent) {
                  const placeholder = document.createElement("div");
                  placeholder.className =
                    "flex flex-col items-center justify-center w-full h-full gap-1";
                  placeholder.innerHTML =
                    `<svg class="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><span class="text-[9px] text-purple-300 font-roboto text-center">Add logo</span>`;
                  parent.appendChild(placeholder);
                }
              }}
            />
          </div>

          {/* Text content */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
              <span className="text-[10px] font-roboto font-bold uppercase tracking-widest text-Storepurple bg-purple-100 px-2.5 py-0.5 rounded-full">
                Official Partner
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-dayone text-gray-900 mb-1">
              P-ONE Store
            </h3>
            <p className="text-sm font-roboto text-gray-500 leading-relaxed max-w-sm mx-auto sm:mx-0">
              Your order is fulfilled in partnership with{" "}
              <span className="font-semibold text-gray-700">P-ONE Store</span>, our
              trusted supply partner ensuring quality products and reliable delivery.
            </p>
          </div>

          {/* Verified badge */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1.5 text-green-600">
            <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <span className="text-[10px] font-roboto font-semibold uppercase tracking-wide text-green-600">
              Verified
            </span>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="flex items-center justify-center gap-6 px-6 py-3 bg-gradient-to-r from-Storepurple/5 via-purple-50 to-Storepurple/5 border-t border-purple-100/60">
          <div className="flex items-center gap-1.5 text-gray-500">
            <svg className="w-4 h-4 text-Storepurple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-xs font-roboto">Quality Guaranteed</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5 text-gray-500">
            <svg className="w-4 h-4 text-Storepurple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs font-roboto">Fast Fulfillment</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5 text-gray-500">
            <svg className="w-4 h-4 text-Storepurple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs font-roboto">Trusted Supply</span>
          </div>
        </div>
      </div>

      {showOfflineCard && (
        <PayOfflineCard
          setShowCard={setShowOfflineCard}
          TotalPrice={computedTotal}
          OrderId={orderId}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default CheckoutDetails;
