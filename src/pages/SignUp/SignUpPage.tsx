/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from "react";
import Footer from "../../components/Footer";
import ROUTES from "../../utils/Routes";
import DefaultNav from "../../components/DefaultNav";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import delay from "delay";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../DB/firebase";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../components/Loading";

const SignUp: React.FC = () => {
  const Navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>({
    surname: "",
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [confirmPass, setConfirmPass] = useState<any>("");
  const [loading, setLoading] = useState(false);

  const SignUP = async (e: any) => {
    e.preventDefault();

    try {
      const q = query(collection(db, "user"), where("email", "==", userInfo.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return toast.warning("user wth this email already exist, please login");
      }

      if (confirmPass !== userInfo.password) {
        return toast.warn("Password is not the same value, please confirm your password.", {
          position: "top-left",
        });
      }

      if (confirmPass == userInfo.password) {
        setLoading(true);
        const docRef = await addDoc(collection(db, "user"), userInfo);
        if (!docRef) {
          return toast.error("Unable to Sign up");
        }
        setLoading(false);
        toast.success("Signed up successfully");
        await delay(1200);
        Navigate("/login");
      }
    } catch (error) {
      toast.error("Error: Failed to signup");
    }
  };

  return (
    <div className="w-full h-full pt-16 md:pt-24 bg-purple-100">
      <DefaultNav />

      <div className="w-full h-auto mt-10 flex flex-col md:flex-row items-center  ">
        <div className=" mx-auto py-2 h-auto w-auto md:w-1/2">
          <form
            action=""
            onSubmit={SignUP}
            className="mx-auto p-10 w-11/12 md:w-96 flex flex-col bg-white rounded-md shadow-xl "
          >
            <h2 className="mx-1 my-1 text-3xl font-bold text-slate-800">Sign Up</h2>

            <div className=" mx-auto h-auto w-auto flex flex-row ">
              <input
                required
                type="text"
                placeholder="Surname"
                className=" w-full my-3 mr-1 h-auto py-2 px-4 text-lg  text-slate-800 rounded-md outline-none border-2 border-blue-600 focus:border-purple-700"
                onChange={(e) =>
                  setUserInfo((prev: any) => ({ ...prev, surname: e.target.value }))
                }
              />
              <input
                required
                type="text"
                placeholder="Name"
                className=" w-full my-3 ml-1 h-auto py-2 px-4 text-lg  text-slate-800 rounded-md outline-none border-2 border-blue-600 focus:border-purple-700"
                onChange={(e) =>
                  setUserInfo((prev: any) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <input
              required
              type="email"
              placeholder="email"
              className=" w-full my-3  h-auto py-2 px-4 text-lg  text-slate-800 rounded-md outline-none border-2 border-blue-600 focus:border-purple-700"
              onChange={(e) =>
                setUserInfo((prev: any) => ({ ...prev, email: e.target.value }))
              }
            />

            <input
              required
              type="tel"
              pattern="[0-9]{11}"
              minLength={11}
              maxLength={11}
              placeholder="Phone number"
              className=" w-full my-3  h-auto py-2 px-4 text-lg  text-slate-800 rounded-md outline-none border-2 border-blue-600 focus:border-purple-700"
              onChange={(e) =>
                setUserInfo((prev: any) => ({ ...prev, phone: e.target.value }))
              }
            />
            <input
              required
              type="password"
              minLength={3}
              maxLength={21}
              placeholder="password"
              className=" w-full my-3  h-auto py-2 px-4 text-lg  text-slate-800 rounded-md outline-none border-2 border-blue-600 focus:border-purple-700"
              onChange={(e) =>
                setUserInfo((prev: any) => ({ ...prev, password: e.target.value }))
              }
            />

            <input
              required
              type="password"
              placeholder="confirm password"
              className=" w-full my-3  h-auto py-2 px-4 text-lg  text-slate-800 rounded-md outline-none border-2 border-blue-600 focus:border-purple-700"
              onChange={(e) => setConfirmPass(e.target.value)}
            />

            <button
              type="submit"
              className="w-full mx-auto px-6 py-2 my-4 text-center text-white  text-xl font-nunito  rounded-full   bg-Storepurple hover:bg-purple-500 bg-gradient-to-r from-purple-500 hover:from-Storepurple transition-colors shadow-md"
              //   onClick={() => handleLogout()}
            >
              Register
            </button>

            <p className="mx-auto my-3 text-base text-thin text-slate-700">
              Already have an account?
              <a href={ROUTES.LOGIN} className="mx-auto text-base  text-blue-800">
                Login
              </a>
            </p>
          </form>
        </div>

        <div className=" m-auto pb-28 mx-auto h-auto w-1/2 items-center ">
          <img src="img/undraw_blooming_re_2kc4.svg" alt="" className=" m-auto " />
        </div>
      </div>

      <Footer />

      {loading && <Loading />}
      <ToastContainer theme="light" />
    </div>
  );
};

export default SignUp;
