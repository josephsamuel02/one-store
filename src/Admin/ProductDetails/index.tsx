/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ROUTES from "../../utils/Routes";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../DB/firebase";
import DefaultNav from "../components/AdminNav";

const AdminProductDetails: React.FC = () => {
  // const productId = new URLSearchParams(location.search).get("product_id");
  const { id } = useParams<{ id: string }>();
  const [Product, setProduct] = useState<any>([]);
  const priceFormat = new Intl.NumberFormat("en-US");

  useEffect(() => {
    const docRef = doc(db, "products", id!);

    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          // Document found, you can access its data

          const data = docSnap.data();
          setProduct([data]);
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
      });
  }, []);

  return (
    <div className="w-full h-screen bg-white overflow-y-scroll scrollbar-hide">
      <DefaultNav />

      <div className="w-full md:w-11/12 p-4 mx-auto mt-12 md:mt-28 h-full flex flex-col">
        <h3 className="mx-6 mb-4 text-2xl md:text-3xl text-slate-800 font-dayone">
          Product Details
        </h3>

        <div className="w-full  flex flex-col border-2 rounded">
          {Product &&
            Product.map((i: any, index: any) => (
              <div
                className="w-full h-auto mx-auto my-3 py-6 flex flex-col md:flex-row  bg-white"
                key={index}
              >
                <div className="mx-auto w-3/5 md:w-2/5  flex flex-col md:flex-row">
                  <img src={i.image} alt="" className="w-full h-52 object-contain rounded" />
                </div>

                <div className="p-2 md:w-4/5 h-auto flex flex-col">
                  <p className="mx-3 py-3 text-lg font-roboto font-bold text-slate-800">
                    Product Name:
                    <span className="pl-2 font-roboto text-base font-normal">{i.name}</span>
                  </p>
                  <p className="mx-3 py-3 text-lg font-roboto font-bold text-slate-800">
                    Price:
                    <span className="pl-2 font-roboto text-xl font-normal">
                      ₦{priceFormat.format(i.price)}
                    </span>
                  </p>

                  <p className="mx-3 py-3 text-lg font-roboto font-bold text-slate-800">
                    Quantity in stock:
                    <span className="pl-2 font-roboto text-xl font-normal">{i.inStock}</span>
                  </p>

                  <p className="mx-3 py-3 text-lg font-roboto font-bold text-slate-800">
                    Product Details:
                    <span className=" pl-2 font-roboto text-base font-normal">
                      {i.productDetails}
                    </span>
                  </p>

                  {/* <ul className="mx-3 my-10 py-3 text-sm font-roboto text-slate-800 list-disc">
                      <h3 className=" py-2 text-lg text-slate-800 font-roboto font-bold">
                        Description & features
                      </h3>
                      {i.keyFeatures.map((i: string, index: number) => (
                        <li className="py-1 font-roboto text-base" key={index}>
                          {i}
                        </li>
                      ))}
                    </ul> */}
                  <a
                    href={`${ROUTES.ADMIN_EDIT_PRODUCT}/${id}`}
                    className="w-3/5 mx-auto py-3 text-lg text-center font-roboto text-white rounded bg-Storepurple hover:bg-purple-800 cursor-pointer"
                  >
                    Edit product
                  </a>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetails;
