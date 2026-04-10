/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import DefaultNav from "../../components/DefaultNav";
import Footer from "../../components/Footer";
import OrderItems from "./OrderItems";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../DB/supabase";
import { MdCall, MdWhatsapp } from "react-icons/md";
import ROUTES from "../../utils/Routes";
import PartnerCard from "../../components/PartnerCard";

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
              className="flex items-center gap-3 w-full py-3 px-4 bg-Storepurple hover:bg-StorepurpleDark rounded-2xl text-white font-roboto text-sm font-medium transition-colors shadow-sm shadow-purple-200"
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

          <PartnerCard />
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
          className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-Storepurple hover:bg-StorepurpleDark text-white shadow-lg shadow-purple-500/40 transition-all active:scale-95"
        >
          <MdCall size={24} />
        </a>
      </div>
    </div>
  );
};

export default Orders;
