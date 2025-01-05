import React from "react";
import { Route, Routes } from "react-router-dom";
import ROUTES from "./utils/Routes";
import Index from "./pages/Landingpage/Index";
import Category from "./pages/Category/index";
import Product from "./pages/Product/index";
import Cart from "./pages/Cart/index";
import Login from "./pages/Login/LogInPage";
import SignUp from "./pages/SignUp/SignUpPage";
import Page404 from "./pages/404_Page";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Orders from "./pages/Order/index";
import Checkout from "./pages/Checkout/index";
import Profile from "./pages/Profile/index";

import About from "./pages/About";
import { useDispatch } from "react-redux";
import { logout } from "./Redux/AuthSlice";
import { clearUserData } from "./Redux/User";
import { AppDispatch } from "./Redux/store";

const checkTokenExpiry = () => {
  const expiryDate = localStorage.getItem("login_expiry_date");

  if (expiryDate) {
    const expiryTime = parseInt(expiryDate, 10);
    const currentTime = Date.now();

    if (currentTime > expiryTime) {
      // Token is expired
      return true;
    }
  }

  return false; // Token is valid or not present
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Check if the token has expired and clear the state if necessary
  if (checkTokenExpiry()) {
    dispatch(clearUserData());
    dispatch(logout());
    localStorage.removeItem("login_expiry_date");
    localStorage.removeItem("one_store_login");
  }
  return (
    <>
      <Routes>
        <Route index path={ROUTES.LANDINGPAGE} element={<Index />} />
        <Route index path={ROUTES.CATEGORY} element={<Category />} />
        <Route index path="/product/:id" element={<Product />} />
        <Route index path={ROUTES.CART} element={<Cart />} />
        <Route path={ROUTES.ORDERS} element={<Orders />} />
        <Route path={ROUTES.CHECKOUT} element={<Checkout />} />

        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<SignUp />} />

        <Route path={ROUTES.FORGOTPASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTES.ABOUTUS} element={<About />} />

        {/* ADmin */}

        <Route path={"*"} element={<Page404 />} />
      </Routes>
    </>
  );
};

export default App;
