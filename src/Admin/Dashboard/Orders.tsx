/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import ROUTES from "../../utils/Routes";
import OrdersMenu from "../components/OrdersMenu";
import { supabase } from "../../DB/supabase";
import { useNavigate } from "react-router-dom";

const Orders: React.FC = () => {
  const adminToken = localStorage.getItem("one_store_admin");
  const navigate = useNavigate();
  const [orderPage, setOrderPage] = useState<number>(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const priceFormat = new Intl.NumberFormat("en-US");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("order")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch orders:", error);
        return;
      }
      setOrders(data ?? []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!adminToken) {
      navigate(ROUTES.ADMIN_LOGIN);
      return;
    }
    void fetchOrders();
  }, []);

  const filtered = orders.filter((o) => o.orderLevel === orderPage);

  return (
    <div className="w-full">
      <OrdersMenu setOrderPage={setOrderPage} orderPage={orderPage} />

      <div className="px-4 md:px-8 py-6">
        <h2 className="text-xl md:text-2xl text-gray-100 font-dayone mb-6">
          Purchase Requests
        </h2>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 font-roboto text-sm">No orders in this category</p>
          </div>
        )}

        {!loading && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((order: any) => {
              const products: any[] = order.products ?? [];
              const firstImage = products.length > 0 ? products[0].image : "/img/shopping-cart.png";

              return (
                <div
                  key={order.id}
                  className="bg-gray-900 rounded-xl border border-gray-800/60 hover:border-gray-700 transition-all hover:-translate-y-0.5 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`${ROUTES.ADMIN_ORDER_DETAILS}/${order.id}`)}
                >
                  <div className="h-36 bg-gray-800/40 flex items-center justify-center border-b border-gray-800/60">
                    <img
                      src={firstImage}
                      alt="Order"
                      className="h-full w-auto object-contain p-3"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-base font-dayone text-gray-100">
                        &#8358;{priceFormat.format(Number(order.total_price) || 0)}
                      </p>
                      <span className="text-xs text-gray-500 font-roboto">
                        {products.length} item{products.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <p className="text-sm font-roboto font-bold text-gray-200 truncate">
                      {order.surname} {order.name}
                    </p>
                    <p className="text-xs text-gray-500 font-roboto truncate">{order.email}</p>
                    <p className="text-xs text-gray-500 font-roboto">{order.phone}</p>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800/60">
                      <span className="text-[10px] text-gray-600 font-roboto">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : ""}
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${order.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-full hover:bg-blue-500/10 text-blue-400 transition-colors"
                          title="Call"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                          </svg>
                        </a>
                        <a
                          href={`https://wa.me/${order.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-full hover:bg-green-500/10 text-green-400 transition-colors"
                          title="WhatsApp"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
