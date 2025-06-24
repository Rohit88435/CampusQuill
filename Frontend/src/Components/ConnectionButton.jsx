import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { authDataContext } from "../Context/AuthContext";
import axios from "axios";
import io from "socket.io-client";
import { userDataContext } from "../Context/UserContext";
import { Navigate, useNavigate } from "react-router-dom";

let socket = io("https://campusquill-backend.onrender.com");

function ConnectionButton({ userId }) {
  let { userData, setUserData } = useContext(userDataContext);
  let [status, setStatus] = useState("");
  let { serverUrl } = useContext(authDataContext);
  let nevigate = useNavigate();

  const handleSendRequest = async () => {
    try {
      let result = await axios.post(
        serverUrl + `/api/connection/send/${userId}`,
        {},
        { withCredentials: true }
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetStatus = async () => {
    try {
      let result = await axios.get(
        serverUrl + `/api/connection/getstatus/${userId}`,

        { withCredentials: true }
      );
      console.log(result);

      setStatus(result.data.status);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveConnection = async () => {
    try {
      let result = await axios.delete(
        serverUrl + `/api/connection/remove/${userId}`,

        { withCredentials: true }
      );
    } catch (error) {
      console.log("handleRemoveConnection error");
    }
  };

  useEffect(() => {
    socket.emit("register", userData._id);
    handleGetStatus();

    socket.on("statusUpdate", ({ updatedUserId, newStatus }) => {
      if (updatedUserId == userId) setStatus(newStatus);
    });

    return () => {
      socket.off("statusUpdate");
    };
  }, [userId]);

  const handleClick = async () => {
    if (status == "disconnect") {
      await handleRemoveConnection();
    } else if (status == "received") {
      nevigate("/network");
    } else {
      await handleSendRequest();
    }
  };

  return (
    <div>
      <button
        className="min-w-[100px] font-sans  text-[18px] h-[40px] border-2 mt-[10px] border-b-cyan-500 outline-none  rounded-full cursor-pointer text-cyan-500 flex justify-center items-center gap-[5px]"
        onClick={() => {
          handleClick();
        }}
        disabled={status == "pending"}
      >
        {status}
      </button>
    </div>
  );
}

export default ConnectionButton;
