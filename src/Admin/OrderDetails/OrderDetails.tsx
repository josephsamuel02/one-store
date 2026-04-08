/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../DB/supabase";
import ROUTES from "../../utils/Routes";
import DefaultNav from "../components/AdminNav";
import { toast, ToastContainer } from "react-toastify";

const ORDER_STATUSES: Record<number, { label: string; color: string }> = {
  0: { label: "Pending", color: "bg-yellow-500" },
  1: { label: "Confirmed", color: "bg-purple-500" },
  2: { label: "Shipped", color: "bg-blue-500" },
  3: { label: "Completed", color: "bg-green-500" },
};

const AdminOrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("one_store_admin");
  const priceFormat = new Intl.NumberFormat("en-US");

  const [order, setOrder] = useState<any>(null);
  const [advancing, setAdvancing] = useState(false);

  const fetchOrder = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from("order")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Failed to fetch order:", error);
        return;
      }
      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order:", error);
    }
  };

  const advanceOrderLevel = async () => {
    if (!order || order.orderLevel >= 3) return;
    setAdvancing(true);
    try {
      const newLevel = order.orderLevel + 1;
      const { error } = await supabase
        .from("order")
        .update({ orderLevel: newLevel })
        .eq("id", order.id);

      if (error) {
        toast.error("Failed to update order status");
        console.error(error);
        return;
      }
      toast.success(`Order marked as ${ORDER_STATUSES[newLevel]?.label}`);
      setOrder({ ...order, orderLevel: newLevel });
    } catch (error) {
      toast.error("Failed to update order status");
      console.error(error);
    } finally {
      setAdvancing(false);
    }
  };

  useEffect(() => {
    if (!adminToken) {
      navigate(ROUTES.ADMIN_LOGIN);
      return;
    }
    void fetchOrder();
  }, [id]);

  if (!order) {
    return (
      <div className="w-full min-h-screen bg-[#0c0e14]">
        <DefaultNav />
        <div className="flex items-center justify-center pt-32">
          <div className="w-10 h-10 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const products: any[] = order.products ?? [];
  const status = ORDER_STATUSES[order.orderLevel] ?? ORDER_STATUSES[0];
  const orderDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const computedTotal = products.reduce(
    (sum: number, p: any) => sum + (Number(p.price) || 0) * (Number(p.item_count) || 1),
    0
  );

  return (
    <div className="w-full min-h-screen bg-[#0c0e14]">
      <DefaultNav />

      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-24 md:pt-28 pb-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-purple-400 font-roboto font-medium hover:underline"
        >
          &larr; Back to orders
        </button>

        <h1 className="text-2xl md:text-3xl font-dayone text-gray-100 mb-6">Order Details</h1>

        <div className="bg-gray-900 rounded-xl border border-gray-800/60 p-5 md:p-6 mb-5">
          <div className="flex flex-wrap items-center gap-3 mb-5 pb-4 border-b border-gray-800/60">
            <span className={`px-4 py-1.5 text-xs font-roboto font-bold text-white rounded-full ${status.color}`}>
              {status.label}
            </span>
            {order.orderLevel < 3 && (
              <button
                disabled={advancing}
                onClick={advanceOrderLevel}
                className="px-4 py-1.5 text-xs font-roboto font-bold text-purple-400 border border-purple-500/50 rounded-full hover:bg-purple-500/10 transition-colors disabled:opacity-50"
              >
                {advancing ? "Updating..." : `Mark as ${ORDER_STATUSES[order.orderLevel + 1]?.label}`}
              </button>
            )}
            <span className="ml-auto text-xs text-gray-500 font-roboto">{orderDate}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            <div>
              <p className="text-xs text-gray-500 font-roboto uppercase tracking-wider">Customer</p>
              <p className="text-sm font-roboto font-bold text-gray-200">{order.surname} {order.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-roboto uppercase tracking-wider">Email</p>
              <p className="text-sm font-roboto text-gray-300">{order.email ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-roboto uppercase tracking-wider">Phone</p>
              <p className="text-sm font-roboto text-gray-300">{order.phone ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-roboto uppercase tracking-wider">Payment</p>
              <p className="text-sm font-roboto text-gray-300">{order.paymentMedium ?? "—"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-gray-500 font-roboto uppercase tracking-wider">Order ID</p>
              <p className="text-sm font-roboto text-gray-400 font-mono">{order.id}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800/60 overflow-hidden mb-5">
          <div className="px-5 py-3 border-b border-gray-800/60 flex items-center justify-between">
            <h3 className="text-base font-dayone text-gray-200">
              Products
              <span className="ml-2 px-2 py-0.5 text-xs bg-purple-600 text-white rounded-full">
                {products.length}
              </span>
            </h3>
          </div>

          <div className="divide-y divide-gray-800/60">
            {products.map((item: any, index: number) => {
              const lineTotal = (Number(item.price) || 0) * (Number(item.item_count) || 1);
              return (
                <div key={index} className="flex items-center gap-4 px-5 py-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-contain bg-gray-800/60 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-roboto font-bold text-gray-200 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 font-roboto mt-0.5">
                      &#8358;{priceFormat.format(Number(item.price) || 0)} x {item.item_count ?? 1}
                    </p>
                    {item.productDetails && (
                      <p className="text-xs text-gray-600 font-roboto mt-1 line-clamp-2">
                        {item.productDetails}
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-dayone text-gray-100 flex-shrink-0">
                    &#8358;{priceFormat.format(lineTotal)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between px-5 py-4 bg-gray-800/40 border-t border-gray-800/60">
            <span className="text-sm font-roboto font-bold text-gray-400">Order Total</span>
            <span className="text-lg font-dayone text-gray-100">
              &#8358;{priceFormat.format(Number(order.total_price) || computedTotal)}
            </span>
          </div>
        </div>
      </div>

      <ToastContainer theme="dark" />
    </div>
  );
};

export default AdminOrderDetails;
