/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import DefaultNav from "../../components/DefaultNav";
import ProductCard from "./ProductCard";
import ProductDetails from "./ProductDetails";
import SimilarProducts from "./SimilarProducts";
import Footer from "../../components/Footer";
import { useParams } from "react-router-dom";
import { supabase } from "../../DB/supabase";
import { updateDocumentProductMeta } from "../../utils/shareProduct";
import { getCategoryDisplayLabel, getCategoryQuerySlugs } from "../../utils/categories";
import ROUTES from "../../utils/Routes";
import { toast, ToastContainer } from "react-toastify";

const Product: React.FC = () => {
  const { id } = useParams();
  const [Cart, setCart] = useState<any[]>([]);
  const [singleProduct, setSingleProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const addToCart = async (productData: any, qty = 1) => {
    try {
      const token = localStorage.getItem("one_store_login");
      if (!token) {
        toast.info("Please login to add items to your cart");
        setTimeout(() => {
          window.location.href = ROUTES.LOGIN;
        }, 900);
        return;
      }

      const newProduct = {
        id: productData.id,
        image: productData.image,
        name: productData.name,
        productDetails: productData.productDetails,
        features: productData.features,
        price: productData.price,
        old_price: productData.old_price,
        item_count: qty,
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
          existing[idx].item_count = (existing[idx].item_count ?? 1) + qty;
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
      toast.error("Failed to add to cart");
    }
  };

  const getProductById = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        console.error("Error getting product:", error);
        setSingleProduct(null);
        return;
      }

      setSingleProduct(data);
      updateDocumentProductMeta(data);

      if (data.category) {
        const slugs = getCategoryQuerySlugs(data.category);
        const { data: related } = await supabase
          .from("products")
          .select("*")
          .in("category", slugs)
          .neq("id", data.id)
          .order("created_at", { ascending: false })
          .limit(5);
        setSimilarProducts(related ?? []);
      }
    } catch (error) {
      console.error("Error getting product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    void getProductById();
    void getCartInfo();
  }, [id]);

  return (
    <div className="w-full min-h-screen pt-20 md:pt-24 bg-gray-50 flex flex-col">
      <DefaultNav Cart={Cart} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-4 md:py-6">
        {loading ? (
          <div className="flex items-center justify-center py-28">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-Storepurple rounded-full animate-spin" />
          </div>
        ) : !singleProduct ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center my-8">
            <h2 className="text-xl md:text-2xl font-dayone text-gray-800 mb-2">
              Product not found
            </h2>
            <p className="text-sm font-roboto text-gray-500 mb-6">
              This product may have been removed or is no longer available.
            </p>
            <a
              href={ROUTES.LANDINGPAGE}
              className="inline-flex px-6 py-2.5 bg-Storepurple hover:bg-StorepurpleDark text-white text-sm font-roboto font-medium rounded-full transition-colors"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs md:text-sm font-roboto text-gray-500 mb-5 overflow-x-auto no-scrollbar whitespace-nowrap">
              <a href={ROUTES.LANDINGPAGE} className="hover:text-Storepurple transition-colors">
                Home
              </a>
              <span>/</span>
              {singleProduct.category && (
                <>
                  <a
                    href={`${ROUTES.CATEGORY}?category=${singleProduct.category}`}
                    className="hover:text-Storepurple transition-colors capitalize"
                  >
                    {getCategoryDisplayLabel(singleProduct.category)}
                  </a>
                  <span>/</span>
                </>
              )}
              <span className="text-gray-800 font-medium truncate max-w-xs md:max-w-md">
                {singleProduct.name}
              </span>
            </nav>

            <ProductCard singleProduct={singleProduct} getCartInfo={getCartInfo} />
            <ProductDetails singleProduct={singleProduct} />
            <SimilarProducts
              categoryProducts={similarProducts}
              category={singleProduct.category}
              onAddToCart={(p: any) => void addToCart(p, 1)}
            />
          </>
        )}
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Product;
