import React, { useEffect, useState } from "react";
import ROUTES from "../../utils/Routes";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../DB/supabase";

interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  stock: number;
  productDetails: string;
  category: string;
}

const Store: React.FC = () => {
  const adminToken = localStorage.getItem("one_store_admin");
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const priceFormat = new Intl.NumberFormat("en-US");

  useEffect(() => {
    if (!adminToken) {
      navigate(ROUTES.ADMIN_LOGIN);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, image, name, price, stock, productDetails, category")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch products:", error);
        return;
      }
      setProducts((data as Product[]) ?? []);
      setLoading(false);
    };

    void fetchProducts();
  }, [adminToken, navigate]);

  return (
    <div className="w-full px-4 md:px-8 py-6">
      <h2 className="text-xl md:text-2xl text-gray-100 font-dayone mb-6">
        Products
        <span className="ml-2 text-sm font-roboto font-normal text-gray-500">
          ({products.length})
        </span>
      </h2>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin" />
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 font-roboto text-sm">No products yet</p>
        </div>
      )}

      {!loading && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`${ROUTES.ADMIN_PRODUCT_DETAILS}/${p.id}`)}
              className="bg-gray-900 rounded-xl border border-gray-800/60 hover:border-gray-700 transition-all hover:-translate-y-0.5 overflow-hidden cursor-pointer"
            >
              <div className="h-40 bg-gray-800/40 flex items-center justify-center border-b border-gray-800/60">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-auto object-contain p-3"
                />
              </div>

              <div className="p-4">
                <p className="text-sm font-roboto font-bold text-gray-200 truncate mb-1">
                  {p.name}
                </p>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-dayone text-gray-100">
                    &#8358;{priceFormat.format(p.price)}
                  </span>
                  <span className={`text-xs font-roboto font-medium px-2 py-0.5 rounded-full ${
                    (p.stock ?? 0) > 0
                      ? "bg-green-500/15 text-green-400"
                      : "bg-red-500/15 text-red-400"
                  }`}>
                    {(p.stock ?? 0) > 0 ? `${p.stock} in stock` : "Out of stock"}
                  </span>
                </div>

                {p.category && (
                  <span className="inline-block text-[10px] font-roboto text-gray-500 uppercase tracking-wider bg-gray-800 px-2 py-0.5 rounded">
                    {p.category}
                  </span>
                )}

                <p className="mt-2 text-xs text-gray-500 font-roboto line-clamp-2">
                  {p.productDetails}
                </p>

                <p className="mt-2 text-[10px] text-gray-700 font-roboto font-mono truncate">
                  ID: {p.id}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Store;
