import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ROUTES from "../../utils/Routes";
import Orders from "./Orders";
import Store from "./Store";
import Search from "./Search";
import Upload from "../Upload";
import SideNav, { MobileNav } from "../components/SideNav";
import AdminNav from "../components/AdminNav";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarState, setsidebarState] = useState(false);
  const [page, setPageState] = useState(() =>
    location.pathname === ROUTES.ADMIN_SEARCH ? "search" : "orders"
  );

  useEffect(() => {
    if (location.pathname === ROUTES.ADMIN_SEARCH) {
      setPageState("search");
    } else if (location.pathname === ROUTES.ADMIN_LANDINGPAGE) {
      setPageState((prev) => (prev === "search" ? "orders" : prev));
    }
  }, [location.pathname]);

  const setPage = useCallback(
    (key: string) => {
      setPageState(key);
      if (key === "search") {
        navigate(ROUTES.ADMIN_SEARCH);
      } else {
        navigate(ROUTES.ADMIN_LANDINGPAGE);
      }
    },
    [navigate]
  );

  return (
    <div className="w-full min-h-screen bg-[#0c0e14] flex flex-col">
      <AdminNav />

      <div className="flex flex-1 pt-16">
        <SideNav page={page} setPage={setPage} />
        <MobileNav
          page={page}
          setPage={setPage}
          sidebarState={sidebarState}
          setsidebarState={setsidebarState}
        />

        <main className="flex-1 overflow-y-auto">
          {page === "orders" && <Orders />}
          {page === "store" && <Store />}
          {page === "search" && <Search />}
          {page === "upload" && <Upload />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
