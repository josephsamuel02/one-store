/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Products from "./Products";
import DefaultNav from "../../components/DefaultNav";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
import { supabase } from "../../DB/supabase";
import CategoryNav from "../Cart/CategoryNav";

const Category: React.FC = () => {
  const location = useLocation();
  const category: string = new URLSearchParams(location.search).get("category") ?? "";
  const [Cart, setCart] = useState<any[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);

  const getProductsByCategory = async () => {
    if (!category) return;
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        toast.error("Unable to get products");
        return;
      }
      setCategoryProducts(data ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to get data");
    }
  };

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
    void getProductsByCategory();
    void getCartInfo();
  }, [category]);

  return (
    <div className="w-full h-full px-1 pt-16 md:pt-24 bg-purple-100">
      <DefaultNav Cart={Cart} />
      <CategoryNav />
      <Products
        category={category}
        categoryProducts={categoryProducts}
        addToCart={addToCart}
      />
      <Footer />
    </div>
  );
};

export default Category;
