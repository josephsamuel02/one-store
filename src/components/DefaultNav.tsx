import React, { useEffect, useState } from "react";
import ROUTES from "../utils/Routes";
import { supabase } from "../DB/supabase";
import {
  MdOutlineLocalGroceryStore,
  MdPersonOutline,
  MdSearch,
} from "react-icons/md";

interface AppComponent {
  Cart: unknown[] | undefined;
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
          localStorage.setItem(
            "login_expiry_date",
            String(Date.now() + 24 * 60 * 60 * 1000)
          );
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
        setLoggedIn(false);
        return;
      }
      if (session?.user?.id) {
        localStorage.setItem("one_store_login", session.user.id);
        if (isLoginExpired()) {
          localStorage.setItem(
            "login_expiry_date",
            String(Date.now() + 24 * 60 * 60 * 1000)
          );
        }
        setLoggedIn(true);
        return;
      }
      syncFromStorage();
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const cartList = Array.isArray(Cart) ? Cart : [];
  const cartCount = cartList.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `${ROUTES.PRODUCTS}?q=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-20">
      <div className="max-w-7xl mx-auto h-16 md:h-[68px] px-4 md:px-6 flex items-center gap-4">
        <a className="flex-shrink-0" href="/">
          <img
            src="/img/OneStore logo.svg"
            alt="OneStore"
            className="h-8 md:h-9 object-contain"
          />
        </a>

        <form
          onSubmit={handleSearch}
          className="flex flex-1 max-w-lg mx-2 md:mx-auto"
        >
          <div className="relative w-full">
            <MdSearch
              size={20}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 md:py-2.5 text-sm font-roboto bg-gray-50 border border-gray-200 rounded-full outline-none transition-all focus:border-Storepurple focus:ring-2 focus:ring-purple-100"
            />
          </div>
        </form>

        <div className="flex items-center ml-auto gap-3">
          {loggedIn ? (
            <div className="flex items-center gap-4">
              <a
                className="relative inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
                href={ROUTES.CART}
              >
                <MdOutlineLocalGroceryStore size={26} className="text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 rounded-full">
                    <span className="text-[10px] font-roboto font-bold text-white leading-none">
                      {cartCount}
                    </span>
                  </span>
                )}
              </a>
              <a
                className="inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors"
                href={ROUTES.PROFILE}
              >
                <MdPersonOutline size={26} className="text-gray-700" />
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <a
                className="px-5 py-2 text-sm font-roboto font-medium text-Storepurple border border-Storepurple rounded-full hover:bg-purple-50 transition-colors"
                href={ROUTES.LOGIN}
              >
                Login
              </a>
              <a
                className="px-5 py-2 text-sm font-roboto font-medium text-white bg-Storepurple rounded-full hover:bg-purple-800 transition-colors"
                href={ROUTES.SIGNUP}
              >
                Sign up
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DefaultNav;
