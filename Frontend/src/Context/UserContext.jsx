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
  let [getProfile, setGetProfile] = useState([]);
  let navigate = useNavigate();
  const getCurrentuser = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/user/currentuser", {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (error) {
      setUserData(null);
      console.log(error);
      console.log("user context error");
    }
  };

  const getPost = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/post/getpost", {
        withCredentials: true,
      });
      setPostData(result.data);
      console.log(result);
    } catch (error) {
      setPostData([]);
      console.log(" get post error " + error);
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
    getPost,
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
