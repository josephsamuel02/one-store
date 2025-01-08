/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import DefaultNav from "../../components/DefaultNav";
import CartItems from "./CartItems";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import CategoryNav from "./CategoryNav";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../DB/firebase";

const Cart: React.FC = () => {
  const token = localStorage.getItem("one_store_login");
  const Navigate = useNavigate();
  const [Cart, setCart] = useState<any>("");
  const [totalPrice, setTotalPrice] = useState(0);

  const getCart = async () => {
    try {
      const targetRef = collection(db, "cart");
      const q = query(targetRef, where("cartId", "==", token));

      await getDocs(q).then((querySnapshot) => {
        const newData: any = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        if (newData) {
          setCart(newData);
        }
        let t = 0;

        for (let i = 0; i < newData.length; i++) {
          const productTotal = newData[i].inStock * newData[i].price;
          t += productTotal;
        }
        setTotalPrice(t);
      });
    } catch (error) {
      toast.warning("Unable to login");
      console.log(" Unable to get data", error);
    }
  };

  useEffect(() => {
    if (!token) {
      Navigate("/login");
    }
    getCart();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full px-3 flex flex-col items-center   h-full pt-16 md:pt-20  bg-purple-100">
      <DefaultNav Cart={Cart} />
      <CategoryNav />
      {token && <CartItems cartItems={Cart} totalPrice={totalPrice} getCart={getCart} />}
      <Footer />
    </div>
  );
};

export default Cart;
