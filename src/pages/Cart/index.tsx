/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import DefaultNav from "../../components/DefaultNav";
import CartItems from "./CartItems";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import CategoryNav from "./CategoryNav";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Redux/store";
import { getCart } from "../../Redux/Cart";

const Cart: React.FC = () => {
  const token = localStorage.getItem("one_store_login");
  const Navigate = useNavigate();
  const [Cart, setCart] = useState<any>("");
  const [totalPrice, setTotalPrice] = useState(0);

  const dispatch = useDispatch<AppDispatch>();
  const CartState = useSelector((state: any) => state.Cart.cart);
  const get = () => {
    dispatch<any>(getCart());

    setCart(CartState);

    let t = 0;

    for (let i = 0; i < CartState.length; i++) {
      const productTotal = CartState[i].inStock * CartState[i].price;
      t += productTotal;
    }
    setTotalPrice(t);
  };

  useEffect(() => {
    if (!token) {
      Navigate("/login");
    }
    get();
  }, [CartState]);

  return (
    <div className="w-full px-3 flex flex-col items-center   h-full pt-16 md:pt-20  bg-purple-100">
      <DefaultNav />
      <CategoryNav />
      {token && <CartItems cartItems={Cart} totalPrice={totalPrice} />}
      <Footer />
    </div>
  );
};

export default Cart;
