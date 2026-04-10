import React, { useCallback, useEffect, useState } from "react";
import ROUTES from "../../utils/Routes";
import { supabase } from "../../DB/supabase";
import { useNavigate } from "react-router-dom";
import { MdSearch } from "react-icons/md";

interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  stock: number;
  productDetails: string;
  category: string;
}

const Search: React.FC = () => {
  const adminToken = localStorage.getItem("one_store_admin");
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const priceFormat = new Intl.NumberFormat("en-US");

  const runSearch = useCallback(async (q: string) => {
    const term = q.trim();
    if (!term) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    const { data, error } = await supabase
      .from("products")
      .select("id, image, name, price, stock, productDetails, category")
      .ilike("name", `%${term}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Search failed:", error);
      setResults([]);
    } else {
      setResults((data as Product[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!adminToken) {
      navigate(ROUTES.ADMIN_LOGIN);
    }
  }, [adminToken, navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void runSearch(query);
  };

  return (
    <div className="w-full px-4 md:px-8 py-6">
      <h2 className="text-xl md:text-2xl text-gray-100 font-dayone mb-4">Search products</h2>
      <p className="text-sm text-gray-500 font-roboto mb-6 max-w-xl">
        Find any item in your catalogue by name (partial matches work).
      </p>

      <form onSubmit={onSubmit} className="mb-8 flex flex-col sm:flex-row gap-3 max-w-2xl">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a product name…"
            className="w-full pl-10 pr-4 py-3 text-sm font-roboto text-gray-100 bg-gray-900 border border-gray-800 rounded-lg outline-none focus:border-Storepurple/60 focus:ring-1 focus:ring-Storepurple/30 placeholder:text-gray-600"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 text-sm font-roboto font-bold text-white bg-Storepurple hover:bg-StorepurpleDark rounded-lg transition-colors disabled:opacity-60"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin" />
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-12 rounded-xl border border-gray-800 bg-gray-900/50">
          <p className="text-gray-400 font-roboto text-sm">No products match that name.</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((p) => (
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
                <p className="text-sm font-roboto font-bold text-gray-200 truncate mb-1">{p.name}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-dayone text-gray-100">
                    &#8358;{priceFormat.format(p.price)}
                  </span>
                  <span
                    className={`text-xs font-roboto font-medium px-2 py-0.5 rounded-full ${
                      (p.stock ?? 0) > 0 ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {(p.stock ?? 0) > 0 ? `${p.stock} in stock` : "Out of stock"}
                  </span>
                </div>
                {p.category && (
                  <span className="inline-block text-[10px] font-roboto text-gray-500 uppercase tracking-wider bg-gray-800 px-2 py-0.5 rounded">
                    {p.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
