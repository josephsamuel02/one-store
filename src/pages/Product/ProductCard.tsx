/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getCart } from "../../Redux/Cart";
import { AppDispatch } from "../../Redux/store";
interface AppComponent {
  singleProduct: any;
}
const ProductCard: React.FC<AppComponent> = ({ singleProduct }) => {
  const priceFormat = new Intl.NumberFormat("en-US");
  const dispatch = useDispatch<AppDispatch>();
  const User = useSelector((state: any) => state.Auth.auth.data?.user_id);

  const [quantity, setQuantity] = useState(1);
  const [showBTN, setShowBTN] = useState(true);

  const addProduct = async () => {
    {
      const cartItem = { ...singleProduct, inStock: quantity };
      dispatch<any>(addToCart(cartItem));
      dispatch<any>(getCart());
      toast.success("Added to cart");
      setShowBTN(false);
      console.log(cartItem);
    }
  };
  // useEffect(() => console.log(singleProduct), []);

  return (
    <div className="w-11/12 md:w-10/12 h-auto mx-auto my-4 p-4 flex flex-col bg-white rounded-sm ">
      {singleProduct && (
        <div className="w-full h-auto mx-auto flex flex-col md:flex-row">
          <img
            src={singleProduct.image}
            alt={singleProduct.name}
            className="m-auto w-52 h-auto object-cover"
          />

          <div className="w-full md:w-2/5 mx-auto h-auto flex flex-col ">
            <h2 className="text-xl md:text-2xl py-1 md:py-12 text-gray-800 font-roboto break-words">
              {singleProduct.name}
            </h2>
            <h2 className="text-4xl py-3 text-gray-800 font-dayone   break-words">
              ₦{priceFormat.format(singleProduct.price)}
              {singleProduct.old_price != 0 && (
                <span className="pl-2 text-slate-600 text-xl text-decoration-line: line-through font-normal  ">
                  ₦
                  {priceFormat.format(
                    singleProduct.old_price != singleProduct.price && singleProduct.old_price
                  )}
                </span>
              )}
            </h2>

            <div className="w-full h-auto flex flex-row py-6 ">
              <p className="text-base text-black font-roboto">Quantity</p>
              <input
                className="mx-3 w-7 h-7 bg-Storepurple rounded shadow font-roboto font-bold text-white"
                type="button"
                value="-"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              />
              <p className="text-base text-black font-roboto">
                {singleProduct.inStock >= 1 ? quantity : 0}
              </p>

              <input
                className="mx-3 w-7 h-7 bg-Storepurple rounded shadow font-roboto font-bold text-white"
                type="button"
                value="+"
                onClick={() => setQuantity(quantity + 1)}
              />
            </div>

            {User && singleProduct.inStock >= 1 && showBTN && (
              <p
                className="mx-auto my-6 px-4 w-full h-auto py-4 text-xl  text-white font-roboto flex flex-row items-center bg-Storepurple hover:bg-purple-700 rounded-md cursor-pointer"
                onClick={() => addProduct()}
              >
                <span className="px-4">
                  <MdAddShoppingCart size={32} className="mx-auto  text-slate-50" />
                </span>

                <span className="mx-auto cursor-pointer">Add to cart</span>
              </p>
            )}
            {singleProduct.inStock < 1 && (
              <p className="mx-auto my-6 px-4 w-full h-auto py-4 text-xl  text-white font-roboto flex flex-row items-center bg-gray-500  rounded-md cursor-pointer">
                <span className="px-4">
                  <MdAddShoppingCart size={32} className="mx-auto  text-slate-50" />
                </span>

                <span className="mx-auto cursor-pointer">Out of stock</span>
              </p>
            )}
          </div>
        </div>
      )}
      <div className="w-full md:w-2/5 mx-auto md:mx-6 my-4 h-auto flex flex-col ">
        <div className="mx-auto w-full md:w-10/12 h-auto p-2 border-2 border-slate-300 rounded-md">
          <h3 className="text-xl py-3 text-slate-900 font-bold text-center border-b-2 border-slate-300">
            SELLER
          </h3>

          <p className=" p-3 text-2xl text-slate-900 font-bold">ONESTORE</p>
          {/* <h3 className="text-lg py-3 text-gray-800 font-bold text-center">
            Seller Performance
          </h3> */}
          {/* <ul className="w-full h-auto">
            <li className="text-md text-gray-800 px-3 py-1">
              Customer Rating: <span className="font-bold text-green-700">Excellent</span>
            </li>
            <li className="text-md text-gray-800 px-3 py-1">
              Order Fulfillment Rate: 
              <span className="font-bold  text-green-700">Excellent</span>
            </li>
            <li className="text-md text-gray-800 px-3 py-1">
              Quality Score:<span className="font-bold  text-green-700">Excellent</span>
            </li>
          </ul> */}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductCard;
