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
    <div className="w-full h-full pt-16 md:pt-24 bg-purple-100">
      <DefaultNav Cart={[]} />

      <div className="w-full h-auto mt-10 flex flex-col md:flex-row items-center">
        <div className="mx-auto py-2 h-auto w-auto md:w-1/2">
          <form
            onSubmit={handleSignUp}
            className="mx-auto p-10 w-11/12 md:w-96 flex flex-col bg-white rounded-md shadow-xl"
          >
            <h2 className="mx-1 my-1 text-3xl font-bold text-slate-800">Sign Up</h2>

            <div className="mx-auto h-auto w-auto flex flex-row">
              <input
                required
                type="text"
                placeholder="Surname"
                value={surname}
                className="w-full my-3 mr-1 h-auto py-2 px-4 text-lg text-slate-800 rounded-md outline-none border-2 border-blue-600 focus:border-purple-700"
                onChange={(e) => setSurname(e.target.value)}
              />
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                className="w-full my-3 ml-1 h-auto py-2 px-4 text-lg text-slate-800 rounded-md outline-none border-2 border-blue-600 focus:border-purple-700"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              className="w-full my-3 h-auto py-2 px-4 text-lg text-slate-800 rounded-md outline-none border-2 border-blue-600 focus:border-purple-700"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              required
              type="tel"
              pattern="[0-9]{11}"
              minLength={11}
              maxLength={11}
              placeholder="Phone number"
              value={phone}
              className="w-full my-3 h-auto py-2 px-4 text-lg text-slate-800 rounded-md outline-none border-2 border-blue-600 focus:border-purple-700"
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              required
              type="password"
              minLength={6}
              maxLength={72}
              placeholder="Password"
              value={password}
              className="w-full my-3 h-auto py-2 px-4 text-lg text-slate-800 rounded-md outline-none border-2 border-blue-600 focus:border-purple-700"
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              required
              type="password"
              minLength={6}
              placeholder="Confirm password"
              value={confirmPass}
              className="w-full my-3 h-auto py-2 px-4 text-lg text-slate-800 rounded-md outline-none border-2 border-blue-600 focus:border-purple-700"
              onChange={(e) => setConfirmPass(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mx-auto px-6 py-2 my-4 text-center text-white text-xl font-nunito rounded-full bg-Storepurple hover:bg-purple-500 bg-gradient-to-r from-purple-500 hover:from-Storepurple transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Register"}
            </button>

            <p className="mx-auto my-3 text-base text-thin text-slate-700">
              Already have an account?{" "}
              <a href={ROUTES.LOGIN} className="text-base text-blue-800">
                Login
              </a>
            </p>
          </form>
        </div>

        <div className="m-auto pb-28 mx-auto h-auto w-1/2 items-center">
          <img src="img/undraw_blooming_re_2kc4.svg" alt="" className="m-auto" />
        </div>
      </div>

      <Footer />
      {loading && <Loading />}
      <ToastContainer theme="light" />
    </div>
  );
};

export default SignUp;
