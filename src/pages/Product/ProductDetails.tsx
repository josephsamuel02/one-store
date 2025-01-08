/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
interface AppComponent {
  singleProduct: any;
}
const ProductDetails: React.FC<AppComponent> = ({ singleProduct }) => {
  return (
    <div className="mx-auto p-6 md:p-10 w-11/12 md:w-10/12 h-auto bg-white rounded-md">
      <h3 className="text-xl py-3 text-slate-900 font-bold">Product Details</h3>
      {singleProduct && (
        <p className="text-sm md:text-md leading-6 text-slate-800 font-roboto font-thin">
          {singleProduct.productDetails}
        </p>
      )}
    </div>
  );
};

export default ProductDetails;
