import React from "react";
import { createContext } from "react";
import { ToastContainer } from "react-toastify";

export const authDataContext = createContext();
function AuthContext({ children }) {
  let serverUrl = "http://localhost:900";
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
