import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Singup from "./Pages/Singup";
import SignIn from "./Pages/SignIn";
import { ToastContainer } from "react-toastify";
import { userDataContext } from "./Context/UserContext";
import Network from "./Pages/Network";
import Profile from "./Pages/Profile";
import Notification from "./Pages/Notification";
function App() {
  let { userData } = useContext(userDataContext);
  return (
    <Routes>
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/signin" />}
      />
      <Route
        path="/signup"
        element={userData ? <Navigate to="/signin" /> : <Singup />}
      />
      <Route
        path="/signin"
        element={userData ? <Navigate to="/" /> : <SignIn />}
      />
      <Route
        path="/network"
        element={userData ? <Network /> : <Navigate to="/signin" />}
      />
      <Route
        path="/profile"
        element={userData ? <Profile /> : <Navigate to="/signin" />}
      />
      <Route
        path="/notification"
        element={userData ? <Notification /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
}

export default App;
