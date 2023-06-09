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
    type: action.type,
  };
};
const Userstates = {
  data: {},
  authenticated: false,
  type: "",
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
                      path="/home"
                      element={
                        <ProtectedRoute requestedRoute={"home"}>
                          {" "}
                          <Home />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/signup" element={<Signup />} />
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
