/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import CheckoutDetails from "../Checkout/CheckoutDetails";
import { toast, ToastContainer } from "react-toastify";
import ROUTES from "../../utils/Routes";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../DB/firebase";

interface AppComponent {
  cartItems: any;
  totalPrice: any;
  getCart: any;
}
const CartItems: React.FC<AppComponent> = ({ cartItems, totalPrice, getCart }) => {
  const token = localStorage.getItem("one_store_login");

  const priceFormat = new Intl.NumberFormat("en-US");
  const [ShowPrice] = useState<any>(true);
  const [Order, setOrder] = useState<any>();

  const [checkout, setCheckOut] = useState(false);

  const getOrders = async () => {
    try {
      const targetRef = collection(db, "order");
      const q = query(targetRef, where("userId", "==", token));
      const querySnapshot = await getDocs(q);

      const newData: any = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
      setOrder(newData[0]);
      // console.log(...newData);
    } catch (error) {
      console.log(" Unable to get data");
    }
  };
  const UpdateCartQuantity = async (id: string, q: number) => {
    try {
      await updateDoc(doc(db, "cart", id), { inStock: q });
      // await delay(900);
      // window.location.replace("/cart");
    } catch (error) {
      toast.error("unable increase product quantity quantity");
    }
  };

  const deleteCartItem = async (id: any) => {
    try {
      await deleteDoc(doc(db, "cart", id));
      getCart();
      toast.success("Item removed");

      // await delay(900);

      // window.location.reload();
    } catch (e) {
      toast.error("Error deleting document: ");
    }
  };

  const setT = () => {
    setCheckOut(true);
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <>
      {!checkout ? (
        <div className="w-full md:w-10/12 md:p-6 h-auto mx-auto my-4 p-4 flex flex-col bg-white ">
          <h3 className="text-2xl  md:text-3xl p-4 text-black font-bold font-dayone ">Cart</h3>
          {cartItems[0] &&
            cartItems.map((i: any) => (
              <div
                className="w-full h-auto my-2 flex flex-col bg-white rounded-md shadow-lg"
                key={i.id}
              >
                <div className="w-full h-auto flex flex-row">
                  <img
                    src={i.image}
                    alt={i.name}
                    className="w-32 h-32  mx-auto object-contain"
                  />

                  <div className="w-4/6 flex my-auto flex-col md:flex-row ">
                    <h3 className="text-md  md:text-lg p-2 text-black font-roboto ">
                      {i.name}
                    </h3>
                    <div className="w-64 h-auto flex flex-col ">
                      <h3 className="text-2xl py-2 text-black font-dayone">
                        ₦{priceFormat.format(i.price * i.inStock)}
                      </h3>
                      <div className="w-full h-auto flex flex-row py-6 ">
                        <input
                          className="mx-3 w-7 h-7 bg-Storepurple rounded shadow font-roboto font-bold text-white"
                          type="button"
                          value="-"
                          onClick={async () => {
                            const q = Number(i.inStock) - 1;
                            if (Number(i.inStock) > 1) {
                              await UpdateCartQuantity(i.id, q);
                            }
                          }}
                        />
                        <p className="text-base text-black font-roboto">{Number(i.inStock)}</p>

                        <input
                          className="mx-3 w-7 h-7 bg-Storepurple rounded shadow font-roboto font-bold text-white"
                          type="button"
                          value="+"
                          onClick={() => {
                            const q = Number(i.inStock) + 1;
                            UpdateCartQuantity(i.id, q);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="w-36 m-2 h-auto px-4 py-2 flex flex-row cursor-pointer items-center rounded-md hover:bg-slate-200 "
                  onClick={() => {
                    deleteCartItem(i.id);
                  }}
                >
                  <span>
                    <RiDeleteBin6Line size={24} className="text-red-600" />
                  </span>
                  <span className="text-xl px-3 text-red-600 ">Remove </span>
                </div>
              </div>
            ))}
          {!cartItems[0] && (
            <h3 className="text-2xl  md:text-3xl p-4 text-black font-bold font-dayone ">
              No Product in your cart
            </h3>
          )}

          <div className="mx-auto p-6 py-1 w-11/12 md:w-3/5 h-auto bg-white rounded-md">
            <h3 className="text-xl py-3 text-slate-900 font-bold">Notice</h3>
            <p className="text-md md:text-md text-slate-800 font-roboto font-thin">
              All products will be sent via a delivery agent, delivery cost will be covered by
              the buyer. delivery cost can also be negotiated between buyer and delivery agent.
            </p>
          </div>

          {totalPrice ? (
            <div className="w-full h-auto my-6 flex flex-col bg-white">
              {ShowPrice && (
                <div className=" flex py-3 flex-row ">
                  <h3 className="text-lg text-black px-3 font-roboto font-bold ">Total:</h3>
                  <h3 className="text-xl text-black font-dayone">
                    ₦{priceFormat.format(totalPrice)}
                  </h3>
                </div>
              )}
              <button
                className="w-2/5 h-auto py-3 text-lg text-center text-white font-bold cursor-pointer rounded bg-Storepurple hover:bg-purple-800 "
                onClick={() => {
                  setT();
                }}
              >
                Checkout
              </button>
            </div>
          ) : null}
          <div className="w-11/12 md:w-10/12 md:p-6 h-auto mx-auto my-4 p-4 flex flex-col bg-white ">
            <h3 className="text-2xl  md:text-3xl p-4 text-black font-bold font-dayone ">
              Pending orders orders
            </h3>
            {Order && (
              <div className="  h-auto my-2 flex flex-row items-center bg-white rounded-md shadow-lg cursor-pointer">
                <img
                  src={
                    Order.Products.length > 0
                      ? Order.Products[0].image
                      : "/img/shopping-cart.png"
                  }
                  // alt={i.Products[0].image}
                  className="w-20 h-20  mx-auto object-cover"
                />

                <div className="w-4/6 flex my-auto flex-col items-center md:flex-row ">
                  <h3 className="text-md  p-2 text-center text-black font-bold font-roboto ">
                    Items: {Order.Products.length}
                  </h3>
                </div>
                <a
                  className="text-md md:text-lg  md:px-6 text-center text-purple-700 font-roboto font-bold underline "
                  href={ROUTES.ORDERS}
                >
                  See Orders...
                </a>
              </div>
            )}
            {Order ? (
              <h3 className="text-lg p-4 text-black font-bold ">
                Orders status: {Order.orderLevel}
              </h3>
            ) : null}
          </div>
        </div>
      ) : (
        <CheckoutDetails CheckOutData={cartItems} TotalPrice={totalPrice} />
      )}
      <ToastContainer />
    </>
  );
};

export default CartItems;
