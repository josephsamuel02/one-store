/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import ROUTES from "../../utils/Routes";
import delay from "delay";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../DB/firebase";
interface AppComponent {
  category: any | string;
  categoryProducts: any;
}
const Products: React.FC<AppComponent> = ({ category, categoryProducts }) => {
  const token = localStorage.getItem("one_store_login");

  const priceFormat = new Intl.NumberFormat("en-US");

  const addToCart = async (e: any, index: number) => {
    e.preventDefault();

    try {
      if (token) {
        const docRef = await addDoc(collection(db, "cart"), {
          ...categoryProducts[index],
          inStock: 1,
          cartId: token,
        });
        if (!docRef) {
          toast.error("item was not added to your cart");
        }

        toast.success("added to your cart");
        await delay(1300);
        window.location.reload();
      } else {
        toast.warn("please login to add item to your cart");
      }
    } catch (error) {
      toast.error("Error: Failed to signup");
    }
  };

  return (
    <div className="w-full h-full md:p-1 bg-white">
      <h1 className="p-4 text-xl md:text-2xl text-gray-800 font-dayone">{category}</h1>

      <div className="w-full h-auto md:p-2 grid grid-flow-row grid-cols-3 md:grid-cols-4  bg-purple-100 items-center ">
        {categoryProducts &&
          categoryProducts.map((i: any, index: any) => (
            <div
              className=" w-28 md:w-48 h-auto mx-auto  my-4 items-center flex flex-col bg-white cursor-pointer rounded"
              key={index}
            >
              <a
                className="w-full h-auto mx-auto items-center flex flex-col"
                href={`${ROUTES.PRODUCT}/${i.id}`}
              >
                <img
                  src={i.image}
                  alt="product image"
                  className="mx-auto w-full md:w-48 h-24 md:h-52 object-contain "
                />
                <p className=" line-clamp-1 p-1 text-xs md:text-md  text-gray-800">{i.name}</p>
                <p className=" pb-1 text-sm font-bold  text-gray-800">
                  ₦{priceFormat.format(i.price)}
                  {i.old_price != 0 && (
                    <span className="pl-2 text-slate-600 text-sm text-decoration-line: line-through font-normal  ">
                      {i.old_price != i.price && `₦${priceFormat.format(i.old_price)}`}
                    </span>
                  )}
                </p>
              </a>
              <p
                className=" w-full mx-0.5 py-1 text-center text-sm md:text-base text-white bg-Storepurple hover:bg-purple-800 rounded"
                onClick={(e) => {
                  addToCart(e, index);
                }}
              >
                Add to cart
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Products;
