import React from "react";
import DefaultNav from "../../components/DefaultNav";
// import CheckoutDetails from "./CheckoutDetails";

const Checkout: React.FC = () => {
  return (
    <div className="w-full h-full pt-16 md:pt-20  bg-purple-100">
      <DefaultNav />
      {/* <CheckoutDetails /> */}
    </div>
  );
};

export default Checkout;
