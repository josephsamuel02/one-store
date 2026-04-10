import React, { useEffect, useState } from "react";
import ROUTES from "../../utils/Routes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../../DB/supabase";
import { useNavigate } from "react-router-dom";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem("one_store_admin");
    if (adminToken) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (!data.session?.user) {
        toast.error("Login failed. Please try again.");
        return;
      }

      const uid = data.session.user.id;

      const { data: userRow, error: userError } = await supabase
        .from("user")
        .select("role")
        .eq("id", uid)
        .maybeSingle();

      if (userError) {
        console.error(userError);
        toast.error("Unable to verify admin status.");
        await supabase.auth.signOut();
        return;
      }

      const isAdmin =
        userRow?.role === "admin" ||
        userRow?.role === "Admin";

      if (!userRow || !isAdmin) {
        toast.error("You are not authorized as an admin.");
        await supabase.auth.signOut();
        return;
      }

      localStorage.setItem("one_store_admin", uid);
      localStorage.setItem("one_store_login", uid);
      localStorage.setItem("login_expiry_date", String(Date.now() + 24 * 60 * 60 * 1000));

      toast.success("Admin login successful");
      window.location.replace("/admin");
    } catch {
      toast.warning("Unable to login. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0c0e14] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/img/OneStore logo.svg"
            alt="OneStore"
            className="h-10 mx-auto mb-6 brightness-0 invert"
          />
          <h1 className="text-3xl font-dayone text-gray-100">Admin Login</h1>
          <p className="text-sm font-roboto text-gray-500 mt-2">Sign in to manage your store</p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800/60 p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-roboto font-medium text-gray-300 mb-1.5">Email</label>
              <input
                required
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm font-roboto text-gray-200 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-roboto font-medium text-gray-300 mb-1.5">Password</label>
              <input
                required
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm font-roboto text-gray-200 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-gray-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-base font-roboto font-bold text-white rounded-xl bg-Storepurple hover:bg-StorepurpleDark active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm shadow-purple-600/20"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm font-roboto text-gray-500">
          Not an admin?{" "}
          <a href={ROUTES.LOGIN} className="text-purple-400 hover:underline">
            User Login
          </a>
        </p>
      </div>

      <ToastContainer theme="dark" />
    </div>
  );
};

export default AdminLogin;
