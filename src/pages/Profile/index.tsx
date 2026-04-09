import React, { useCallback, useEffect, useState } from "react";
import { MdEdit, MdEmail, MdLocationOn, MdLogout, MdPerson, MdPhone } from "react-icons/md";
import Footer from "../../components/Footer";
import DefaultNav from "../../components/DefaultNav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../../DB/supabase";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../utils/Routes";

type UserRow = {
  id?: string;
  surname?: string;
  name?: string;
  email?: string;
  phone?: string;
  state?: string;
  address?: string;
  lga?: string;
  admin?: boolean;
  role?: string;
};

const inputClass =
  "w-full px-4 py-3 text-sm font-roboto text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all focus:border-Storepurple focus:ring-2 focus:ring-purple-100";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<UserRow | null>(null);
  const [userInfo, setUserInfo] = useState<Partial<UserRow>>({});
  const [Cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const getCartInfo = useCallback(async (cartUserId: string | null) => {
    if (!cartUserId) {
      setCart([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("cart")
        .select("id, products")
        .eq("user_id", cartUserId)
        .maybeSingle();

      if (error) {
        console.error("Unable to get cart", error);
        return;
      }
      setCart(data?.products ?? []);
    } catch (error) {
      console.error("Unable to get cart", error);
    }
  }, []);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userId = session?.user?.id ?? localStorage.getItem("one_store_login");
      if (!userId) {
        navigate("/login");
        return;
      }

      localStorage.setItem("one_store_login", userId);
      await getCartInfo(userId);

      const { data: authData } = await supabase.auth.getUser();
      const authEmail = authData.user?.email ?? "";

      const { data: row, error } = await supabase
        .from("user")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error(error);
        toast.error(error.message);
        navigate("/");
        return;
      }

      const merged: UserRow = {
        id: userId,
        surname: row?.surname ?? authData.user?.user_metadata?.surname ?? "",
        name: row?.name ?? authData.user?.user_metadata?.name ?? "",
        email: row?.email ?? authEmail,
        phone: row?.phone ?? authData.user?.user_metadata?.phone ?? "",
        state: row?.state ?? "",
        address: row?.address ?? "",
        lga: row?.lga ?? "",
        admin: row?.admin ?? false,
        role: row?.role,
      };

      setUpdatedUser(merged);
    } catch (e) {
      console.error(e);
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [getCartInfo, navigate]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = updatedUser?.id ?? localStorage.getItem("one_store_login");
    if (!token) {
      toast.error("Not signed in");
      return;
    }

    const emailValue = userInfo.email ?? updatedUser?.email ?? "";
    if (emailValue && emailValue !== updatedUser?.email) {
      const { error: authEmailError } = await supabase.auth.updateUser({
        email: emailValue,
      });
      if (authEmailError) {
        toast.error(authEmailError.message);
        return;
      }
    }

    const payload = {
      id: token,
      surname: userInfo.surname ?? updatedUser?.surname ?? "",
      name: userInfo.name ?? updatedUser?.name ?? "",
      email: emailValue,
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

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      localStorage.removeItem("one_store_login");
      localStorage.removeItem("login_expiry_date");
      localStorage.removeItem("one_store_admin");
      await supabase.auth.signOut();
      toast.success("Signed out");
      navigate(ROUTES.LANDINGPAGE);
    } catch (err) {
      console.error(err);
      toast.error("Could not sign out");
    } finally {
      setLoggingOut(false);
    }
  };

  const isAdmin =
    updatedUser?.admin === true ||
    updatedUser?.role === "admin" ||
    updatedUser?.role === "Admin";

  const displayName =
    `${updatedUser?.surname ?? ""} ${updatedUser?.name ?? ""}`.trim() || "Member";
  const initial = (updatedUser?.surname?.[0] ?? updatedUser?.name?.[0] ?? "?").toUpperCase();

  if (loading || !updatedUser) {
    return (
      <>
        <DefaultNav Cart={Cart} />
        <div className="min-h-screen bg-gray-50 pt-20 md:pt-24 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-Storepurple rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <DefaultNav Cart={Cart} />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 md:pt-24 pb-16">
        <div className="max-w-lg mx-auto px-4 md:px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-Storepurple to-purple-800 px-6 pt-8 pb-10 text-white relative">
              <button
                type="button"
                onClick={() => {
                  setEdit(!edit);
                  setUserInfo({});
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label={edit ? "Cancel edit" : "Edit profile"}
              >
                <MdEdit size={22} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/25 flex items-center justify-center text-3xl font-dayone font-bold ring-4 ring-white/20">
                  {initial}
                </div>
                <h1 className="mt-4 text-xl md:text-2xl font-dayone font-bold">{displayName}</h1>
                <p className="mt-1 text-sm text-white/85 font-roboto flex items-center justify-center gap-1">
                  <MdEmail size={16} className="opacity-80" />
                  {updatedUser.email || "—"}
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {edit ? (
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-roboto font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Surname
                    </label>
                    <input
                      type="text"
                      defaultValue={updatedUser.surname}
                      onChange={(e) => setUserInfo((prev) => ({ ...prev, surname: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-roboto font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      First name
                    </label>
                    <input
                      type="text"
                      defaultValue={updatedUser.name}
                      onChange={(e) => setUserInfo((prev) => ({ ...prev, name: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-roboto font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={updatedUser.email}
                      onChange={(e) => setUserInfo((prev) => ({ ...prev, email: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-roboto font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      pattern="[0-9]{11}"
                      minLength={11}
                      maxLength={11}
                      defaultValue={updatedUser.phone}
                      onChange={(e) => setUserInfo((prev) => ({ ...prev, phone: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-roboto font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      State
                    </label>
                    <input
                      type="text"
                      defaultValue={updatedUser.state}
                      onChange={(e) => setUserInfo((prev) => ({ ...prev, state: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-roboto font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      LGA
                    </label>
                    <input
                      type="text"
                      defaultValue={updatedUser.lga}
                      onChange={(e) => setUserInfo((prev) => ({ ...prev, lga: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-roboto font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                      Delivery address
                    </label>
                    <input
                      type="text"
                      defaultValue={updatedUser.address}
                      onChange={(e) => setUserInfo((prev) => ({ ...prev, address: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEdit(false);
                        setUserInfo({});
                      }}
                      className="flex-1 py-3 text-sm font-roboto font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 text-sm font-roboto font-semibold text-white bg-Storepurple rounded-xl hover:bg-purple-800 transition-colors"
                    >
                      Save changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-start gap-3 py-3 border-b border-gray-100">
                    <div className="p-2 rounded-lg bg-purple-50 text-Storepurple">
                      <MdPerson size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-roboto text-gray-500">Full name</p>
                      <p className="text-sm font-roboto font-medium text-gray-900">{displayName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 py-3 border-b border-gray-100">
                    <div className="p-2 rounded-lg bg-purple-50 text-Storepurple">
                      <MdEmail size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-roboto text-gray-500">Email</p>
                      <p className="text-sm font-roboto font-medium text-gray-900 break-all">
                        {updatedUser.email || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 py-3 border-b border-gray-100">
                    <div className="p-2 rounded-lg bg-purple-50 text-Storepurple">
                      <MdPhone size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-roboto text-gray-500">Phone</p>
                      <p className="text-sm font-roboto font-medium text-gray-900">
                        {updatedUser.phone || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 py-3 border-b border-gray-100">
                    <div className="p-2 rounded-lg bg-purple-50 text-Storepurple">
                      <MdLocationOn size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-roboto text-gray-500">Location</p>
                      <p className="text-sm font-roboto font-medium text-gray-900">
                        {[updatedUser.state, updatedUser.lga].filter(Boolean).join(", ") || "—"}
                      </p>
                      <p className="text-sm font-roboto text-gray-600 mt-1">
                        {updatedUser.address || "—"}
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="pt-3">
                      <span className="inline-flex px-3 py-1 text-xs font-roboto font-bold rounded-full bg-purple-100 text-Storepurple">
                        Admin
                      </span>
                    </div>
                  )}
                </div>
              )}

              {!edit && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => void handleLogout()}
                    disabled={loggingOut}
                    className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-roboto font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-60"
                  >
                    <MdLogout size={20} />
                    {loggingOut ? "Signing out…" : "Log out"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ToastContainer />
    </>
  );
};

export default Profile;
