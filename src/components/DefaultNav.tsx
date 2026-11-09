import React, { useCallback, useEffect, useState } from "react";
import ROUTES from "../utils/Routes";
import { supabase } from "../DB/supabase";
import { STORE_CATEGORIES } from "../utils/categories";
import {
  MdClose,
  MdMenu,
  MdOutlineLocalGroceryStore,
  MdPersonOutline,
  MdReceiptLong,
  MdSearch,
} from "react-icons/md";

interface AppComponent {
  Cart?: unknown[];
}

function isLoginExpired(): boolean {
  const expiry = localStorage.getItem("login_expiry_date");
  if (!expiry) return true;
  const t = parseInt(expiry, 10);
  return Number.isNaN(t) || Date.now() > t;
}

const DefaultNav: React.FC<AppComponent> = ({ Cart }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [ordersNeedAttention, setOrdersNeedAttention] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const fetchOrdersAttention = useCallback(async () => {
    const uid = localStorage.getItem("one_store_login");
    if (!uid) {
      setOrdersNeedAttention(false);
      return;
    }
    const { data, error } = await supabase
      .from("order")
      .select("orderLevel")
      .eq("user_id", uid);

    if (error) {
      console.error("DefaultNav: orders fetch", error);
      return;
    }
    const hasIncomplete = (data ?? []).some((row: { orderLevel: number | null }) => {
      const level = row.orderLevel ?? 0;
      return level !== 3;
    });
    setOrdersNeedAttention(hasIncomplete);
  }, []);

  useEffect(() => {
    const syncFromStorage = () => {
      const uid = localStorage.getItem("one_store_login");
      setLoggedIn(!!uid && !isLoginExpired());
    };

    const sync = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUid = data.session?.user?.id ?? null;
      if (sessionUid) {
        localStorage.setItem("one_store_login", sessionUid);
        if (isLoginExpired()) {
          localStorage.setItem("login_expiry_date", String(Date.now() + 24 * 60 * 60 * 1000));
        }
        setLoggedIn(true);
        return;
      }
      syncFromStorage();
    };

    void sync();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        localStorage.removeItem("one_store_login");
        localStorage.removeItem("login_expiry_date");
        localStorage.removeItem("one_store_admin");
        setLoggedIn(false);
        setOrdersNeedAttention(false);
        return;
      }
      if (session?.user?.id) {
        localStorage.setItem("one_store_login", session.user.id);
        const currentAdmin = localStorage.getItem("one_store_admin");
        if (currentAdmin && currentAdmin !== session.user.id) {
          localStorage.removeItem("one_store_admin");
        }
        if (isLoginExpired()) {
          localStorage.setItem("login_expiry_date", String(Date.now() + 24 * 60 * 60 * 1000));
        }
        setLoggedIn(true);
        return;
      }
      syncFromStorage();
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      setOrdersNeedAttention(false);
      return;
    }
    void fetchOrdersAttention();

    const onFocus = () => void fetchOrdersAttention();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loggedIn, fetchOrdersAttention]);

  const cartList = Array.isArray(Cart) ? Cart : [];
  const cartCount = cartList.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `${ROUTES.PRODUCTS}?q=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm z-20">
        <div className="max-w-7xl mx-auto h-16 md:h-[70px] px-3 md:px-6 flex items-center gap-3 md:gap-4">
          {/* Hamburger — always visible */}
          <button
            onClick={() => setCategoryOpen(true)}
            className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-purple-50 text-gray-700 hover:text-Storepurple transition-colors"
            aria-label="Open categories"
          >
            <MdMenu size={24} />
          </button>

          <a className="flex-shrink-0" href="/">
            <img
              src="/img/OneStore logo.svg"
              alt="OneStore"
              className="h-6 md:h-9 object-contain"
            />
          </a>

          <form onSubmit={handleSearch} className="flex flex-1 max-w-xl mx-0 md:mx-auto">
            <div className="relative w-full flex items-center">
              <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products, brands and categories..."
                className="w-full pl-10 pr-20 py-2 md:py-2.5 text-xs md:text-sm font-roboto bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-full outline-none transition-all focus:border-Storepurple focus:ring-2 focus:ring-purple-100"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1 md:py-1.5 text-xs font-roboto font-semibold text-white bg-Storepurple hover:bg-StorepurpleDark rounded-full transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex items-center ml-auto gap-2 md:gap-3">
            {loggedIn ? (
              <div className="flex items-center gap-1 md:gap-2">
                <a
                  className="relative inline-flex items-center justify-center p-0 md:p-2 rounded-full hover:bg-gray-100 transition-colors"
                  href={ROUTES.CART}
                  title="Cart"
                >
                  <MdOutlineLocalGroceryStore className="text-gray-700 text-[22px]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 rounded-full">
                      <span className="text-[10px] font-roboto font-bold text-white leading-none">
                        {cartCount}
                      </span>
                    </span>
                  )}
                </a>
                <a
                  className="relative inline-flex items-center justify-center p-0.5 md:p-2 rounded-full hover:bg-gray-100 transition-colors"
                  href={ROUTES.ORDERS}
                  title="My orders"
                >
                  <MdReceiptLong className="text-gray-700 text-[22px]" />
                  {ordersNeedAttention && (
                    <span
                      className="absolute top-1 right-1 w-2.5 h-2.5 bg-orange-500 rounded-full ring-2 ring-white"
                      aria-hidden
                    />
                  )}
                </a>
                <a
                  className="inline-flex items-center justify-center p-0 md:p-2 rounded-full hover:bg-gray-100 transition-colors"
                  href={ROUTES.PROFILE}
                  title="Profile"
                >
                  <MdPersonOutline className="text-gray-700 text-[25px]" />
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <a
                  className="px-4 md:px-5 py-1 md:py-2 text-xs md:text-sm font-roboto font-bold md:font-medium text-Storepurple border border-Storepurple rounded-full hover:bg-purple-50 transition-colors"
                  href={ROUTES.LOGIN}
                >
                  Login
                </a>
                <a
                  className="hidden md:flex px-5 py-2 text-sm font-roboto font-medium text-white bg-Storepurple rounded-full hover:bg-StorepurpleDark transition-colors"
                  href={ROUTES.SIGNUP}
                >
                  Sign up
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        onClick={() => setCategoryOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity duration-300 ${
          categoryOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-in category drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 max-w-[85vw] bg-white z-40 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          categoryOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <img src="/img/OneStore logo.svg" alt="OneStore" className="h-7 object-contain" />
          </div>
          <button
            onClick={() => setCategoryOpen(false)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close categories"
          >
            <MdClose size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Label */}
        <div className="px-5 pt-4 pb-2">
          <p className="text-[10px] font-roboto font-bold uppercase tracking-widest text-gray-400">
            Browse Categories
          </p>
        </div>

        {/* Category list */}
        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          {STORE_CATEGORIES.map((cat) => (
            <a
              key={cat.value}
              href={`${ROUTES.CATEGORY}?category=${cat.value}`}
              onClick={() => setCategoryOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-gray-700 font-roboto hover:bg-purple-50 hover:text-Storepurple transition-colors"
            >
              <span className="flex-shrink-0">{cat.renderIcon()}</span>
              <span>{cat.label}</span>
            </a>
          ))}
        </nav>

        {/* Drawer footer */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/60">
          <a
            href={ROUTES.LANDINGPAGE}
            onClick={() => setCategoryOpen(false)}
            className="flex items-center justify-center w-full py-2.5 rounded-xl bg-Storepurple text-white text-sm font-roboto font-medium hover:bg-StorepurpleDark transition-colors"
          >
            View All Products
          </a>
        </div>
      </aside>
    </>
  );
};

export default DefaultNav;
