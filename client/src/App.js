import React, {
  useState,
  useReducer,
  createContext,
  useContext,
  useEffect,
} from "react";
import { BrowserRouter as Router } from "react-router-dom";
// import "./App.css";
import Header from "./components/partials/header";
import Feedback from "./components/partials/feedback";
import Footer from "./components/partials/footer";
import apiService from "./services/apiService";
import Cart from "./components/partials/cart";
import AppRoutes from "./components/partials/routes";

const showFeedbackContext = createContext();
const dispatchFeedbackContext = createContext();

const showCartContext = createContext();
const dispatchCartContext = createContext();

const showUserContext = createContext();
const dispatchUserContext = createContext();

const FeedbackReducer = (state, action) => {
  return {
    action: action.value,
    message: action.message,
    type: action.type,
    cart: action.cart,
  };
};
const Feedbackstates = {
  value: false,
  message: "",
  type: "",
};
const CartReducer = (state, action) => {
  return {
    cart: action.cart,
  };
};
const Cartstates = {
  cart: apiService.getCartItems(),
};

const UserReducer = (state, action) => {
  return {
    authenticated: action.authenticated,
    admin: action.admin,
  };
};
const Userstates = {
  authenticated: false,
  admin: false,
};

function App() {
  const [feedback, setFeedback] = useReducer(FeedbackReducer, Feedbackstates);
  const [cart, setCart] = useReducer(CartReducer, Cartstates);
  const [userAuth, setUserAuth] = useReducer(UserReducer, Userstates);

  return (
    <dispatchUserContext.Provider value={setUserAuth}>
      <showUserContext.Provider value={userAuth}>
        <dispatchFeedbackContext.Provider value={setFeedback}>
          <showFeedbackContext.Provider value={feedback}>
            <dispatchCartContext.Provider value={setCart}>
              <showCartContext.Provider value={cart}>
                <div className="App box">
                  <Router>
                    <div className="row-header">
                      <Header />
                    </div>

                    <Feedback />
                    <Cart />
                    <div className="main row content">
                      <AppRoutes />
                    </div>
                    <div className="row footer">
                      <Footer />
                    </div>
                  </Router>
                </div>
              </showCartContext.Provider>
            </dispatchCartContext.Provider>
          </showFeedbackContext.Provider>
        </dispatchFeedbackContext.Provider>
      </showUserContext.Provider>
    </dispatchUserContext.Provider>
  );
}

export default App;

export const dispatchFeedbackContexts = () =>
  useContext(dispatchFeedbackContext);
export const showFeedbackContexts = () => useContext(showFeedbackContext);
export const dispatchCartContexts = () => useContext(dispatchCartContext);
export const showCartContexts = () => useContext(showCartContext);

export const dispatchUserContexts = () => useContext(dispatchUserContext);
export const showUserContexts = () => useContext(showUserContext);
