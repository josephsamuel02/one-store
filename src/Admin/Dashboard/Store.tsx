/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import ROUTES from "../../utils/Routes";

import { getDocs, collection } from "firebase/firestore";
import { db } from "../../DB/firebase";
import DefaultNav from "../components/AdminNav";
import { useNavigate } from "react-router-dom";

const Store: React.FC = () => {
  const adminToken = localStorage.getItem("one_store_admin");
  const Navigate = useNavigate();

  const [Product, setProducts] = useState<any>();
  const priceFormat = new Intl.NumberFormat("en-US");
  const fetchProducts = async () => {
    await getDocs(collection(db, "products")).then((querySnapshot) => {
      const newData: any = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setProducts(newData);
    });
  };

  useEffect(() => {
    if (!adminToken) {
      Navigate(ROUTES.ADMIN_LOGIN);
    }
    fetchProducts();
  }, []);

  return (
    <>
      <DefaultNav />
      <div className="mx-auto w-full md:w-5/6 h-screen bg-white overflow-y-scroll scrollbar-hide">
        <div className="w-full mx-auto p-2 mt-28  h-full grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-3">
          {Product &&
            Product.map((i: any, index: number) => (
              <a
                className="w-5/6 md:w-80 h-96 mx-auto py-4 flex flex-col items-center rounded-md shadow-md hover:shadow-lg bg-white"
                href={`${ROUTES.ADMIN_PRODUCT_DETAILS}/${i.id}`}
                key={index}
              >
                <div className="w-full flex flex-col">
                  <img
                    src={i.image}
                    alt=""
                    className="mx-auto w-4/5 h-36 object-contain rounded"
                  />
                  <div className="mx-2 mt-4 w-full px-2  my-auto flex flex-col">
                    <p className="mx-1  py-1   text-base font-roboto font-semibold text-slate-800">
                      Product name:
                      <span className=" px-2 font-roboto font-normal">{i.name}</span>
                    </p>
                    <p className="mx-1 py-1 truncate text-base font-roboto font-semibold text-slate-800">
                      Price:
                      <span className="font-roboto font-normal">
                        ₦{priceFormat.format(i.price)}
                      </span>
                    </p>
                    <p className="mx-1 py-1  truncate text-base font-roboto font-semibold text-slate-800">
                      Quantity in stock:
                      <span className="font-roboto font-normal ">{i.inStock}</span>
                    </p>
                    <p className=" w-9/12 mx-1 py-1 truncate text-base font-roboto font-semibold text-slate-800">
                      Product ID:
                      <span className="font-roboto font-normal pl-1">{i.id}</span>
                    </p>
                    <div className="w-9/12 h-40">
                      <p className="mx-1  py-1 truncate  text-sm font-roboto font-semibold  text-slate-800">
                        Product Details:
                        <span className=" truncate px-2 font-roboto font-normal">
                          {i.productDetails}
                        </span>
                      </p>
                      <span className="p-1  font-nunito underline font-normal">..more</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}

          {/* {stocks == 0 &&
              Product.map((i: any, index: number) =>
                i.inStock == 0 ? (
                  <a
                    className="w-5/6 md:w-80 h-96 mx-auto py-4 flex flex-col items-center rounded-md shadow-md hover:shadow-lg bg-white"
                    href={`${ROUTES.ADMIN_PRODUCT_DETAILS}?product_id=${i.productId}`}
                    key={index}
                  >
                    <div className="w-full flex flex-col">
                      <img
                        src={i.image}
                        alt=""
                        className="mx-auto w-4/5 h-36  object-contain rounded"
                      />
                      <div className="mx-2 mt-4 w-full px-2  my-auto flex flex-col">
                        <p className="mx-1  py-1   text-base font-roboto font-semibold text-slate-800">
                          Product name:
                          <span className=" px-2 font-roboto font-normal">{i.name}</span>
                        </p>

                        <p className="mx-1 py-1 truncate text-base font-roboto font-semibold text-slate-800">
                          Price:
                          <span className="font-roboto font-normal">
                            {" "}
                            ₦{priceFormat.format(i.price)}
                          </span>
                        </p>

                        <p className="mx-1 py-1 truncate text-base font-roboto font-semibold text-slate-800">
                          Quantity in stock:
                          <span className="font-roboto font-normal">{i.inStock}</span>
                        </p>
                        <p className=" w-9/12 mx-1 py-1 truncate text-base font-roboto font-semibold text-slate-800">
                          Product ID:
                          <span className="font-roboto font-normal">{i.productId}</span>
                        </p>
                        <div className="w-9/12 h-40">
                          <p className="mx-1  py-1 truncate  text-sm font-roboto font-semibold  text-slate-800">
                            Product Details:
                            <span className=" truncate px-2 font-roboto font-normal">
                              {i.productDetails}
                            </span>
                          </p>
                          <span className="p-1  font-nunito underline font-normal">
                            ..more
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                ) : (
                  ""
                )
              )} */}
        </div>
      </div>
    </>
  );
};

export default Store;
