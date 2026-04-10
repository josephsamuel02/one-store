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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Top success strip */}
        <div className="bg-gradient-to-br from-Storepurple to-StorepurpleDark px-6 pt-8 pb-10 flex flex-col items-center gap-3">
          {/* Animated checkmark circle */}
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-1">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-dayone text-white tracking-wide">Order Placed!</h2>
          <p className="text-purple-200 text-xs font-roboto text-center leading-relaxed">
            Your order has been received. Our agent will reach out shortly.
          </p>
        </div>

        {/* Scalloped divider */}
        <div className="relative -mt-4 h-4 bg-white" style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }} />

        {/* Body */}
        <div className="px-6 pb-6 -mt-1 flex flex-col gap-4">

          {/* Order summary row */}
          <div className="flex items-center justify-between py-3 px-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div>
              <p className="text-[10px] font-roboto uppercase tracking-widest text-gray-400 mb-0.5">Order ID</p>
              <p className="text-sm font-roboto font-bold text-gray-800 tracking-wider">
                #{OrderId.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-right">
              <p className="text-[10px] font-roboto uppercase tracking-widest text-gray-400 mb-0.5">Total</p>
              <p className="text-sm font-dayone text-Storepurple">
                ₦{priceFormat.format(TotalPrice)}
              </p>
            </div>
          </div>

          {/* Contact section */}
          <div>
            <p className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-gray-400 mb-2 px-1">
              Contact us to confirm
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={ROUTES.CALLLINE}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 w-full py-3 px-4 bg-Storepurple hover:bg-StorepurpleDark rounded-2xl text-white font-roboto text-sm font-medium transition-colors"
              >
                <MdCall size={18} />
                <span>08081376616</span>
              </a>
              <a
                href={ROUTES.WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 w-full py-3 px-4 bg-white hover:bg-green-50 border border-green-500/40 rounded-2xl text-green-700 font-roboto text-sm font-medium transition-colors"
              >
                <MdWhatsapp size={18} />
                <span>08081376616</span>
              </a>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              setShowCard(false);
              window.location.href = ROUTES.ORDERS;
            }}
            className="w-full py-3 text-sm font-roboto font-semibold text-Storepurple bg-purple-50 hover:bg-purple-100 rounded-2xl transition-colors"
          >
            View My Orders →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayOfflineCard;
