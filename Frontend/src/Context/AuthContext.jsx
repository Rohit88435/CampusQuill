import React from "react";
import { createContext } from "react";
import { ToastContainer } from "react-toastify";

export const authDataContext = createContext();
function AuthContext({ children }) {
  let serverUrl = "https://campusquill-backend.onrender.com";
  let value = {
    serverUrl,
  };
  return (
    <div>
      <authDataContext.Provider value={value}>
        <ToastContainer />
        {children}
      </authDataContext.Provider>
    </div>
  );
}

export default AuthContext;
