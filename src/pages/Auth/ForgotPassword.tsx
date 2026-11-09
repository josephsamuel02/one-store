import React, { useState } from "react";
import Footer from "../../components/Footer";
import DefaultNav from "../../components/DefaultNav";
import ROUTES from "../../utils/Routes";
import { supabase } from "../../DB/supabase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Password reset instructions sent to your email.");
      setEmail("");
    } catch {
      toast.error("Unable to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col pt-16 md:pt-24 bg-gray-50">
      <DefaultNav Cart={[]} />

      <div className="flex-1 max-w-md w-full mx-auto px-4 py-12 flex items-center">
        <form
          onSubmit={handleReset}
          className="w-full p-6 md:p-8 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <span className="inline-block w-fit text-xs font-semibold uppercase tracking-wider text-Storepurple bg-purple-50 px-3 py-1 rounded-full mb-2">
            Account Recovery
          </span>
          <h1 className="text-2xl font-bold text-gray-900 font-dayone">
            Forgot Password?
          </h1>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Enter your account email and we&apos;ll send you a password reset link.
          </p>

          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
            Email Address
          </label>
          <input
            required
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-5 py-2.5 px-4 text-sm text-gray-900 rounded-xl outline-none border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-Storepurple focus:ring-2 focus:ring-purple-100 transition-all"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 text-center text-white text-sm font-bold rounded-xl bg-Storepurple hover:bg-StorepurpleDark transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <a
            href={ROUTES.LOGIN}
            className="text-center mt-5 text-sm font-semibold text-Storepurple hover:underline"
          >
            &larr; Back to Sign In
          </a>
        </form>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
