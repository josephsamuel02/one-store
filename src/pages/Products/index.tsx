/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DefaultNav from "../../components/DefaultNav";
import Footer from "../../components/Footer";
import { supabase } from "../../DB/supabase";
import { MdShoppingCart } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import ROUTES from "../../utils/Routes";

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q") ?? "";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [Cart, setCart] = useState<any[]>([]);

  const priceFormat = new Intl.NumberFormat("en-US");
  const User = localStorage.getItem("one_store_login");

  const getCartInfo = async () => {
    const token = localStorage.getItem("one_store_login");
    if (!token) {
      setCart([]);
      return;
    }
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

  const searchProducts = async () => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const term = `%${searchQuery.trim()}%`;

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`name.ilike.${term},category.ilike.${term},productDetails.ilike.${term}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Search error:", error);
        toast.error("Search failed");
        return;
      }
      setResults(data ?? []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productData: any) => {
    try {
      const token = localStorage.getItem("one_store_login");
      if (!token) {
        toast.warning("Please login to add items to cart");
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
      toast.error("Failed to add to cart");
    }
  };

  useEffect(() => {
    void searchProducts();
    void getCartInfo();
  }, [searchQuery]);

  return (
    <div className="w-full min-h-screen pt-20 md:pt-[72px] bg-gray-50">
      <DefaultNav Cart={Cart} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-dayone text-gray-900">
            {searchQuery ? `Results for "${searchQuery}"` : "Search Products"}
          </h1>
          {!loading && searchQuery && (
            <p className="mt-1 text-sm text-gray-500 font-roboto">
              {results.length} product{results.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-Storepurple rounded-full animate-spin" />
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
            {results.map((i: any, index: number) => (
              <div
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-1"
                key={index}
              >
                <a className="flex flex-col h-full" href={`${ROUTES.PRODUCT}/${i.id}`}>
                  <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={i.image}
                      alt={i.name}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex flex-col flex-1 p-3">
                    <p className="text-xs md:text-sm text-gray-700 font-roboto line-clamp-2 leading-snug mb-2">
                      {i.name}
                    </p>

                    <div className="mt-auto">
                      <p className="text-sm md:text-base font-dayone text-gray-900">
                        ₦{priceFormat.format(i.price)}
                      </p>
                      {i.old_price != 0 && i.old_price != i.price && (
                        <p className="text-xs text-gray-400 line-through font-roboto">
                          ₦{priceFormat.format(i.old_price)}
                        </p>
                      )}
                    </div>

                    {User && (
                      <button
                        className="mt-2.5 w-full py-2 flex items-center justify-center gap-1.5 bg-Storepurple hover:bg-StorepurpleDark text-white text-xs md:text-sm font-roboto font-medium rounded-lg transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(i);
                        }}
                      >
                        <MdShoppingCart size={16} />
                        <span>Add to cart</span>
                      </button>
                    )}
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}

        {!loading && searchQuery && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MdShoppingCart size={64} className="text-gray-300 mb-4" />
            <h2 className="text-xl font-dayone text-gray-700 mb-2">No products found</h2>
            <p className="text-sm text-gray-500 font-roboto max-w-md">
              We couldn't find anything matching "{searchQuery}". Try a different search term or
              browse our categories.
            </p>
            <a
              href={ROUTES.LANDINGPAGE}
              className="mt-6 px-6 py-2.5 bg-Storepurple text-white text-sm font-roboto font-medium rounded-full hover:bg-StorepurpleDark transition-colors"
            >
              Browse all products
            </a>
          </div>
        )}

        {!loading && !searchQuery && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MdShoppingCart size={64} className="text-gray-300 mb-4" />
            <h2 className="text-xl font-dayone text-gray-700 mb-2">Search for products</h2>
            <p className="text-sm text-gray-500 font-roboto">
              Use the search bar above to find what you're looking for.
            </p>
          </div>
        )}
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default ProductsPage;
