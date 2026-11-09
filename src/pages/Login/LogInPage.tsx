import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import ROUTES from "../../utils/Routes";
import DefaultNav from "../../components/DefaultNav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../../DB/supabase";
import { useNavigate } from "react-router-dom";
import { GoEyeClosed, GoEye } from "react-icons/go";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return;
      if (session?.user?.id) {
        localStorage.setItem("one_store_login", session.user.id);
        // navigate("/");
      }
    });
    return () => {
      cancelled = true;
    };
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
        toast.error("Login failed. Confirm your email if required, then try again.");
        return;
      }

      const uid = data.session.user.id;
      localStorage.setItem("one_store_login", uid);
      localStorage.setItem("login_expiry_date", String(Date.now() + 24 * 60 * 60 * 1000));
      const existingAdmin = localStorage.getItem("one_store_admin");
      if (existingAdmin && existingAdmin !== uid) {
        localStorage.removeItem("one_store_admin");
      }

      toast.success("Login successful");
      window.location.replace("/");
    } catch {
      toast.warning("Unable to login. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col pt-16 md:pt-24 bg-gray-50">
      <DefaultNav Cart={[]} />
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-14 flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="w-full max-w-md mx-auto">
          <form
            onSubmit={handleLogin}
            className="w-full p-6 md:p-8 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="mb-6">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-Storepurple bg-purple-50 px-3 py-1 rounded-full mb-2">
                Welcome Back
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-dayone">
                Sign in to OneStore
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Access your cart, saved details, and order updates.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={email}
                className="w-full py-2.5 px-4 text-sm text-gray-900 rounded-xl outline-none border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-Storepurple focus:ring-2 focus:ring-purple-100 transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Password
                </label>
                <a
                  href={ROUTES.FORGOTPASSWORD}
                  className="text-xs font-semibold text-Storepurple hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="w-full flex flex-row items-center rounded-xl border border-gray-200 bg-gray-50/50 focus-within:bg-white focus-within:border-Storepurple focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  className="w-full py-2.5 px-4 text-sm text-gray-900 bg-transparent outline-none"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="text-gray-500 hover:text-Storepurple px-3 py-2 border-0 bg-transparent cursor-pointer"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <GoEye size={18} /> : <GoEyeClosed size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <input
                type="checkbox"
                name="remember me"
                id="remember"
                className="w-4 h-4 accent-Storepurple rounded"
              />
              <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                Keep me signed in for 24 hours
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 text-center text-white text-sm font-bold rounded-xl bg-Storepurple hover:bg-StorepurpleDark transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-center mt-6 text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                href={ROUTES.SIGNUP}
                className="font-semibold text-Storepurple hover:underline"
              >
                Create an account
              </a>
            </p>
          </form>
        </div>

        <div className="hidden lg:flex w-1/2 items-center justify-center">
          <img
            src="/img/undraw_login_re_4vu2.svg"
            alt="Login illustration"
            className="w-full max-w-md drop-shadow-sm"
          />
        </div>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Login;
