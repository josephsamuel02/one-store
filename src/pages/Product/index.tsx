/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import DefaultNav from "../../components/DefaultNav";
import ProductCard from "./ProductCard";
import ProductDetails from "./ProductDetails";
import Footer from "../../components/Footer";
import { useParams } from "react-router-dom";
import { db } from "../../DB/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

const Product: React.FC = () => {
  const token = localStorage.getItem("one_store_login");

  const { id }: any = useParams();
  const [Cart, setCart] = useState<any>([]);

  const [singleProduct, setSingleProduct] = useState<any>();
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

  const getProductById = async () => {
    try {
      const Ref = await getDoc(doc(db, "products", id));

      if (Ref.exists()) {
        setSingleProduct(Ref.data());
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };

  useEffect(() => {
    getProductById();
    getCartInfo();
  }, []);

  return (
    <div className="w-full h-full pt-16 md:pt-24  bg-purple-100">
      <DefaultNav Cart={Cart} />
      <ProductCard singleProduct={singleProduct} getCartInfo={getCartInfo} />
      <ProductDetails singleProduct={singleProduct} />
      <Footer />
    </div>
  );
};

export default Product;
