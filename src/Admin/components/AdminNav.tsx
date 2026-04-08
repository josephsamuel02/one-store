import React, { useEffect, useState } from "react";
import { MdPersonOutline, MdLogout } from "react-icons/md";
import ROUTES from "../../utils/Routes";
import { supabase } from "../../DB/supabase";
import { useNavigate } from "react-router-dom";

type AdminUser = {
  surname?: string;
  name?: string;
};

const AdminNav: React.FC = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("one_store_admin");
    if (!token) {
      navigate(ROUTES.ADMIN_LOGIN);
      return;
    }

    const load = async () => {
      const { data, error } = await supabase
        .from("user")
        .select("surname, name")
        .eq("id", token)
        .maybeSingle();

      if (error || !data) {
        console.error("AdminNav: failed to load user", error);
        return;
      }
      setAdminUser(data);
    };

    void load();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("one_store_admin");
    void supabase.auth.signOut();
    navigate(ROUTES.ADMIN_LOGIN);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 px-4 md:px-6 bg-gray-950 border-b border-gray-800/60 flex items-center z-50">
      <a className="flex items-center gap-2 flex-shrink-0" href={ROUTES.ADMIN_LANDINGPAGE}>
        <img src="/img/OneStore logo.svg" alt="OneStore" className="h-8 w-auto brightness-0 invert" />
      </a>

      <div className="ml-auto flex items-center gap-3">
        {adminUser && (
          <a
            href={ROUTES.ADMIN_PROFILE}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <MdPersonOutline size={20} className="text-purple-400" />
            </div>
            <span className="hidden sm:inline text-sm font-roboto font-medium text-gray-300">
              {`${adminUser.surname ?? ""} ${adminUser.name ?? ""}`.trim()}
            </span>
          </a>
        )}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Logout"
        >
          <MdLogout size={20} />
        </button>
      </div>
    </header>
  );
};

export default AdminNav;
