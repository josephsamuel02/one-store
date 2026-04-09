/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import DefaultNav from "../../components/DefaultNav";
import Footer from "../../components/Footer";
import OrderItems from "./OrderItems";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../DB/supabase";
import { MdCall, MdWhatsapp } from "react-icons/md";
import ROUTES from "../../utils/Routes";

const Orders: React.FC = () => {
  const token = localStorage.getItem("one_store_login");
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  const getOrders = async () => {
    if (!token) return;
    try {
      const { data, error } = await supabase
        .from("order")
        .select("*")
        .eq("user_id", token)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Unable to get orders", error);
        return;
      }
      setOrders(data ?? []);
    } catch (error) {
      console.error("Unable to get orders", error);
    }
  };

  const getCartInfo = async () => {
    if (!token) return;
    try {
      const { data } = await supabase
        .from("cart")
        .select("products")
        .eq("user_id", token)
        .maybeSingle();
      setCart(data?.products ?? []);
    } catch (error) {
      console.error("Unable to get cart", error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    void getOrders();
    void getCartInfo();
  }, []);

  return (
    <div className="w-full min-h-screen pt-20 md:pt-[72px] bg-gray-50">
      <DefaultNav Cart={cart} />

      <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row lg:items-start gap-6">
        {/* Orders list */}
        <main className="flex-1 min-w-0">
          <OrderItems orders={orders} />
        </main>

        {/* Partner sidebar — sticky on desktop, bottom on mobile */}
        <aside className="w-full lg:w-72 xl:w-80 lg:sticky lg:top-24 lg:self-start order-last flex flex-col gap-3">

          {/* Contact buttons — above the card, desktop only */}
          <div className="hidden lg:flex flex-col gap-2">
            <p className="text-[10px] font-roboto font-semibold uppercase tracking-widest text-gray-400 px-1 mb-0.5">
              Need help with your order?
            </p>
            <a
              href={ROUTES.CALLLINE}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 w-full py-3 px-4 bg-Storepurple hover:bg-purple-800 rounded-2xl text-white font-roboto text-sm font-medium transition-colors shadow-sm shadow-purple-200"
            >
              <MdCall size={18} />
              <span>Call Us — 08081376616</span>
            </a>
            <a
              href={ROUTES.WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 w-full py-3 px-4 bg-white hover:bg-green-50 border border-green-500/40 rounded-2xl text-green-700 font-roboto text-sm font-medium transition-colors"
            >
              <MdWhatsapp size={18} />
              <span>WhatsApp Us — 08081376616</span>
            </a>
          </div>

          {/* Partner card */}
          <div className="rounded-2xl overflow-hidden border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-purple-50/30">
            {/* Header */}
            <div className="px-5 pt-5 pb-3">
              <span className="text-[10px] font-roboto font-bold uppercase tracking-widest text-Storepurple bg-purple-100 px-2.5 py-0.5 rounded-full">
                Official Partner
              </span>
            </div>

            {/* Logo + name */}
            <div className="flex flex-col items-center px-5 pb-5 gap-4">
              <div className="w-24 h-24 rounded-2xl bg-white border-2 border-purple-100 shadow-sm flex items-center justify-center overflow-hidden">
                <img
                  src="/img/p-one-logo.png"
                  alt="P-ONE Store"
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = "none";
                    const parent = el.parentElement;
                    if (parent && !parent.querySelector("svg")) {
                      parent.innerHTML =
                        `<svg class="w-10 h-10 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`;
                    }
                  }}
                />
              </div>

              <div className="text-center">
                <h3 className="text-lg font-dayone text-gray-900 mb-1">P-ONE Store</h3>
                <p className="text-xs font-roboto text-gray-500 leading-relaxed">
                  Your orders are fulfilled in partnership with{" "}
                  <span className="font-semibold text-gray-700">P-ONE Store</span>, our trusted
                  supply partner.
                </p>
              </div>

              {/* Verified badge */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-50 border border-green-100 text-green-600">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span className="text-xs font-roboto font-semibold">Verified Partner</span>
              </div>
            </div>

            {/* Trust signals */}
            <div className="border-t border-purple-100/60 bg-gradient-to-r from-Storepurple/5 via-purple-50 to-Storepurple/5 px-5 py-4 flex flex-col gap-2.5">
              {[
                {
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                  label: "Quality Guaranteed",
                },
                {
                  icon: "M13 10V3L4 14h7v7l9-11h-7z",
                  label: "Fast Fulfillment",
                },
                {
                  icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
                  label: "Trusted Supply",
                },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-gray-500">
                  <svg className="w-4 h-4 text-Storepurple flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                  <span className="text-xs font-roboto">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <Footer />

      {/* Mobile floating circular contact buttons — hidden on desktop */}
      <div className="lg:hidden fixed bottom-6 right-4 z-30 flex flex-col gap-3">
        <a
          href={ROUTES.WHATSAPP}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp Us"
          className="w-13 h-13 w-[52px] h-[52px] flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/40 transition-all active:scale-95"
        >
          <MdWhatsapp size={26} />
        </a>
        <a
          href={ROUTES.CALLLINE}
          target="_blank"
          rel="noreferrer"
          aria-label="Call Us"
          className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-Storepurple hover:bg-purple-800 text-white shadow-lg shadow-purple-500/40 transition-all active:scale-95"
        >
          <MdCall size={24} />
        </a>
      </div>
    </div>
  );
};

export default Orders;
