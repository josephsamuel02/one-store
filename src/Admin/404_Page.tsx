import React from "react";

const Page404: React.FC = () => {
  return (
    <div className="w-full h-screen bg-slate-200 pt-20 items-center flex flex-col">
      {/* <h1 className="mx-auto my-2 items-center text-center text-6xl font-bold text-red-500">ERROR 404</h1> */}

      <img
        src="/img/undraw_page_not_found_re_e9o6.svg"
        alt="image"
        className="m-auto w-72 h-auto"
      />
      <p className="mx-auto py-12 text-lg font-dayone text-slate-700">
        Page Not Found! Return to home Page
      </p>
      <a
        href="/"
        className="mx-auto my-6 px-16 py-3 text-white text-base bg-blue-600 hover:bg-blue-500 rounded-md shadow hover:shadow-lg"
      >
        Home
      </a>
    </div>
  );
};

export default Page404;
