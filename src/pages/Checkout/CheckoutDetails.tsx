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
        toast.error("Failed to place order");
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
