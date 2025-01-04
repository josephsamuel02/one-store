/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import ROUTES from "../../utils/Routes";
import DefaultNav from "../../components/DefaultNav";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import delay from "delay";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../DB/firebase";
import { useNavigate } from "react-router-dom";
import { GoEyeClosed } from "react-icons/go";
import { GoEye } from "react-icons/go";

const Login: React.FC = () => {
  const Navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const OneDay = new Date().getTime() + 1 * 24 * 60 * 60 * 1000;
  const Now = new Date().getTime();
  const fetchUser = async (e: any) => {
    e.preventDefault();

    try {
      await getDocs(collection(db, "user")).then((querySnapshot) => {
        const newData: any = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        if (!newData) {
          toast.warn("unable to login.", {
            position: "top-left",
          });
        }

        var index: any;

        newData.map((item: any, i: any) => {
          return item.email == userInfo.email ? (index = i) : null;
        });

        if (
          newData[index].email == userInfo.email &&
          newData[index].password == userInfo.password
        ) {
          localStorage.setItem("one_store_login", `${newData[index].id}`);
          localStorage.setItem("login_expiry_date", `${OneDay}`);
          toast.success("login successful");

          delay(1300);
          console.log(newData[index]);

          window.location.replace("/");
        }

        if (newData[index].password !== userInfo.password) {
          toast.error("incorrect login detail(s).", {
            position: "top-left",
          });
        }
      });
    } catch (error) {
      toast.warning("Unable to login, check credentials");
    }
  };

  useEffect(() => {
    const login_expiry_date = localStorage.getItem("login_expiry_date");
    if (Now < Number(login_expiry_date)) {
      Navigate("/");
    } else if (Now >= Number(login_expiry_date)) {
      Navigate("/login");
    }
  }, []);

  return (
    <div className="w-full h-full pt-16 md:pt-24 bg-purple-100">
      <DefaultNav />
      <div className="w-full h-auto md:pb-12 mt-10 flex flex-col md:flex-row items-center  ">
        <div className=" mx-auto py-2 h-auto w-auto md:w-1/2">
          <form
            action=""
            onSubmit={fetchUser}
            className="mx-auto p-10 md:w-96  flex flex-col bg-white rounded-md items-center"
          >
            <div className=" w-full flex h-auto">
              <p className="text-3xl mx-1 font-bold text-slate-800 text-left ">Login</p>
            </div>
            <input
              required
              type="email"
              placeholder="email"
              className=" w-full my-3  h-auto py-2 px-4 text-lg text-slate-800 rounded-md outline-none border-2 border-blue-600  focus:border-purple-700"
              onChange={(e) =>
                setUserInfo((prev: any) => ({ ...prev, email: e.target.value }))
              }
            />
            <div className="w-full my-3 h-auto py-2  text-lg text-slate-800 flex flex-row items-center rounded-md outline-none border-2 border-blue-600 focus:border-purple-700">
              <input
                required
                type={showPassword ? "password" : "text"}
                placeholder="password"
                className="w-full h-auto  px-4 text-lg text-slate-800  outline-none   "
                onChange={(e) =>
                  setUserInfo((prev: any) => ({ ...prev, password: e.target.value }))
                }
              />
              {!showPassword ? (
                <GoEyeClosed
                  size={20}
                  className="text-[#2319ac] mx-3"
                  onClick={() => setShowPassword(true)}
                />
              ) : (
                <GoEye
                  size={20}
                  className="text-[#2319ac] mx-3"
                  onClick={() => setShowPassword(false)}
                />
              )}
            </div>

            <div className=" mr-auto w-auto h-auto flex flex-row items-center">
              <input type="checkbox" name="remember me" id="" className="my-3 h-auto" />
              <p className="px-1 text-base text-slate-900">Remember me</p>
            </div>
            <button
              type="submit"
              className="w-full mx-auto px-6 py-2 my-4 text-center text-white  text-xl font-nunito  rounded-full bg-Storepurple hover:bg-purple-500 bg-gradient-to-r from-purple-500 hover:from-Storepurple transition-colors shadow-md"
            >
              Login
            </button>

            {/* <p className="mx-auto  text-base text-thin text-slate-700">
              <a
                href={ROUTES.FORGOTPASSWORD}
                className="mx-auto text-base underline text-blue-600"
              >
                Forgot password
              </a>
            </p> */}

            <p className="mx-auto my-3 text-base text-thin text-slate-700">
              Don't have an account?
              <a href={ROUTES.SIGNUP} className="mx-1 text-base  text-blue-800">
                Sign Up
              </a>
            </p>
          </form>
        </div>

        <div className=" m-auto pb-28 mx-auto h-auto w-1/2 items-center ">
          <img
            src="img/undraw_login_re_4vu2.svg"
            alt=""
            className=" m-auto mx-auto md:mx-1  w-full md:w-9/12 "
          />
        </div>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Login;
