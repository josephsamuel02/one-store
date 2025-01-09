import React from "react";
import Footer from "../../components/Footer";
import DefaultNav from "../../components/DefaultNav";

const ForgotPassword: React.FC = () => {
  return (
    <div className="w-full h-full  pt-16 md:pt-24 bg-purple-100">
      <DefaultNav Cart={[]} />

      <div className="w-11/12 md:w-2/3 h-full my-auto py-20 mx-auto ">
        <form
          action=""
          className="mx-auto p-10 md:w-96  flex flex-col bg-white rounded-md items-center"
        >
          <div className="w-full flex h-auto">
            <p className="text-3xl mx-1 font-bold text-slate-800 text-left">
              Forgot Password?
            </p>
          </div>
          <p className="w-full mx-2 text-base text-thin text-slate-900">
            Enter your account email
          </p>
          <input
            type="text"
            placeholder="email"
            className=" w-full my-3  h-auto py-2 px-4 text-lg text-slate-800 rounded-md outline-none border-2 border-blue-600  focus:border-purple-700"
          />

          <button
            type="submit"
            className="w-full mx-auto px-6 py-2 my-4 text-center text-white  text-xl font-nunito  rounded bg-Storepurple hover:bg-purple-500 bg-gradient-to-r from-purple-500 hover:from-Storepurple transition-colors shadow-md"
          >
            Get Password
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
