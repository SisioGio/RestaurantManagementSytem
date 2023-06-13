import React, {
  useState,
  useReducer,
  createContext,
  useContext,
  useEffect,
} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import "./App.css";
import Header from "./components/header";
import Signin from "./components/signin";
import Signup from "./components/signup";
import Feedback from "./components/feedback";
import ProtectedRoute from "./components/protectedRoute";
import CustomerPortal from "./components/customer/customerPortal";
import CustomerMakeReservation from "./components/customer/makeReservation";
import TableSelection from "./components/customer/tableSelection";
import MenuSelection from "./components/menu/menuSelection.js.js";
import ReservationConfirmation from "./components/customer/reservationConfirmation";
import WaiterPortal from "./components/waiter/waiterPortal";
import Order from "./components/waiter/order";
import ChefPortal from "./components/chef/chefPortal";
import AllReservations from "./components/waiter/allReservations";

const showFeedbackContext = createContext();
const dispatchFeedbackContext = createContext();
const showUserContext = createContext();
const dispatchUserContext = createContext();

const FeedbackReducer = (state, action) => {
  return {
    message: action.message,
    type: action.type,
  };
};
const Feedbackstates = {
  message: "",
  type: "",
};
const UserReducer = (state, action) => {
  return {
    data: action.data,
    authenticated: action.authenticated,
  };
};
const Userstates = {
  data: {},
  authenticated: false,
};
function App() {
  const [feedback, setFeedback] = useReducer(FeedbackReducer, Feedbackstates);
  const [userAuth, setUserAuth] = useReducer(UserReducer, Userstates);
  return (
    <dispatchUserContext.Provider value={setUserAuth}>
      <showUserContext.Provider value={userAuth}>
        <dispatchFeedbackContext.Provider value={setFeedback}>
          <showFeedbackContext.Provider value={feedback}>
            <div className="App">
              <Feedback />

              <Router>
                <Header />
                <div id="content">
                  <Routes>
                    <Route
                      exact
                      path="/customerPortal"
                      element={<CustomerPortal />}
                    />
                    <Route
                      exact
                      path="/make-reservation/table-selection"
                      element={<TableSelection />}
                    />
                    <Route
                      exact
                      path="/make-reservation/table-selection/menu-items"
                      element={<MenuSelection />}
                    />

                    <Route
                      exact
                      path="/make-reservation/table-selection/menu-items/confirmation"
                      element={<ReservationConfirmation />}
                    />
                    <Route exact path="/home" element={<Home />} />
                    <Route exact path="/signin" element={<Signin />} />
                    <Route exact path="/signup" element={<Signup />} />
                    <Route
                      exact
                      path="/waiterPortal"
                      element={<WaiterPortal />}
                    />
                    <Route
                      exact
                      path="/reservations"
                      element={<AllReservations />}
                    />
                    <Route exact path="/order" element={<Order />} />

                    <Route
                      exact
                      path="/make-reservation"
                      element={<CustomerMakeReservation />}
                    />

                    <Route exact path="/order-items" element={<ChefPortal />} />
                  </Routes>
                </div>

                <div id="footer">Footer</div>
              </Router>
            </div>
          </showFeedbackContext.Provider>
        </dispatchFeedbackContext.Provider>
      </showUserContext.Provider>
    </dispatchUserContext.Provider>
  );
}

export default App;
export const DispatchUserContexts = () => useContext(dispatchUserContext);
export const ShowUserContexts = () => useContext(showUserContext);

export const DispatchFeedbackContexts = () =>
  useContext(dispatchFeedbackContext);
export const ShowFeedbackContexts = () => useContext(showFeedbackContext);
