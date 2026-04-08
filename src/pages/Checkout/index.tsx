/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import DefaultNav from "../../components/DefaultNav";
import { supabase } from "../../DB/supabase";

const Checkout: React.FC = () => {
  const token = localStorage.getItem("one_store_login");
  const [Cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const getCartInfo = async () => {
      if (!token) return;
      try {
        const { data, error } = await supabase
          .from("cart")
          .select("id, products")
          .eq("user_id", token)
          .maybeSingle();

        if (error) {
          console.error("Unable to get cart", error);
          return;
        }
        setCart(data?.products ?? []);
      } catch (error) {
        console.error("Unable to get cart", error);
      }
    };
    void getCartInfo();
  }, [token]);

  return (
    <div className="w-full h-full pt-16 md:pt-20 bg-purple-100">
      <DefaultNav Cart={Cart} />
    </div>
  );
};

export default Checkout;
