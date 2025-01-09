/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import ROUTES from "../../utils/Routes";
import OrdersMenu from "../components/OrdersMenu";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../DB/firebase";
import DefaultNav from "../components/AdminNav";
import { useNavigate } from "react-router-dom";

const Orders: React.FC = () => {
  const adminToken = localStorage.getItem("one_store_admin");
  const Navigate = useNavigate();
  const [orderPage, setOrderPage] = useState<any>(0);
  const [Orders, setOrders] = useState<any>();
  const priceFormat = new Intl.NumberFormat("en-US");

  const fetchOrders = async () => {
    await getDocs(collection(db, "order")).then((querySnapshot) => {
      const newData: any = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setOrders(newData);
    });
  };

  useEffect(() => {
    if (!adminToken) {
      Navigate(ROUTES.ADMIN_LOGIN);
    }
    fetchOrders();
  }, []);

  return (
    <>
      <DefaultNav />
      <OrdersMenu setOrderPage={setOrderPage} orderPage={orderPage} />

      <div className="w-full h-auto bg-white">
        <h3 className="mb-12 mt-32 mx-auto text-xl md:text-2xl text-purple-600   text-center  ">
          Purchase Requests
        </h3>

        <div className="w-full px-3 h-auto my-6 bg-white grid gap-4 grid-col grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Orders &&
            Orders.map((i: any, n: any) => (
              <>
                {i.orderLevel == orderPage && (
                  <div
                    className=" w-[200px] mx-auto mt-16 pb-6 px-3  rounded-lg shadow-md hover:shadow-lg"
                    key={n}
                  >
                    <div
                      className="  h-40 w-full  rounded-md items-center"
                      onClick={() => Navigate(`${ROUTES.ADMIN_ORDER_DETAILS}/${n}`)}
                    >
                      <img
                        src={i.Products[0].image}
                        alt="card-image"
                        className=" w-auto h-full  object-cover  mx-auto  "
                      />
                    </div>
                    <p className="flex py-4  items-center flex-row-reverse text-md text-brown-900 gap-1.5 font-normal">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="-mt-0.5 h-5 w-5 text-yellow-700"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                      ₦ {priceFormat.format(i.totalPrice)}
                    </p>
                    <div
                      className=" h-auto  line-clamp-10 "
                      onClick={() => Navigate(`${ROUTES.ADMIN_ORDER_DETAILS}/${n}`)}
                    >
                      <p className="line-clamp-3 font-roboto text-sm ">
                        {i.surname} {i.name}
                      </p>
                      <p className="line-clamp-3 font-roboto text-sm ">{i.email}</p>
                      <p className="line-clamp-3 font-roboto  text-sm  ">{i.phone}</p>
                      <p className="line-clamp-3 font-roboto  text-sm  ">
                        {i.alternativePhone}
                      </p>
                      <p className="line-clamp-3 font-roboto   text-sm ">{i.whatsappNumber}</p>
                      <p className="line-clamp-3 font-roboto  text-sm ">{i.state}</p>
                      <p className="line-clamp-3 font-roboto text-sm ">{i.lga}</p>
                      <p className="line-clamp-3 font-roboto text-sm ">{i.phone}</p>
                      <p className="line-clamp-3 font-roboto text-sm ">{i.deliveryAddress}</p>
                      <p className="line-clamp-3 font-roboto  text-sm  ">{i.paymentMedium}</p>
                    </div>
                    <div className=" w-full mt-4 mx-auto flex flex-row shadow-none ">
                      {/* <Tooltip
                        content="Call"
                        className=" mx-auto flex flex-row justify-center "
                      > */}
                      <a
                        href={ROUTES.CALLLINE}
                        color="green"
                        className=" w-[50px] mx-auto px-2 py-3 hover:bg-gray-200 flex flex-row   text-blue-600 font-lg uppercase rounded-full shadow-xl"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-7 h-7 mx-2 "
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                          />
                        </svg>
                      </a>
                      {/* </Tooltip> */}
                      {/* <Tooltip content=" whatsapp Chat"> */}
                      <a
                        href={ROUTES.WHATSAPP}
                        color="green"
                        className="w-[50px] mx-auto px-2 py-3 text-green-600 hover:bg-gray-200 flex flex-row   font-lg uppercase rounded-full shadow-xl"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-7 h-7 mx-2 "
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                          />
                        </svg>
                      </a>
                      {/* </Tooltip> */}
                      {/* <Tooltip content="Email"> */}
                      <a
                        href="#call"
                        color="red"
                        className="w-[50px] mx-auto px-2 py-3 hover:bg-gray-200 flex flex-row   font-lg uppercase rounded-full shadow-xl"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-7 h-7 mx-2 "
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                          />
                        </svg>
                      </a>
                      {/* </Tooltip> */}
                    </div>
                  </div>
                )}
              </>
            ))}
        </div>
      </div>
    </>
  );
};

export default Orders;
