import React, { useState } from "react";
import Footer from "../../components/Footer";
import ROUTES from "../../utils/Routes";
import DefaultNav from "../../components/DefaultNav";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../components/Loading";
import { supabase } from "../../DB/supabase";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPass) {
      return toast.warn("Passwords do not match, please confirm your password.");
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { surname, name, phone },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (!data.user) {
        toast.error("Sign up failed. Please try again.");
        return;
      }

      if (data.user.identities && data.user.identities.length === 0) {
        toast.warning("A user with this email already exists, please login.");
        return;
      }

      const { error: rowError } = await supabase.from("user").upsert(
        {
          id: data.user.id,
          email: email.trim(),
          surname,
          name,
          phone,
         },
        { onConflict: "id" }
      );

      if (rowError) {
        console.error("user row insert failed:", rowError);
        toast.warning("Account created but profile save failed. You can update it later.");
      }

      toast.success("Signed up successfully!");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
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
            onSubmit={handleSignUp}
            className="w-full p-6 md:p-8 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="mb-6">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-Storepurple bg-purple-50 px-3 py-1 rounded-full mb-2">
                Get Started
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-dayone">
                Create Account
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Join OneStore for fast checkout and order tracking.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Surname
                </label>
                <input
                  required
                  type="text"
                  placeholder="Surname"
                  value={surname}
                  className="w-full py-2.5 px-3.5 text-sm text-gray-900 rounded-xl outline-none border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-Storepurple focus:ring-2 focus:ring-purple-100 transition-all"
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  First Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="First name"
                  value={name}
                  className="w-full py-2.5 px-3.5 text-sm text-gray-900 rounded-xl outline-none border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-Storepurple focus:ring-2 focus:ring-purple-100 transition-all"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
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
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                Phone Number (11 digits)
              </label>
              <input
                required
                type="tel"
                pattern="[0-9]{11}"
                minLength={11}
                maxLength={11}
                placeholder="08012345678"
                value={phone}
                className="w-full py-2.5 px-4 text-sm text-gray-900 rounded-xl outline-none border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-Storepurple focus:ring-2 focus:ring-purple-100 transition-all"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Password
                </label>
                <input
                  required
                  type="password"
                  minLength={6}
                  maxLength={72}
                  placeholder="Min. 6 chars"
                  value={password}
                  className="w-full py-2.5 px-3.5 text-sm text-gray-900 rounded-xl outline-none border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-Storepurple focus:ring-2 focus:ring-purple-100 transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Confirm Password
                </label>
                <input
                  required
                  type="password"
                  minLength={6}
                  placeholder="Repeat password"
                  value={confirmPass}
                  className="w-full py-2.5 px-3.5 text-sm text-gray-900 rounded-xl outline-none border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-Storepurple focus:ring-2 focus:ring-purple-100 transition-all"
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 text-center text-white text-sm font-bold rounded-xl bg-Storepurple hover:bg-StorepurpleDark transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center mt-6 text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href={ROUTES.LOGIN}
                className="font-semibold text-Storepurple hover:underline"
              >
                Sign In
              </a>
            </p>
          </form>
        </div>

        <div className="hidden lg:flex w-1/2 items-center justify-center">
          <img
            src="/img/undraw_blooming_re_2kc4.svg"
            alt="Sign up illustration"
            className="w-full max-w-md drop-shadow-sm"
          />
        </div>
      </div>

      <Footer />
      {loading && <Loading />}
      <ToastContainer theme="light" />
    </div>
  );
};

export default SignUp;
