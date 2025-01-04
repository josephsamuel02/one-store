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
      toast.warning(" Unable to login");
    }
  };

  useEffect(() => {
    if (!token) {
      Navigate("/login");
    }
    getOrders();
  }, []);

  return (
    <div className="w-full h-full pt-16 md:pt-20 bg-purple-100">
      <DefaultNav />
      <OrderItems Orders={Orders} totalPrice={totalPrice} />
      <Footer />
    </div>
  );
};

export default Orders;
