/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import ROUTES from "../utils/Routes";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../DB/firebase";
import { MdOutlineLocalGroceryStore, MdPersonOutline } from "react-icons/md";

interface AppComponent {
  Cart: any;
}

const DefaultNav: React.FC<AppComponent> = ({ Cart }) => {
  const Now = new Date().getTime();
  // const [_, setCart] = useState<any>([]);
  const [exprLogin, setExpireLogin] = useState(true);

  // const getUserInfo = async () => {
  //   try {
  //     await getDocs(collection(db, "cart")).then((querySnapshot) => {
  //       const newData: any = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  //       if (newData) {
  //         const d: any = [];
  //         newData.map((item: any) => {
  //           return item.cartId == token ? d.push(item) : null;
  //         });
  //         setCart(d);
  //       }
  //     });
  //   } catch (error) {
  //     console.error(" Unable to get cart", error);
  //   }
  // };

  const [_, setSearchResult] = useState<any>([{ name: "computer" }]);

  useEffect(() => {
    const login_expiry_date = localStorage.getItem("login_expiry_date");
    if (Now < Number(login_expiry_date)) {
      // getUserInfo();
      setExpireLogin(false);
    } else if (Now >= Number(login_expiry_date)) {
      setExpireLogin(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const searchProduct = async (word: string) => {
    if (typeof word !== "string") {
      throw new Error(
        "searchProduct: Invalid input type. Expected a string for email search."
      );
    }

    try {
      const q = query(collection(db, "products"), where("name", "==", word));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => doc.data());
      setSearchResult(data);
    } catch (error) {
      console.error("searchProduct error:", error);
    }
  };

  useEffect(() => {
    searchProduct("milo");
  }, []);

  return (
    <>
      <div className="fixed top-0 w-full h-auto px-3 md:px-5 py-4 md:py-4 bg-white flex flex-row items-center shadow-lg z-20">
        <a className="w-20 md:w-1/5 md:mx-2 md:px-4 flex items-center" href="/">
          <img
            src="/img/OneStore logo.svg"
            alt=""
            className="w-auto h-auto mx-1 md:mx-2 object-cover"
          />
        </a>
        {/* <div className="w-2/3 md:w-2/3 mx-0 md:mx-auto px-auto flex flex-row items-center">
          <input
            type="text"
            className="w-3/5 md:w-96 h-8 md:h-10 mx-4 mr-0 py-0 px-3 text-md text-gray-800 font-roboto outline-none rounded-l-full   border-2 border-gray-100 "
            placeholder="search"
            onChange={(e) => searchProduct(e.target.value)}
          />
          <input
            type="button"
            value="Search"
            className="  h-8 md:h-10 mx-0 px-2 md:px-7   font-thin text-xs md:text-lg font-roboto text-white bg-Storepurple  hover:bg-purple-900  rounded-r-full "
          />
        </div> */}
        <div className="w-2/4 md:w-2/3 mx-0 md:mx-auto px-auto flex flex-row items-center"></div>
        {!exprLogin ? (
          <div className="w-1/6 mx-auto  md:mx-4 px-1 pt-2 flex flex-row ">
            <a className="w-auto mx-auto cursor-pointer" href={ROUTES.CART}>
              <MdOutlineLocalGroceryStore size={32} className="mx-auto text-slate-700" />
              {Cart && Cart.length > 0 && (
                <div
                  className=" relative top w-4 h-4 items-center bg-red-600 rounded-full"
                  style={{ top: "-70%", right: "-65%" }}
                >
                  <p className=" text-center  text-[10px] font-roboto text-white ">
                    {Cart.length}
                  </p>
                </div>
              )}
            </a>
            <a
              className="w-auto mx-auto ml-2 flex flex-col items-center cursor-pointer"
              href={ROUTES.PROFILE}
            >
              <h1 className="w-auto mx-auto flex flex-row">
                <MdPersonOutline size={32} className="text-slate-700" />
              </h1>
            </a>
          </div>
        ) : (
          <div className="w-2/6 md:1/5 mx-0 md:mx-4 flex flex-row items-center">
            <a
              className=" md:h-34 mr-1 md:mx-5 px-5 md:px-7 py-1.5 md:py-2 text-sm md:text-lg font-roboto text-white bg-Storepurple hover:bg-purple-900 rounded-full "
              href={ROUTES.LOGIN}
            >
              Login
            </a>
            <a
              className=" md:h-34 mr-1 md:mx-5 px-4 md:px-7 py-1.5 md:py-2 text-sm md:text-lg font-roboto text-white bg-Storepurple  hover:bg-purple-900  rounded-full "
              href={ROUTES.SIGNUP}
            >
              Signup
            </a>
          </div>
        )}
      </div>
      {/* 
      <div className="fixed top-16 left-0 right-0 w-3/6 h-auto mx-auto px-3 py-3 bg-white flex flex-col shadow-lg">
        {searchResult &&
          searchResult.map((n: any) => {
            <a
              className="mx-2 p-2 w-auto text-md font-roboto text-black list-none border-b-2 z-20"
              href={`${ROUTES.PRODUCT}?${2}`}
              key={n}
            >
              {searchResult[0].name}
            </a>;
          })}
      </div> */}
    </>
  );
};

export default DefaultNav;
