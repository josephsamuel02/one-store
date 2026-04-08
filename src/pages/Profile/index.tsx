import React, { useCallback, useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import Footer from "../../components/Footer";
import DefaultNav from "../../components/DefaultNav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../../DB/supabase";
import { useNavigate } from "react-router-dom";

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

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<UserRow | null>(null);
  const [userInfo, setUserInfo] = useState<Partial<UserRow>>({});
  const [Cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const isAdmin =
    updatedUser?.admin === true ||
    updatedUser?.role === "admin" ||
    updatedUser?.role === "Admin";

  if (loading || !updatedUser) {
    return (
      <>
        <DefaultNav Cart={Cart} />
        <div className="mx-auto w-full md:w-5/6 mt-24 p-8 text-center text-slate-700">
          Loading profile…
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <DefaultNav Cart={Cart} />

      <div className="mx-auto w-full md:w-5/6 h-full mt-20 bg-white overflow-y-scroll scrollbar-hide items-center">
        <div className="mx-auto w-full md:w-96 p-2 mt-16 h-full flex flex-col items-center rounded-md md:shadow-lg">
          <h3 className="mx-auto text-3xl text-purple-800 font-dayone">Profile</h3>
          {edit && (
            <form
              onSubmit={submit}
              className="w-4/5 mx-auto md:px-2 md:mx-4 my-1 py-1 flex flex-col items-center"
            >
              <div className="w-full mx-auto my-1 py-1 flex flex-col items-center">
                <div className="w-full mx-auto my-1 py-1 flex flex-col">
                  <label className="text-lg text-gray-700 font-nunito">Surname:</label>
                  <input
                    type="text"
                    defaultValue={updatedUser.surname}
                    onChange={(e) =>
                      setUserInfo((prev) => ({ ...prev, surname: e.target.value }))
                    }
                    className="mx-auto w-full h-10 px-3 text-nunito text-lg text-slate-700 border-2 outline-none border-slate-300 rounded shadow-sm"
                  />
                </div>
                <div className="w-full mx-auto my-1 py-1 flex flex-col">
                  <label className="text-lg text-gray-700 font-nunito">First name:</label>
                  <input
                    type="text"
                    defaultValue={updatedUser.name}
                    onChange={(e) =>
                      setUserInfo((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="mx-auto w-full h-10 px-3 text-nunito text-lg text-slate-700 border-2 outline-none border-slate-300 rounded shadow-sm"
                  />
                </div>
                <div className="w-full mx-auto my-1 py-1 flex flex-col">
                  <label className="text-lg text-gray-700 font-nunito">Email:</label>
                  <input
                    type="email"
                    defaultValue={updatedUser.email}
                    onChange={(e) =>
                      setUserInfo((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="mx-auto w-full h-10 px-3 text-nunito text-lg text-slate-700 border-2 outline-none border-slate-300 rounded shadow-sm"
                  />
                </div>
                <div className="w-full mx-auto my-1 py-1 flex flex-col">
                  <label className="text-lg text-gray-700 font-nunito">Phone:</label>
                  <input
                    type="tel"
                    pattern="[0-9]{11}"
                    minLength={11}
                    maxLength={11}
                    defaultValue={updatedUser.phone}
                    onChange={(e) =>
                      setUserInfo((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="mx-auto w-full h-10 px-3 text-nunito text-lg text-slate-700 border-2 outline-none border-slate-300 rounded shadow-sm"
                  />
                </div>

                <div className="w-full mx-auto my-1 py-1 flex flex-col">
                  <label className="text-lg text-gray-700 font-nunito">State:</label>
                  <input
                    type="text"
                    defaultValue={updatedUser.state}
                    onChange={(e) =>
                      setUserInfo((prev) => ({ ...prev, state: e.target.value }))
                    }
                    className="mx-auto w-full h-10 px-3 text-nunito text-lg text-slate-700 border-2 outline-none border-slate-300 rounded shadow-sm"
                  />
                </div>
                <div className="w-full mx-auto my-1 py-1 flex flex-col">
                  <label className="text-lg text-gray-700 font-nunito">Delivery Address:</label>
                  <input
                    type="text"
                    defaultValue={updatedUser.address}
                    onChange={(e) =>
                      setUserInfo((prev) => ({ ...prev, address: e.target.value }))
                    }
                    className="mx-auto w-full h-10 px-3 text-nunito text-lg text-slate-700 border-2 outline-none border-slate-300 rounded shadow-sm"
                  />
                </div>
                <div className="w-full mx-auto my-1 py-1 flex flex-col">
                  <label className="text-lg text-gray-700 font-nunito">LGA:</label>
                  <input
                    type="text"
                    defaultValue={updatedUser.lga}
                    onChange={(e) =>
                      setUserInfo((prev) => ({ ...prev, lga: e.target.value }))
                    }
                    className="mx-auto w-full h-10 px-3 text-nunito text-lg text-slate-700 border-2 outline-none border-slate-300 rounded shadow-sm"
                  />
                </div>

                <div className="w-full mx-auto my-1 py-1 flex flex-col">
                  <button
                    type="submit"
                    className="mx-auto w-full py-2 text-center text-nunito text-2xl text-white bg-purple-700 hover:bg-purple-800 rounded cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          )}
          {!edit && (
            <div className="w-4/5 mx-auto md:px-2 md:mx-4 my-1 py-1 flex flex-col items-center">
              <div className="w-full mx-auto my-1 py-1 flex flex-col">
                <label className="text-lg text-gray-700 font-nunito">User name:</label>
                <p className="text-nunito text-lg text-gray-700">
                  {`${updatedUser.surname ?? ""} ${updatedUser.name ?? ""}`.trim() || "—"}
                </p>
              </div>
              <div className="w-full mx-auto my-1 py-1 flex flex-col">
                <label className="text-lg text-gray-700 font-nunito">Email:</label>
                <p className="text-nunito text-lg text-gray-700">{updatedUser.email || "—"}</p>
              </div>
              <div className="w-full mx-auto my-1 py-1 flex flex-col">
                <label className="text-lg text-gray-700 font-nunito">Phone:</label>
                <p className="text-nunito text-lg text-gray-700">{updatedUser.phone || "—"}</p>
              </div>

              <div className="w-full mx-auto my-1 py-1 flex flex-col">
                <label className="text-lg text-gray-700 font-nunito">State:</label>
                <p className="text-nunito text-lg text-gray-700">{updatedUser.state || "—"}</p>
              </div>

              <div className="w-full mx-auto my-1 py-1 flex flex-col">
                <label className="text-lg text-gray-700 font-nunito">LGA:</label>
                <p className="text-nunito text-lg text-gray-700">{updatedUser.lga || "—"}</p>
              </div>
              <div className="w-full mx-auto my-1 py-1 flex flex-col">
                <label className="text-lg text-gray-700 font-nunito">Delivery Address:</label>
                <p className="text-nunito text-lg text-gray-700">{updatedUser.address || "—"}</p>
              </div>
              {isAdmin && (
                <div className="w-full mx-auto my-1 py-1 flex flex-col">
                  <label className="text-lg text-gray-700 font-nunito">Role:</label>
                  <p className="text-nunito text-lg text-gray-700">
                    {updatedUser.role ?? "admin"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className="mx-6 w-16 h-16 md:w-20 md:h-20 flex flex-col items-center bg-purple-700 hover:bg-purple-800 rounded-full cursor-pointer z-20"
          onClick={() => {
            setEdit(!edit);
            setUserInfo({});
          }}
        >
          <h2 className="m-auto text-center text-nunito text-2xl text-white">
            <MdEdit color="white" size={32} />
          </h2>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default Profile;
