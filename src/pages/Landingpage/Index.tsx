/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import Categories from "./Categories";
import TopeSale from "./TopSale";
import Footer from "../../components/Footer";
import Electronics from "./Electronics";
import Accessories from "./Accessories";
import Baby from "./Baby";
import Household from "./Household";
import { supabase } from "../../DB/supabase";
import DefaultNav from "../../components/DefaultNav";
import { toast, ToastContainer } from "react-toastify";
import { MdLocalShipping, MdOutlineVerified, MdPayment, MdSupportAgent } from "react-icons/md";

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

      toast.success("Added to cart");
      void getCartInfo();
    } catch (error: any) {
      console.error("addToCart failed:", error);
      toast.error("Failed to add item to cart");
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

  const perks = [
    {
      icon: <MdLocalShipping size={24} className="text-Storepurple" />,
      title: "Fast Delivery",
      desc: "Reliable nationwide dispatch to your doorstep",
    },
    {
      icon: <MdOutlineVerified size={24} className="text-Storepurple" />,
      title: "Genuine Quality",
      desc: "100% authentic products from trusted suppliers",
    },
    {
      icon: <MdPayment size={24} className="text-Storepurple" />,
      title: "Easy Checkout",
      desc: "Convenient bank transfer & offline payment options",
    },
    {
      icon: <MdSupportAgent size={24} className="text-Storepurple" />,
      title: "Dedicated Support",
      desc: "Instant help via WhatsApp & phone line",
    },
  ];

  return (
    <div className="w-full min-h-screen pt-16 md:pt-[76px] bg-gray-50">
      <DefaultNav Cart={Cart} />

      <div className="pt-3 md:pt-5 pb-4">
        <Banner />
      </div>

      {/* Trust / Value Proposition Strip */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {perks.map((p, idx) => (
            <div
              key={idx}
              className="flex items-start sm:items-center gap-3 bg-white rounded-2xl p-3.5 md:p-4 border border-gray-100 shadow-sm"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                {p.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-dayone text-gray-900">{p.title}</p>
                <p className="text-[11px] md:text-xs font-roboto text-gray-500 leading-snug mt-0.5">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Categories />
      <TopeSale Products={allProducts} addToCart={addToCart} />
      <Household Products={allProducts} addToCart={addToCart} />
      <Accessories Products={allProducts} addToCart={addToCart} />
      <Baby Products={allProducts} addToCart={addToCart} />
      <Electronics Products={allProducts} addToCart={addToCart} />
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Index;
