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

      toast.success("Login successful");
      window.location.replace("/");
    } catch {
      toast.warning("Unable to login. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full pt-16 md:pt-24 bg-purple-100">
      <DefaultNav Cart={[]} />
      <div className="w-full h-auto md:pb-12 mt-10 flex flex-col md:flex-row items-center">
        <div className="mx-auto py-2 h-auto w-auto md:w-1/2">
          <form
            onSubmit={handleLogin}
            className="mx-auto p-10 md:w-96 flex flex-col bg-white rounded-md items-center"
          >
            <div className="w-full flex h-auto">
              <p className="text-3xl mx-1 font-bold text-slate-800 text-left">Login</p>
            </div>
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              className="w-full my-3 h-auto py-2 px-4 text-lg text-slate-800 rounded-md outline-none border-2 border-blue-600 focus:border-purple-700"
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="w-full my-3 h-auto py-2 text-lg text-slate-800 flex flex-row items-center rounded-md outline-none border-2 border-blue-600 focus:border-purple-700">
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                className="w-full h-auto px-4 text-lg text-slate-800 outline-none"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="text-[#2319ac] mx-3 p-0 border-0 bg-transparent cursor-pointer"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <GoEye size={20} /> : <GoEyeClosed size={20} />}
              </button>
            </div>

            <div className="mr-auto w-auto h-auto flex flex-row items-center">
              <input
                type="checkbox"
                name="remember me"
                id="remember"
                className="my-3 h-auto"
              />
              <label htmlFor="remember" className="px-1 text-base text-slate-900">
                Remember me
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mx-auto px-6 py-2 my-4 text-center text-white text-xl font-nunito rounded-full bg-Storepurple hover:bg-purple-500 bg-gradient-to-r from-purple-500 hover:from-Storepurple transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <p className="mx-auto my-3 text-base text-thin text-slate-700">
              Don&apos;t have an account?
              <a href={ROUTES.SIGNUP} className="mx-1 text-base text-blue-800">
                Sign Up
              </a>
            </p>
          </form>
        </div>

        <div className="m-auto pb-28 mx-auto h-auto w-1/2 items-center">
          <img
            src="img/undraw_login_re_4vu2.svg"
            alt=""
            className="m-auto mx-auto md:mx-1 w-full md:w-9/12"
          />
        </div>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Login;
