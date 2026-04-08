/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import DefaultNav from "../../components/DefaultNav";
import Footer from "../../components/Footer";
import OrderItems from "./OrderItems";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../DB/supabase";

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
      <OrderItems orders={orders} />
      <Footer />
    </div>
  );
};

export default Orders;
