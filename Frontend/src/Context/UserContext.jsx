import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { authDataContext } from "./AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const userDataContext = createContext();
function UserContext({ children }) {
  let [userData, setUserData] = useState(null);
  let [postData, setPostData] = useState([]); // FIXED: initialize as array
  let { serverUrl } = useContext(authDataContext);
  let [edit, setEdit] = useState(false);
  let [getProfile, setGetProfile] = useState(null); // FIXED: initialize as null
  let navigate = useNavigate();
  const getCurrentuser = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/user/currentuser", {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (error) {
      setUserData(null);
      if (error.response) {
        console.log("getCurrentuser error:", error.response.data);
      } else {
        console.log("getCurrentuser error:", error);
      }
      console.log("user context error");
    }
  };

  const getPost = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/post/getpost", {
        withCredentials: true,
      });
      setPostData(result.data);
    } catch (error) {
      setPostData([]);
      if (error.response) {
        console.log("getPost error:", error.response.data);
      } else {
        console.log("getPost error:", error);
      }
    }
  };

  const handleGetProfile = async (userName) => {
    try {
      let result = await axios.get(
        serverUrl + `/api/user/profile/${userName}`,
        {
          withCredentials: true,
        }
      );
      setGetProfile(result.data);
      navigate("/profile");
      console.log(result);
    } catch (error) {
      setGetProfile([]);
      console.log(" get profile error " + error);
    }
  };

  useEffect(() => {
    getCurrentuser();
    getPost();
  }, []);

  let value = {
    userData,
    setUserData,
    getPost,
    postData,
    setPostData,
    edit,
    setEdit,
    getCurrentuser,
    getProfile,
    setGetProfile,
    handleGetProfile,
  };
  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
