/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import DefaultNav from "../../components/DefaultNav";
import CartItems from "./CartItems";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../DB/supabase";
import { toast } from "react-toastify";

const Cart: React.FC = () => {
  const token = localStorage.getItem("one_store_login");
  const navigate = useNavigate();
  const [cartProducts, setCartProducts] = useState<any[]>([]);
  const [cartRowId, setCartRowId] = useState<number | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const getCart = async () => {
    if (!token) return;
    try {
      const { data, error } = await supabase
        .from("cart")
        .select("id, products")
        .eq("user_id", token)
        .maybeSingle();

      if (error) {
        toast.warning("Unable to load cart");
        console.error("Unable to get cart", error);
        return;
      }

      const items: any[] = data?.products ?? [];
      setCartProducts(items);
      setCartRowId(data?.id ?? null);

      const total = items.reduce(
        (sum: number, p: any) => sum + (Number(p.price) || 0) * (Number(p.item_count) || 1),
        0
      );
      setTotalPrice(total);
    } catch (error) {
      console.error("Unable to get cart", error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    void getCart();
  }, [token]);

  return (
    <div className="w-full px-3 flex flex-col items-center h-full pt-16 md:pt-20 bg-purple-100">
      <DefaultNav Cart={cartProducts} />
      {token && (
        <CartItems
          cartItems={cartProducts}
          cartRowId={cartRowId}
          totalPrice={totalPrice}
          getCart={getCart}
        />
      )}
      <Footer />
    </div>
  );
};

export default Cart;
