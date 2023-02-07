import React from "react";
import About from "./../partials/about";
import UserTickets from "./userTickets";
import ConfirmEmail from "./ConfirmEmail";
import PaymentStatus from "./paymentStatus";
import ProductDetails from "./../pages/productDetails";
import ProtectedRoute from "./onlyAuthorized";
import Admin from "./../pages/admin";
import Shop from "./../pages/shop";
import Checkout from "./../pages/checkout";
import NotFound from "./../pages/notFound";
import PasswordReset from "./passwordReset";
import Register from "./../pages/register";
import Login from "./../pages/login";
import Profile from "./../pages/profile";
import Logout from "./Logout";
import HowTo from "./QA";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/tickets"
        element={
          <ProtectedRoute requestedRoute={"tickets"} requiredRole={"user"}>
            <UserTickets />
          </ProtectedRoute>
        }
      />
      <Route path="/product/*" element={<ProductDetails />} />
      <Route
        path="/order"
        element={
          <ProtectedRoute requestedRoute={"order"} requiredRole={"user"}>
            <PaymentStatus />
          </ProtectedRoute>
        }
      />

      <Route path="resetPassword" element={<PasswordReset />}></Route>
      <Route path="/confirmation" element={<ConfirmEmail />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole={"admin"} requestedRoute={"admin"}>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute requiredRole={"user"} requestedRoute={"checkout"}>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route path="/shop" element={<Shop />} />

      <Route
        exact
        path="/account"
        element={
          <ProtectedRoute requestedRoute={"account"} requiredRole={"user"}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="/how-to-buy-ether" element={<HowTo />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/about" element={<About />} />

      <Route path="/" element={<Shop />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
