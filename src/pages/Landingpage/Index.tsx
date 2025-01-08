/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import Categories from "./Categories";
import TopeSale from "./TopSale";
import Footer from "../../components/Footer";
import Electronics from "./Electronics";
import Accessories from "./Accessories";
import Baby from "./Baby";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { db } from "../../DB/firebase";
import DefaultNav from "../../components/DefaultNav";

const Index: React.FC = () => {
  const token = localStorage.getItem("one_store_login");

  const [allProducts, setAllProducts] = useState<any>([]);
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
    const fetchPost = async () => {
      await getDocs(collection(db, "products")).then((querySnapshot) => {
        const newData: any = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setAllProducts(newData);
      });
    };
    fetchPost();

    // setAllProducts(ProductsData);
    // console.log(ProductsData);
  }, []);

  useEffect(() => {
    getCartInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full pt-24 md:pt-24 ">
      <DefaultNav Cart={Cart} />
      <Banner />
      <Categories />
      <TopeSale Products={allProducts} addToCart={addToCart} />
      <Accessories Products={allProducts} addToCart={addToCart} />
      <Baby Products={allProducts} addToCart={addToCart} />
      <Electronics Products={allProducts} addToCart={addToCart} />
      <Footer />
    </div>
  );
};

export default Index;
