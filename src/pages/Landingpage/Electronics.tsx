/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ROUTES from "../../utils/Routes";
import { MdShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getCart } from "../../Redux/Cart";
import { AppDispatch } from "../../Redux/store";

interface AppComponent {
  Products: any;
}

const Electronics: React.FC<AppComponent> = ({ Products }) => {
  const priceFormat = new Intl.NumberFormat("en-US");
  const dispatch = useDispatch<AppDispatch>();
  const User = useSelector((state: any) => state.Auth.auth.data?.user_id);
  return (
    <div className="my-8 w-full h-auto">
      <div className="w-full h-auto py-5 flex flex-col border-y border-[#d7bfff] bg-white">
        <p className=" text-4xl text-[#4303a8] text-center font-RubikDistressed ">
          Electronics
        </p>
      </div>
      <div className="w-full h-auto my-1 px-0 md:px-5 py-1 md:py-3 grid grid-flow-row grid-cols-3 md:grid-cols-4 lg:grid-cols-5 bg-[#f0eaf52a] ">
        {Products &&
          Products.filter((i: any) => i.category === "electronics")
            .splice(0, 10)
            .map((i: any, index: number) => (
              <div
                className="w-[125px] md:w-[180px] h-[223px] md:h-[270px]  mx-auto md:mx-auto my-6 md:my-10 p-1 rounded-lg items-center flex flex-col bg-white cursor-pointer shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:scale-110"
                key={index}
              >
                <a
                  className="w-full h-auto mx-auto items-center flex flex-col"
                  href={`${ROUTES.PRODUCT}/${i.id}`}
                >
                  <img
                    src={i.image}
                    alt="category"
                    className="m-auto w-full h-36 md:h-44 object-contain"
                  />
                  <p className="w-full px-2 text-[10px] md:text-sm truncate  text-slate-8 text-center font-bold  ">
                    {i.name}
                  </p>

                  <h2 className=" text-[10px] md:text-sm py-1 text-black flex flex-col md:flex-row items-center">
                    ₦{priceFormat.format(i.price)}
                    {i.old_price != 0 && (
                      <span className="pl-2 text-slate-600 text-sm text-decoration-line: line-through font-normal  ">
                        {i.old_price != i.price && `₦${priceFormat.format(i.old_price)}`}
                      </span>
                    )}
                  </h2>

                  {User && (
                    <h2
                      className=" w-full py-2  bg-[#4303a8] hover:bg-[#6d35c7] flex flex-row  items-center rounded cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const cartItem = { ...i, inStock: 1 };
                        dispatch<any>(addToCart(cartItem));
                        dispatch<any>(getCart());
                        console.log({ ...i, inStock: 1 });
                      }}
                    >
                      <MdShoppingCart className="text-md text-white ml-auto" />

                      <span className="mr-auto  pl-2 text-white text-[11px] md:text-sm   font-normal  ">
                        Add to cart
                      </span>
                    </h2>
                  )}
                </a>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Electronics;
