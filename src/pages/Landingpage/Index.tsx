/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import Categories from "./Categories";
import TopeSale from "./TopSale";
import Footer from "../../components/Footer";
import Electronics from "./Electronics";
import Accessories from "./Accessories";
import Baby from "./Baby";
import { supabase } from "../../DB/supabase";
import DefaultNav from "../../components/DefaultNav";

const Index: React.FC = () => {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [Cart, setCart] = useState<any[]>([]);

  const getCartInfo = async () => {
    const token = localStorage.getItem("one_store_login");
    if (!token) {
      setCart([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("cart")
        .select("products")
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

  const addToCart = async (productData: any) => {
    try {
      const token = localStorage.getItem("one_store_login");
      if (!token) throw new Error("User not logged in.");

      const newProduct = {
        id: productData.id,
        image: productData.image,
        name: productData.name,
        productDetails: productData.productDetails,
        features: productData.features,
        price: productData.price,
        old_price: productData.old_price,
        item_count: 1,
        category: productData.category,
      };

      const { data: cartRow, error: fetchErr } = await supabase
        .from("cart")
        .select("id, products")
        .eq("user_id", token)
        .maybeSingle();

      if (fetchErr) throw fetchErr;

      if (cartRow) {
        const existing: any[] = cartRow.products ?? [];
        const idx = existing.findIndex((p: any) => p.id === newProduct.id);

        if (idx >= 0) {
          existing[idx].item_count = (existing[idx].item_count ?? 1) + 1;
        } else {
          existing.push(newProduct);
        }

        const { error } = await supabase
          .from("cart")
          .update({ products: existing })
          .eq("id", cartRow.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cart")
          .insert({ user_id: token, products: [newProduct] });
        if (error) throw error;
      }

      void getCartInfo();
    } catch (error: any) {
      console.error("addToCart failed:", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Unable to fetch products", error);
        return;
      }
      setAllProducts(data ?? []);
    };

    void fetchProducts();
  }, []);

  useEffect(() => {
    void getCartInfo();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.id) {
        localStorage.setItem("one_store_login", session.user.id);
      }
      void getCartInfo();
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="w-full min-h-screen pt-20 md:pt-[72px] bg-gray-50">
      <DefaultNav Cart={Cart} />
      <div className="pt-4 md:pt-6">
        <Banner />
      </div>
      <Categories />
      <TopeSale Products={allProducts} addToCart={addToCart} />
      <Accessories Products={allProducts} addToCart={addToCart} />
      <Baby Products={allProducts} addToCart={addToCart} />
      <Electronics Products={allProducts} addToCart={addToCart} />
      <Footer />
    </div>
  );
};

export default Index;
