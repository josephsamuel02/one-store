/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import DefaultNav from "../../components/DefaultNav";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../DB/firebase";
// import CheckoutDetails from "./CheckoutDetails";

const Checkout: React.FC = () => {
  const token = localStorage.getItem("one_store_login");

  const [Cart, setCart] = useState<any>([]);

  const getCartInfo = async () => {
    try {
      await getDocs(collection(db, "cart")).then((querySnapshot) => {
        const newData: any = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        if (newData) {
          const d: any = [];
          newData.map((item: any) => {
            return item.cartId == token ? d.push(item) : null;
          });
          console.log(d.length);
          setCart(d);
        }
      });
    } catch (error) {
      console.error(" Unable to get cart", error);
    }
  };
  useEffect(() => {
    getCartInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="w-full h-full pt-16 md:pt-20  bg-purple-100">
      <DefaultNav Cart={Cart} />
      {/* <CheckoutDetails /> */}
    </div>
  );
};

export default Checkout;
