/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ROUTES from "../../utils/Routes";
import { MdShoppingCart } from "react-icons/md";
interface AppComponent {
  category: any | string;
  categoryProducts: any;
  addToCart: any;
}
const Products: React.FC<AppComponent> = ({ category, categoryProducts, addToCart }) => {
  const token = localStorage.getItem("one_store_login");
  const User = localStorage.getItem("one_store_login");

  const priceFormat = new Intl.NumberFormat("en-US");

  // const addToCart = async (e: any, index: number) => {
  //   e.preventDefault();

  //   try {
  //     if (token) {
  //       const docRef = await addDoc(collection(db, "cart"), {
  //         ...categoryProducts[index],
  //         inStock: 1,
  //         cartId: token,
  //       });
  //       if (!docRef) {
  //         toast.error("item was not added to your cart");
  //       }

  //       toast.success("added to your cart");
  //       await delay(1300);
  //       window.location.reload();
  //     } else {
  //       toast.warn("please login to add item to your cart");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Error: Failed to signup");
  //   }
  // };

  return (
    <div className="w-full h-full md:p-1 bg-white">
      <h1 className="p-4 text-xl md:text-2xl text-gray-800 font-dayone">{category}</h1>

      <div className="w-full h-auto md:p-2 grid grid-flow-row grid-cols-3 md:grid-cols-4  bg-purple-100 items-center ">
        {categoryProducts &&
          categoryProducts.map((i: any, index: any) => (
            <div
              className="w-[125px] md:w-[180px] h-[223px] md:h-[270px] mx-auto md:mx-auto my-6 md:my-10 p-1 rounded-lg items-center flex flex-col bg-white cursor-pointer shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:scale-110"
              key={index}
            >
              <a
                href={`${ROUTES.PRODUCT}/${i.id}`}
                className="w-full h-auto mx-auto items-center flex flex-col"
              >
                <img
                  src={i.image}
                  alt="category"
                  className="m-auto w-full h-36 md:h-44 object-contain"
                />
                <p className="w-full px-2 text-[10px] md:text-sm truncate  text-slate-8 text-center font-bold ">
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
                      const cartItem = { ...i, inStock: 1, cartId: token };
                      addToCart(cartItem);
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

export default Products;
