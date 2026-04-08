/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ROUTES from "../../utils/Routes";

interface AppComponent {
  orders: any[];
}

const ORDER_STATUSES: Record<number, { label: string; color: string }> = {
  0: { label: "Pending", color: "bg-yellow-500" },
  1: { label: "Confirmed", color: "bg-blue-600" },
  2: { label: "Shipped", color: "bg-Storepurple" },
  3: { label: "Completed", color: "bg-green-600" },
};

const OrderItems: React.FC<AppComponent> = ({ orders }) => {
  const priceFormat = new Intl.NumberFormat("en-US");

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-dayone text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-100">
          <img src="/img/shopping-cart.png" alt="" className="w-20 h-20 opacity-40 mb-4" />
          <p className="text-lg font-roboto text-gray-500">No orders yet</p>
          <a
            href={ROUTES.LANDINGPAGE}
            className="mt-4 px-6 py-2.5 bg-Storepurple text-white text-sm font-roboto font-medium rounded-full hover:bg-purple-800 transition-colors"
          >
            Start shopping
          </a>
        </div>
      )}

      <div className="space-y-5">
        {orders.map((order: any) => {
          const products: any[] = order.products ?? [];
          const status = ORDER_STATUSES[order.orderLevel] ?? ORDER_STATUSES[0];
          const orderDate = order.created_at
            ? new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "";

          const orderTotal = products.reduce(
            (sum: number, p: any) =>
              sum + (Number(p.price) || 0) * (Number(p.item_count) || 1),
            0
          );

          return (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-roboto font-bold text-white rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                  <span className="text-xs text-gray-500 font-roboto">{orderDate}</span>
                </div>
                <p className="text-xs text-gray-500 font-roboto">
                  ID: {order.id?.slice(0, 8)}
                </p>
              </div>

              <div className="divide-y divide-gray-50">
                {products.map((item: any, idx: number) => (
                  <a
                    key={idx}
                    href={`${ROUTES.PRODUCT}/${item.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-contain bg-gray-50 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 font-roboto truncate">{item.name}</p>
                      <p className="text-xs text-gray-400 font-roboto">
                        Qty: {item.item_count ?? 1}
                      </p>
                    </div>
                    <p className="text-sm font-dayone text-gray-900 flex-shrink-0">
                      ₦{priceFormat.format((Number(item.price) || 0) * (Number(item.item_count) || 1))}
                    </p>
                  </a>
                ))}
              </div>

              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
                <span className="text-sm font-roboto text-gray-600">
                  {products.length} item{products.length !== 1 ? "s" : ""}
                </span>
                <span className="text-base font-dayone text-gray-900">
                  Total: ₦{priceFormat.format(Number(order.total_price) || orderTotal)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderItems;
