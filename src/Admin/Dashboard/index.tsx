import React, { useState } from "react";
import Orders from "./Orders";
import Store from "./Store";
import Upload from "../Upload";
import SideNav, { MobileNav } from "../components/SideNav";
import Footer from "../../components/Footer";
import AdminNav from "../components/AdminNav";
const Dashboard: React.FC = () => {
  const [sidebarState, setsidebarState] = useState(false);
  const [page, setPage] = useState("orders");

  return (
    <div className="w-full h-full">
      <AdminNav />

      <div className="w-full h-full flex flex-row">
        <SideNav page={page} setPage={setPage} />
        <MobileNav
          page={page}
          setPage={setPage}
          sidebarState={sidebarState}
          setsidebarState={setsidebarState}
        />
        {page == "orders" ? <Orders /> : " "}
        {page == "store" ? <Store /> : ""}
        {page == "upload" ? <Upload /> : ""}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
