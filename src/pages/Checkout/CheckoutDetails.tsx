/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from "react";
import OrderConfirmedCard from "../../components/OrderConfirmedCard";
import { getDocs, collection, addDoc, doc, deleteDoc, query, where } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import { db } from "../../DB/firebase";

import PayOfflineCard from "./payOfflineCard";

interface AppComponent {
  CheckOutData: any;
  TotalPrice: any;
}

const CheckoutDetails: React.FC<AppComponent> = ({ CheckOutData, TotalPrice }) => {
  const Cart = CheckOutData;
  const token = localStorage.getItem("one_store_login");
  const priceFormat = new Intl.NumberFormat("en-US");
  const [showCard, setShowCard] = useState(false);
  const [TPrice, seTPrice] = useState(TotalPrice);
  const [showOfflinePaymentCard, setShowOfflinePaymentCard] = useState(false);

  const [userInfo, setUserInfo] = useState<any>({
    name: "",
    deliveryAddress: "",
    phone: "",
    alternativePhone: "",
    whatsappNumber: "",
  });
  const [orderItem, setOrderItem] = useState<any>();

  // const TOTAL = TotalPrice * 100;

  const fetchUser = async () => {
    try {
      await getDocs(collection(db, "user")).then((querySnapshot) => {
        const newData: any = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        if (!newData) {
          toast.warn("unable to login.", {
            position: "top-left",
          });
        }

        var index: any;

        const user = newData.map((item: any) => {
          return item.id === token ? (index = item) : null;
        });
        setUserInfo(index);

        if (!user) {
          toast.error("please login.", {
            position: "top-left",
          });
          window.location.replace("/login");
        }
      });
    } catch (error) {
      console.error(" Unable to login", error);
    }
  };

  const addToOrder = async (paymentMedium: string) => {
    try {
      const docRef = await addDoc(collection(db, "order"), {
        ...orderItem,
        ...userInfo,
        paymentMedium: paymentMedium,
      });
      if (!docRef) {
        toast.error("Error");
      } else {
        // Specify the collection where you want to search for documents
        const targetRef = collection(db, "cart");
        const q = query(targetRef, where("cartId", "==", token));

        // Get the documents that match the query
        getDocs(q)
          .then((querySnapshot) => {
            querySnapshot.forEach((document) => {
              // Get the reference to the document
              const docRef = doc(db, document.ref.path);

              // Delete the document
              deleteDoc(docRef)
                .then(() => {
                  console.log(" successful!");
                })
                .catch((error) => {
                  toast.error("An error occurred");
                  console.log(error);
                });
            });
          })
          .catch((error) => {
            console.error("Error getting documents: ", error);
          });
      }
    } catch (error) {
      toast.error("unable to order cart ");
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.replace("/");
      console.log(TotalPrice, Cart);
    }
    const currDate = new Date().toLocaleDateString();
    const currTime = new Date().toLocaleTimeString();
    // console.log(currDate, currTime);
    fetchUser();
    setOrderItem({
      Products: Cart,
      userId: token,
      totalPrice: TotalPrice,
      orderLevel: 0,
      date: `${currTime} at ${currDate}`,
      OrderId: Math.floor(Math.random() * 1000000000),
    });
  }, []);

  useEffect(() => seTPrice(TotalPrice), [TotalPrice]);

  // const config = {
  //   reference: new Date().getTime().toString(),
  //   email: "user@example.com",
  //   amount: TOTAL, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
  //   publicKey: "pk_test_a507bd6845bb5cad347a591e06e88c6fde817cc1",
  // };

  // const onSuccess: any = () => {
  //   addToOrder("online_payment");
  //   delay(1300);
  //   // setShowCard(true);
  //   // delay(700);
  //   window.location.replace(ROUTES.ORDERS);
  // };

  // const onClose: any = () => {
  //   console.log("closed");
  // };
  // const initializePayment = usePaystackPayment(config);

  return (
    <div className="mx-auto  w-full md:w-4/5 h-full bg-purple-50">
      <h3 className="text-2xl  md:text-3xl p-4 text-black font-dayone ">Check Out</h3>

      <div className="w-full px-2 h-full flex flex-col md:flex-row">
        <div className="mx-auto my-2 md:my-0 py-2 w-full md:w-2/5 h-full flex flex-col bg-white rounded">
          {Cart &&
            Cart.map((i: any, index: number) => (
              <div
                className="mx-auto  w-11/12 h-auto my-2 flex flex-col bg-white rounded-sm shadow-md"
                key={index}
              >
                <div className="w-full h-auto flex flex-row">
                  <img src={i.image} alt={i.name} className="w-20 h-20 object-contain" />

                  <div className=" w-10/12  flex my-auto flex-col px-2 ">
                    <h3 className="text-sm  truncate md:text-sm p-2 text-black font-roboto ">
                      {i.name}
                    </h3>

                    <h3 className="text-sm  md:text-sm font-bold  py-2 text-slate-800 font-roboto">
                      ₦{priceFormat.format(i.price)}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          <div className="mx-auto w-full  flex flex-row bg-white ">
            <h3 className=" mx-auto text-xl   p-4 text-black font-roboto font-bold ">Total</h3>
            <h4 className=" mx-auto text-xl   p-4 text-black font-roboto font-bold ">
              ₦ {priceFormat.format(TotalPrice)}
            </h4>
          </div>
        </div>

        <div className="mx-auto md:mx-2 py-2 w-full md:w-3/5 h-auto bg-white ">
          <h3 className="text-xl md:text-2xl   p-4 text-black font-roboto font-bold ">
            Details
          </h3>
          <div className="mx-3  w-full    h-auto  ">
            <p className="text-lg p-1 text-black font-roboto font-bold ">
              Recepient:
              <span className="font-normal text-black">
                {userInfo.surname} {userInfo.name}
              </span>
            </p>
            {/* <p className="text-lg  p-1 text-black font-roboto font-bold ">
              Order Id: <span className="font-normal text-black">666848m848</span>
            </p> */}

            <p className="text-lg  p-1 text-black font-roboto font-bold flex flex-row  items-center">
              Contacts numbers:
              <span className="mx-1 font-normal text-black">{userInfo.phone}</span>
            </p>
            <p className="text-sm p-1 text-black font-roboto  flex flex-col ">
              whatsapp number(optional):
              <textarea
                draggable={false}
                placeholder={"whatsapp number "}
                onChange={(e) =>
                  setUserInfo((prev: any) => ({ ...prev, whatsappNumber: e.target.value }))
                }
                className="  my-auto w-52 h-8 p-1  text-sm text-slate-800 font-normal focus:outline-none  resize-none no-scrollbar border-2 border-gray-300 rounded-md"
              ></textarea>
            </p>
            <p className="text-sm p-1 text-black font-roboto  flex flex-col ">
              Add alternative numbers:
              <textarea
                draggable={false}
                placeholder={""}
                onChange={(e) =>
                  setUserInfo((prev: any) => ({ ...prev, alternativePhone: e.target.value }))
                }
                className="  my-auto w-52 h-8 p-1  text-sm text-slate-800 font-normal focus:outline-none  resize-none no-scrollbar border-2 border-gray-300 rounded-md"
              ></textarea>
            </p>
            <p className="text-lg  p-1 text-black font-roboto font-bold flex flex-col">
              Delivery address:
              <textarea
                draggable={false}
                placeholder={"address... "}
                onChange={(e) =>
                  setUserInfo((prev: any) => ({ ...prev, deliveryAddress: e.target.value }))
                }
                className=" my-auto w-52 h-12 p-1  text-sm text-slate-800 font-normal focus:outline-none resize-none no-scrollbar border-2 border-gray-300 rounded-md"
              ></textarea>
            </p>
          </div>

          <div className="m-6 p-2 w-10/11 h-auto border-2 border-yellow-300 bg-yellow-50 rounded-md">
            <h3 className="text-xl m-2 text-black font-roboto font-bold ">Note</h3>
            <p className="px-2 text-base font-roboto text-slate-900">
              Orders will be sent via a delivery agent, delivery cost will be coved by buyer.
              delivery cost can also be negotiated between buyer and delivery agent.
            </p>
          </div>

          <div className="mx-3 w-full h-auto  ">
            <h3 className="text-lg m-4 text-black font-roboto font-bold ">Payment Method</h3>
            <div
              className="m-3  w-1/2 h-auto border-2 border-purple-400 bg-purple-100 hover:bg-purple-200 cursor-pointer  rounded"
              onClick={() => {
                // initializePayment(onSuccess, onClose);
                toast("Online payment not available at the moment");
              }}
            >
              <h3 className="text-xl p-4 text-black font-roboto font-bold ">Pay Online</h3>
            </div>
            <div
              onClick={() => {
                setShowOfflinePaymentCard(true);
                addToOrder("offline_payment");
              }}
              className="m-3  w-1/2 h-auto  border-2 border-purple-400 bg-purple-100 hover:bg-purple-200 cursor-pointer  rounded"
            >
              <h3 className="text-xl p-4 text-black font-roboto font-bold ">Pay Offline</h3>
            </div>
          </div>
        </div>
      </div>
      <OrderConfirmedCard showCard={showCard} setShowCard={setShowCard} />
      {showOfflinePaymentCard && (
        <PayOfflineCard
          setShowCard={setShowOfflinePaymentCard}
          TotalPrice={TPrice}
          OrderId={orderItem.OrderId}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default CheckoutDetails;
