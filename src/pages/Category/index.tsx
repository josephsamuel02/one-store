/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Products from "./Products";
import DefaultNav from "../../components/DefaultNav";
import Footer from "../../components/Footer";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../DB/firebase";

const Category: React.FC = () => {
  const token = localStorage.getItem("one_store_login");

  const location = useLocation();
  const category: any = new URLSearchParams(location.search).get("category");
  const [Cart, setCart] = useState<any>([]);

  const [categoryProducts, setCategoryProducts] = useState<any>([]);

  const getProductsByCategory = async () => {
    const collectionRef = collection(db, "products");
    const queryRef = query(collectionRef, where("category", "==", category));

    try {
      const querySnapshot = await getDocs(queryRef);
      querySnapshot.forEach((doc) => {
        setCategoryProducts((prev: any) => [...prev, doc.data()]);
      });
    } catch (error) {
      console.log(error);
      toast.error("unable to get data");
    }
  };
  const getCartInfo = async () => {
    try {
      await getDocs(collection(db, "cart")).then((querySnapshot) => {
        const newData: any = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        if (newData) {
          const d: any = [];
          newData.map((item: any) => {
            return item.cartId == token ? d.push(item) : null;
          });
          setCart(d);
        }
      });
    } catch (error) {
      console.error(" Unable to get cart", error);
    }
  };

  const addToCart = async (data: object) => {
    try {
      const token = localStorage.getItem("one_store_login");
      if (!token) {
        throw new Error("User not logged in.");
      }
      const response = await addDoc(collection(db, "cart"), {
        ...data,
        cartId: token, // Link item to the user's session
      });
      getCartInfo();
      return { id: response.id, ...data };
      // Return the new document ID and data
    } catch (error: any) {
      return error.message; // Reject with meaningful error message
    }
  };
  useEffect(() => {
    getProductsByCategory();
    getCartInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full px-1 pt-16 md:pt-24 bg-purple-100">
      <DefaultNav Cart={Cart} />
      <Products
        category={category}
        categoryProducts={categoryProducts}
        addToCart={addToCart}
      />

      <Footer />
    </div>
  );
};

export default Category;
