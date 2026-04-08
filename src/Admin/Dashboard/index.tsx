import React, { useState } from "react";
import Orders from "./Orders";
import Store from "./Store";
import Upload from "../Upload";
import SideNav, { MobileNav } from "../components/SideNav";
import AdminNav from "../components/AdminNav";

const Dashboard: React.FC = () => {
  const [sidebarState, setsidebarState] = useState(false);
  const [page, setPage] = useState("orders");

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
          {page === "upload" && <Upload />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
