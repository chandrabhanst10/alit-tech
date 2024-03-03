import { useEffect, useState } from "react";

import "./App.css";
import Login from "./Components/Login/Login";
import CustomerList from "./Components/CustomerList/CustomerList";
import { Navigate, Route, Routes } from "react-router-dom";
import BillingList from "./Components/BillingList/BillingList";
import Header from "./Components/Header/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const [authToken, setAuthToken] = useState<string | null>("");

  useEffect(() => {
    let token = localStorage.getItem("authToken");
    setAuthToken(token);
  }, []);

  return (
    <div className="App">
      <ToastContainer />
      {authToken && <Header />}
      <Routes>
        <Route
          path="/"
          element={authToken ? <Navigate to="/customerList" /> : <Login />}
        />
        <Route
          path="/customerList"
          element={authToken ? <CustomerList /> : <Navigate to="/" />}
        />
        <Route
          path="/billingList"
          element={authToken ? <BillingList /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;
