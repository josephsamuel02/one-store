import React from "react";
import ROUTES from "../utils/Routes";

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-28 bg-white p-8">
      <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-white text-center md:justify-between">
        <img src="/img/OneStore logo.svg" alt="logo-ct" className="mx-20 w-44 h-auto" />
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
          <li>
            <p className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500">
              <a href={ROUTES.LANDINGPAGE}> Home</a>
            </p>
          </li>
          <li>
            <p
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              <a href={ROUTES.ABOUTUS}> About Us</a>
            </p>
          </li>
          {/* <li>
            <p
             
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              Contact Us
            </p>
          </li> */}
          <li>
            <p
              color="blue-gray"
              className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              <a href={ROUTES.ADMIN_LOGIN}> Admin</a>
            </p>
          </li>
        </ul>
      </div>
      <hr className="my-8 border-blue-gray-50" />
      <p color="blue-gray" className="text-center font-normal">
        &copy; 2024 One Store
      </p>
    </footer>
  );
};

export default Footer;
