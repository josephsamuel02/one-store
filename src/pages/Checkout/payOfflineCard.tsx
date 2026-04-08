/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ROUTES from "../../utils/Routes";
import { MdCall, MdWhatsapp } from "react-icons/md";

interface appState {
  setShowCard: (value: any) => void;
  TotalPrice: number;
  OrderId: string;
}

const PayOfflineCard: React.FC<appState> = ({ setShowCard, TotalPrice, OrderId }) => {
  const priceFormat = new Intl.NumberFormat("en-US");

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center">
        <img src="/img/done-icon.svg" alt="Order placed" className="w-20 h-20 mb-4" />

        <h2 className="text-2xl text-Storepurple font-dayone text-center mb-2">
          Order Placed!
        </h2>
        <p className="text-sm text-gray-600 font-roboto text-center mb-1">
          Order ID: <span className="font-bold text-gray-800">{OrderId.slice(0, 8)}</span>
        </p>
        <p className="text-lg font-dayone text-gray-900 mb-4">
          Total: ₦{priceFormat.format(TotalPrice)}
        </p>
        <p className="text-sm text-gray-500 font-roboto text-center mb-6">
          Our agent will contact you regarding payment and delivery.
        </p>

        <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl mb-6">
          <h4 className="text-sm font-roboto font-bold text-gray-800 mb-3">Contact Us</h4>
          <a
            href={ROUTES.CALLLINE}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 w-full py-2.5 px-4 mb-2 bg-Storepurple hover:bg-purple-800 rounded-full text-white font-roboto text-sm transition-colors"
          >
            <MdCall size={20} />
            <span>08081376616</span>
          </a>
          <a
            href={ROUTES.WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 w-full py-2.5 px-4 bg-white hover:bg-green-50 border border-green-600 rounded-full text-green-700 font-roboto text-sm transition-colors"
          >
            <MdWhatsapp size={20} />
            <span>08081376616</span>
          </a>
        </div>

        <button
          onClick={() => {
            setShowCard(false);
            window.location.href = ROUTES.ORDERS;
          }}
          className="w-full py-3 text-base font-roboto font-bold text-white bg-Storepurple hover:bg-purple-800 rounded-full transition-colors"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default PayOfflineCard;
