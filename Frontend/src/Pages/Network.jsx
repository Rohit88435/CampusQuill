import React, { useContext, useEffect, useState } from "react";
import Nav from "../Components/Nav";
import { authDataContext } from "../Context/AuthContext";
import axios from "axios";
import profile from "../assets/profile.png";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RxCrossCircled } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../Context/UserContext";

function Network() {
  let { userData, setUserData, getCurrentuser } = useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext);
  let [connections, setConnections] = useState([]);
  let navigate = useNavigate();

  const handleGetRequest = async () => {
    try {
      let result = await axios.get(
        serverUrl + "/api/connection/request/",

        {
          withCredentials: true,
        }
      );

      setConnections(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const hanndleAcceptConnection = async (requestId) => {
    try {
      let result = await axios.put(
        serverUrl + `/api/connection/accept/${requestId}`,
        {},
        { withCredentials: true }
      );
      setConnections(connections.filter((con) => con._id == requestId));
      getCurrentuser();
      navigate("/");
      console.log(result);
    } catch (error) {
      console.log(error);
      console.log("handle accept error");
    }
  };

  const hanndleRejectConnection = async (requestId) => {
    try {
      let result = await axios.put(
        serverUrl + `/api/connection/reject/${requestId}`,
        {},
        { withCredentials: true }
      );
      setConnections(connections.filter((con) => con._id === requestId));
      navigate("/");
      console.log(result);
    } catch (error) {
      console.log(error);
      console.log("handle reject error");
    }
  };

  useEffect(() => {
    handleGetRequest();
    hanndleAcceptConnection();
    hanndleRejectConnection();
  }, []);

  return (
    <div className=" w-full h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col items-center gap-[10px]">
      <Nav />
      <div className="w-full h-[100px] bg-white shadow-lg rounded-lg flex items-center p-[10px] text-[22px] font-bold text-gray-600">
        Invitations :
        <span className="text-blue-600 ">{connections.length}</span>
      </div>

      {connections.length > 0 && (
        <div className="w-full max-w-[900px]  shadow-lg rounded-lg flex flex-col gap-[20px] min-h-[100px] bg-white">
          <div className="text-blue-500 text-3xl font-medium pl-[20px] pt-[10px">
            Connections
          </div>

          {connections.map((conn, index) => (
            <div
              className="w-full min-h-[100px] p-[20px] flex justify-between px-[40px] items-center hover:bg-gray-100 gap-[20px]"
              key={index}
            >
              <div className="flex flex-row justify-start items-center gap-[10px]">
                <div className=" w-[70px] h-[70px] rounded-full">
                  <img
                    src={conn.sender.profileImage || profile}
                    alt=""
                    className="h-full rounded-full"
                  />
                </div>
                <div className="flex flex-col ">
                  <div className="text-[19px] font-semibold text-gray-700">{`${conn.sender.firstName} ${conn.sender.lastName}`}</div>
                  <div className="text-[19px] font-semibold text-gray-700">
                    {conn.sender.headline}
                  </div>
                </div>
              </div>

              <div className="flex gap-[20px] items-center">
                <button
                  className="text-[#18c5ff] font-semibold cursor-pointer"
                  onClick={() => {
                    hanndleAcceptConnection(conn._id);
                  }}
                >
                  <IoIosCheckmarkCircleOutline className="w-[40px] h-[40px]" />
                </button>
                <button
                  className="text-[#ff4218] font-semibold cursor-pointer"
                  onClick={() => {
                    hanndleRejectConnection(conn._id);
                  }}
                >
                  <RxCrossCircled className="w-[38px] h-[38px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Network;
