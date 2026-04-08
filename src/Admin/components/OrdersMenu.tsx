/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

interface AppState {
  setOrderPage: (value: number) => void;
  orderPage: number;
}

const tabs = [
  { level: 0, label: "Pending", activeColor: "bg-yellow-500/15 text-yellow-400 border-yellow-500" },
  { level: 1, label: "Confirmed", activeColor: "bg-purple-500/15 text-purple-400 border-purple-500" },
  { level: 2, label: "Shipped", activeColor: "bg-blue-500/15 text-blue-400 border-blue-500" },
  { level: 3, label: "Completed", activeColor: "bg-green-500/15 text-green-400 border-green-500" },
];

const OrdersMenu: React.FC<AppState> = ({ setOrderPage, orderPage }) => {
  return (
    <div className="w-full bg-gray-900/50 border-b border-gray-800/60">
      <div className="max-w-3xl mx-auto px-4 py-2 flex gap-2">
        {tabs.map((tab) => {
          const active = orderPage === tab.level;
          return (
            <button
              key={tab.level}
              onClick={() => setOrderPage(tab.level)}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-roboto font-medium text-center rounded-lg border-b-2 transition-colors ${
                active
                  ? tab.activeColor
                  : "border-transparent text-gray-500 hover:bg-gray-800/40 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersMenu;
