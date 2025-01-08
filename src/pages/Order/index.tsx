/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import DefaultNav from "../../components/DefaultNav";
import Footer from "../../components/Footer";
import OrderItems from "./OrderItems";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../DB/firebase";

const Orders: React.FC = () => {
  const token = localStorage.getItem("one_store_login");
  const Navigate = useNavigate();
  const [Orders, setOrders] = useState<any>("");
  const [totalPrice, setTotalPrice] = useState(0);
  const getOrders = async () => {
    try {
      const targetRef = collection(db, "order");
      const q = query(targetRef, where("userId", "==", token));

      await getDocs(q).then((querySnapshot) => {
        const newData: any = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        if (newData) {
          setOrders(newData);
        }
        let t = 0;

        for (let i = 0; i < newData.Products.length; i++) {
          const productTotal = newData.Products[i].inStock * newData.Products[i].price;
          t += productTotal;
        }
        setTotalPrice(t);
      });
    } catch (error) {
      console.log(error);
      toast.warning(" Unable to login");
    }
  };

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

  useEffect(() => {
    if (!token) {
      Navigate("/login");
    }
    getOrders();
  }, []);

  return (
    <div className="w-full h-full pt-16 md:pt-20 bg-purple-100">
      <DefaultNav Cart={Cart} />
      <OrderItems Orders={Orders} totalPrice={totalPrice} />
      <Footer />
    </div>
  );
};

export default Orders;
