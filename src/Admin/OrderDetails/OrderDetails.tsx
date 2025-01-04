/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../DB/firebase";
import ROUTES from "../../utils/Routes";
import DefaultNav from "../components/AdminNav";
import Footer from "../../components/Footer";
import delay from "delay";
import { toast } from "react-toastify";

const AdminOrderDetails: React.FC = () => {
  const { id }: any = useParams();
  const priceFormat = new Intl.NumberFormat("en-US");

  const adminToken = localStorage.getItem("one_store_admin");
  const Navigate = useNavigate();
  const [Orders, setOrders] = useState<any>();
  // const [newValue, setNewValue] = useState<any>();

  const fetchOrders = async () => {
    await getDocs(collection(db, "order")).then((querySnapshot) => {
      const newData: any = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setOrders(newData[id]);
      // setNewValue(newData[id]);
    });
  };

  const UploadProduct = async (e: any) => {
    e.preventDefault();

    const docRef = doc(db, "order", Orders.id);
    updateDoc(docRef, { ...Orders, orderLevel: Orders.orderLevel + 1 })
      .then(async () => {
        toast.success("Document updated successfully!");
        delay(2000);
        window.location.reload();
      })
      .catch((error) => {
        toast.error("Error updating document");
        console.log(error);
        delay(1300);
        window.location.reload();
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
      <div className="w-full h-screen bg-white overflow-y-scroll scrollbar-hide">
        <DefaultNav />
        <div className="w-full md:w-11/12 p-4 mx-auto mt-12 md:mt-28 h-full flex flex-col">
          <h3 className="mx-6 mb-4 text-2xl   text-slate-800 font-dayone">Order Details</h3>

          {Orders && (
            <div className="w-full py-10 flex flex-col border-2">
              <h3 className="mx-6 py-2 text-base   text-slate-800 font-roboto font-bold">
                Customer Name:
                <span className="px-2 font-normal">
                  {Orders.surname} {Orders.name}
                </span>
              </h3>

              <h3 className="mx-6 py-2 text-base   text-slate-800 font-roboto font-bold">
                Customer Phone:
                <span className="px-2 font-normal">{Orders.email}</span>
              </h3>

              <h3 className="mx-6 py-2 text-base   text-slate-800 font-roboto font-bold">
                Customer Phone:
                <span className="px-2 font-normal">{Orders.phone}</span>
              </h3>

              <h3 className="mx-6 py-2 text-base   text-slate-800 font-roboto font-bold">
                Alternative phone lines:
                <span className="px-2 font-normal">{Orders.alternativePhone}</span>
              </h3>

              <h3 className="mx-6 py-2 text-base   text-slate-800 font-roboto font-bold">
                Whatsapp line:
                <span className="px-2 font-normal">{Orders.whatsappNumber}</span>
              </h3>
              <h3 className="mx-6 py-2 text-base   text-slate-800 font-roboto font-bold">
                Order ID: <span className="px-2 font-normal">{Orders.id}</span>
              </h3>
              <h3 className="mx-6 py-2 text-base   text-slate-800 font-roboto font-bold">
                Delivery address:
                <span className="px-2 font-normal">{Orders.deliveryAddress}</span>
              </h3>
              <h3 className="mx-6 py-2 text-base   text-slate-800 font-roboto font-bold">
                Total price:
                <span className="px-2 font-normal">
                  ₦{priceFormat.format(Orders.totalPrice)}
                </span>
              </h3>
              <h3 className="mx-6 py-2 text-base   text-slate-800 font-roboto font-bold items-center flex flex-row flex-wrap">
                Status:
                {Orders.orderLevel == 0 && (
                  <span className=" mx-2 my-1 px-4 py-1 text-sm md:text-base text-black hover:text-white font-normal bg-yellow-300 hover:bg-yellow-700 shadow-md rounded cursor-pointer">
                    Pending
                  </span>
                )}
                {Orders.orderLevel == 1 && (
                  <span className=" mx-2 my-1 px-4 py-1 text-sm md:text-base  text-white font-normal bg-purple-500 hover:bg-purple-700 shadow-md rounded cursor-pointer">
                    Confirmed
                  </span>
                )}
                {Orders.orderLevel == 2 && (
                  <span className=" mx-2 my-1 px-4 py-1 text-sm md:text-base  text-white font-normal bg-blue-500 hover:bg-blue-700 shadow-md rounded cursor-pointer">
                    Shipped
                  </span>
                )}
                {Orders.orderLevel == 3 && (
                  <span className=" mx-2 my-1 px-4 py-1 text-sm md:text-base  text-white font-normal bg-green-500 hover:bg-green-700 shadow-md rounded cursor-pointer">
                    Complete
                  </span>
                )}
                {Orders.orderLevel < 3 && "Next ->>"}
                {Orders.orderLevel < 3 && (
                  <span
                    className=" mx-2 my-1 px-4 py-1 text-sm md:text-base  text-black font-normal bg-white hover:bg-[#d8d6d6ad] shadow-md rounded cursor-pointer"
                    onClick={(e) => {
                      UploadProduct(e);
                    }}
                  >
                    {Orders.orderLevel == 0
                      ? "Confirmed"
                      : Orders.orderLevel == 1
                      ? "Shipped"
                      : Orders.orderLevel == 2
                      ? "Complete"
                      : null}
                  </span>
                )}
              </h3>
              <h3 className="mx-6 py-2 text-base   text-slate-800 font-roboto font-bold">
                Date:
                <span className="px-2 font-normal">{Orders.date}</span>
              </h3>
              <div className="w-full flex my-4 px-3 flex-col border-2 ">
                <h3 className="mx-6 my-2 text-xl text-slate-800 font-dayone">
                  Products:
                  <span className=" mx-2 px-2 py-1 w-2 h-2 bg-purple-500 text-sm  text-white   rounded-full">
                    {Orders.Products.length}
                  </span>
                </h3>

                {Orders &&
                  Orders.Products.map((i: any, index: number) => (
                    <div
                      className="w-full h-auto mx-auto my-3 py-6 flex flex-col md:flex-row  first-line: border-2 hover:shadow-lg bg-white"
                      key={index}
                    >
                      <div className="mx-auto w-3/5 md:w-2/5  flex flex-col md:flex-row">
                        <img
                          src={i.image}
                          alt=""
                          className="w-full h-52 object-contain rounded"
                        />
                      </div>

                      <div className="p-2 md:w-4/5 h-auto flex flex-col">
                        <p className="mx-3 py-3 text-base font-roboto font-bold text-slate-800">
                          Product Name:
                          <span className="pl-2 font-roboto text-base font-normal">
                            {i.name}
                          </span>
                        </p>
                        <p className="mx-3 py-3 text-base font-roboto font-bold text-slate-800">
                          Price:
                          <span className="pl-2 font-roboto text-xl font-normal">
                            ₦ {i.price}
                          </span>
                        </p>
                        <p className="mx-3 py-3 text-base font-roboto  text-slate-800">
                          Quantity:
                          <span className="pl-2 font-roboto text-xl font-normal">
                            {i.inStock}
                          </span>
                        </p>
                        <p className="mx-3 py-3 text-base font-roboto font-bold text-slate-800">
                          Product Details:
                          <span className=" pl-2 font-roboto text-base font-normal">
                            {i.productDetails}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminOrderDetails;
