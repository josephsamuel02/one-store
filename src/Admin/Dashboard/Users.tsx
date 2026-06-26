/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import ROUTES from "../../utils/Routes";
import { supabase } from "../../DB/supabase";
import { useNavigate } from "react-router-dom";

const Users: React.FC = () => {
  const adminToken = localStorage.getItem("one_store_admin");
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user")
        .select("id, email, name, surname, phone, role, created_at")
        .order("created_at", { ascending: false });

      if (!error) {
        setUsers(data ?? []);
        return;
      }

      // Fall back to an unordered fetch in case the table has no created_at column.
      console.error("Ordered user fetch failed, retrying unordered:", error);
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("user")
        .select("id, email, name, surname, phone, role");

      if (fallbackError) {
        console.error("Failed to fetch users:", fallbackError);
        return;
      }
      setUsers(fallbackData ?? []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!adminToken) {
      navigate(ROUTES.ADMIN_LOGIN);
      return;
    }
    void fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      String(u.name ?? "").toLowerCase().includes(q) ||
      String(u.surname ?? "").toLowerCase().includes(q) ||
      String(u.email ?? "").toLowerCase().includes(q) ||
      String(u.phone ?? "").toLowerCase().includes(q)
    );
  });

  const initials = (u: any) => {
    const first = String(u.surname ?? u.name ?? u.email ?? "?").trim()[0] ?? "?";
    return first.toUpperCase();
  };

  return (
    <div className="w-full px-4 md:px-8 py-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl text-gray-100 font-dayone">Users</h2>
          <p className="text-sm text-gray-500 font-roboto mt-1">
            People who have signed up on your store
          </p>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email or phone…"
          className="w-full md:w-72 px-3 py-2 text-sm font-roboto text-gray-100 bg-gray-900 border border-gray-800 rounded-lg outline-none focus:border-Storepurple/60 focus:ring-1 focus:ring-Storepurple/30 placeholder:text-gray-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl border border-gray-800/60 p-5">
          <p className="text-xs font-roboto font-bold uppercase tracking-widest text-gray-500">
            Total Sign-ups
          </p>
          <p className="text-3xl font-dayone text-gray-100 mt-2">
            {loading ? "—" : users.length}
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800/60 p-5">
          <p className="text-xs font-roboto font-bold uppercase tracking-widest text-gray-500">
            Admins
          </p>
          <p className="text-3xl font-dayone text-gray-100 mt-2">
            {loading
              ? "—"
              : users.filter((u) => String(u.role ?? "").toLowerCase() === "admin").length}
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800/60 p-5">
          <p className="text-xs font-roboto font-bold uppercase tracking-widest text-gray-500">
            Showing
          </p>
          <p className="text-3xl font-dayone text-gray-100 mt-2">
            {loading ? "—" : filtered.length}
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 font-roboto text-sm">No users found</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800/60 overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-800/60 bg-gray-800/30">
            <span className="col-span-4 text-[10px] font-roboto font-bold uppercase tracking-widest text-gray-500">
              Name
            </span>
            <span className="col-span-4 text-[10px] font-roboto font-bold uppercase tracking-widest text-gray-500">
              Email
            </span>
            <span className="col-span-2 text-[10px] font-roboto font-bold uppercase tracking-widest text-gray-500">
              Phone
            </span>
            <span className="col-span-2 text-[10px] font-roboto font-bold uppercase tracking-widest text-gray-500">
              Joined
            </span>
          </div>

          {filtered.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 border-b border-gray-800/40 last:border-0 hover:bg-gray-800/20 transition-colors"
            >
              <div className="md:col-span-4 flex items-center gap-3">
                <div className="w-9 h-9 flex-shrink-0 rounded-full bg-Storepurple/20 text-purple-300 flex items-center justify-center text-sm font-dayone">
                  {initials(u)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-roboto font-bold text-gray-200 truncate">
                    {u.surname} {u.name}
                  </p>
                  {String(u.role ?? "").toLowerCase() === "admin" && (
                    <span className="inline-block text-[10px] font-roboto text-purple-300 bg-Storepurple/20 px-1.5 py-0.5 rounded mt-0.5">
                      Admin
                    </span>
                  )}
                </div>
              </div>

              <div className="md:col-span-4 flex items-center min-w-0">
                <a
                  href={`mailto:${u.email}`}
                  className="text-sm font-roboto text-gray-400 hover:text-purple-300 truncate"
                >
                  {u.email ?? "—"}
                </a>
              </div>

              <div className="md:col-span-2 flex items-center">
                {u.phone ? (
                  <a
                    href={`tel:${u.phone}`}
                    className="text-sm font-roboto text-gray-400 hover:text-purple-300"
                  >
                    {u.phone}
                  </a>
                ) : (
                  <span className="text-sm font-roboto text-gray-600">—</span>
                )}
              </div>

              <div className="md:col-span-2 flex items-center">
                <span className="text-xs font-roboto text-gray-500">
                  {u.created_at
                    ? new Date(u.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
