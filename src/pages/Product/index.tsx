/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import DefaultNav from "../../components/DefaultNav";
import ProductCard from "./ProductCard";
import ProductDetails from "./ProductDetails";
import Footer from "../../components/Footer";
import { useParams } from "react-router-dom";
import { supabase } from "../../DB/supabase";

const Product: React.FC = () => {
  const { id } = useParams();
  const [Cart, setCart] = useState<any[]>([]);
  const [singleProduct, setSingleProduct] = useState<any>(null);

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

  const getProductById = async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error getting product:", error);
        return;
      }
      setSingleProduct(data);
    } catch (error) {
      console.error("Error getting product:", error);
    }
  };

  useEffect(() => {
    void getProductById();
    void getCartInfo();
  }, [id]);

  return (
    <div className="w-full h-full pt-16 md:pt-24 bg-purple-100">
      <DefaultNav Cart={Cart} />
      <ProductCard singleProduct={singleProduct} getCartInfo={getCartInfo} />
      <ProductDetails singleProduct={singleProduct} />
      <Footer />
    </div>
  );
};

export default Product;
