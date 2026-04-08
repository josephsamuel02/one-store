/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import AdminNav from "../components/AdminNav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../../DB/supabase";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../utils/Routes";

const AdminProfile: React.FC = () => {
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("one_store_admin");
      if (!token) {
        navigate(ROUTES.ADMIN_LOGIN);
        return;
      }

      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("id", token)
        .maybeSingle();

      if (error || !data) {
        console.error("Failed to load admin profile:", error);
        toast.error("Unable to load profile");
        return;
      }
      setUpdatedUser(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("one_store_admin");
    if (!token) return;

    const payload = {
      id: token,
      surname: userInfo.surname ?? updatedUser?.surname ?? "",
      name: userInfo.name ?? updatedUser?.name ?? "",
      email: userInfo.email ?? updatedUser?.email ?? "",
      phone: userInfo.phone ?? updatedUser?.phone ?? "",
      state: userInfo.state ?? updatedUser?.state ?? "",
      address: userInfo.address ?? updatedUser?.address ?? "",
      lga: userInfo.lga ?? updatedUser?.lga ?? "",
    };

    const { error } = await supabase.from("user").upsert(payload, { onConflict: "id" });

    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }

    toast.success("Profile updated successfully");
    setEdit(false);
    setUserInfo({});
    await loadProfile();
  };

  if (loading || !updatedUser) {
    return (
      <div className="w-full min-h-screen bg-[#0c0e14]">
        <AdminNav />
        <div className="flex items-center justify-center pt-32">
          <div className="w-10 h-10 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const fields = [
    { label: "Surname", key: "surname" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email", type: "email" },
    { label: "Phone", key: "phone", type: "tel" },
    { label: "State", key: "state" },
    { label: "Delivery Address", key: "address" },
    { label: "LGA", key: "lga" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0c0e14]">
      <AdminNav />

      <div className="max-w-lg mx-auto px-4 pt-24 md:pt-28 pb-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-purple-400 font-roboto font-medium hover:underline"
        >
          &larr; Back to dashboard
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-dayone text-gray-100">Admin Profile</h1>
          <button
            onClick={() => { setEdit(!edit); setUserInfo({}); }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-md shadow-purple-600/20"
          >
            <MdEdit size={20} />
          </button>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800/60 p-6">
          {updatedUser.role === "admin" && (
            <div className="mb-4 inline-block px-3 py-1 text-xs font-roboto font-bold text-purple-400 bg-purple-500/15 rounded-full">
              Admin
            </div>
          )}

          {edit ? (
            <form onSubmit={submit} className="space-y-4">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-roboto font-medium text-gray-300 mb-1">{f.label}</label>
                  <input
                    type={f.type ?? "text"}
                    defaultValue={updatedUser[f.key] ?? ""}
                    onChange={(e) => setUserInfo((prev: any) => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full p-3 text-sm font-roboto text-gray-200 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full py-3 text-base font-roboto font-bold text-white rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              {fields.map((f) => (
                <div key={f.key}>
                  <p className="text-xs text-gray-500 font-roboto uppercase tracking-wider">{f.label}</p>
                  <p className="text-sm font-roboto text-gray-200">{updatedUser[f.key] || "—"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ToastContainer theme="dark" />
    </div>
  );
};

export default AdminProfile;
