import React, { useContext, useState, useEffect } from "react";
import Nav from "../Components/Nav";
import { authDataContext } from "../Context/AuthContext";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import profile from "../assets/profile.png"; // <-- Make sure this import exists

function Notification() {
  let { serverUrl } = useContext(authDataContext);
  let [notificationData, setNotificationData] = useState([]);

  const handleNotification = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/notification/get", {
        withCredentials: true,
      });
      setNotificationData(result.data);
    } catch (error) {
      console.log(error);
      console.log("handleNotification error");
    }
  };

  const handledeleteOneNotification = async (id) => {
    try {
      let result = await axios.delete(
        serverUrl + `/api/notification/deleteone/${id}`,
        {
          withCredentials: true,
        }
      );

      await handleNotification();
    } catch (error) {
      console.log(error);
      console.log("handleNotification error");
    }
  };

  const handleClearAllNotification = async () => {
    try {
      let result = await axios.delete(
        serverUrl + "/api/notification/clearall",
        {
          withCredentials: true,
        }
      );
      await handleNotification();
    } catch (error) {
      console.log(error);
      console.log("handleNotification error");
    }
  };

  const handleMessage = (type) => {
    if (type === "like") return "Liked your post";
    if (type === "comment") return "Commented on your post";
    if (type === "connectionAccepted") return "Accepted your Connection";
    return "";
  };

  useEffect(() => {
    handleNotification();
  }, []);

  return (
    <div className="w-full h-[100vh] bg-[#f0efe7] pt-[100px] p-[20px] flex flex-col items-center gap-[10px]">
      <Nav />
      <div className="w-full h-[100px] bg-white shadow-lg rounded-lg flex items-center p-[20px] justify-between">
        <div className="text-[22px] font-bold text-gray-600 ">
          Notifications
          <span className="text-red-500 "> : {notificationData.length}</span>
        </div>
        {notificationData.length > 0 && (
          <div
            className="text-[19px] text-red-500 cursor-pointer"
            onClick={() => {
              handleClearAllNotification();
            }}
          >
            Clear all
          </div>
        )}
      </div>
      {notificationData.length > 0 && (
        <div className="lg:w-[70%] w-full min-h-[120px] max-h-full shadow-lg rounded-lg flex flex-col bg-white overflow-auto p-[10px]">
          {notificationData.map((notifi, index) => (
            <div
              key={index}
              className="w-full pt-[10px] px-[20px] flex justify-between items-center gap-[5px] border-b-1 border-gray-200 hover:bg-gray-200"
            >
              <div>
                <div className="flex justify-start items-center gap-[10px] ">
                  <div className="lg:w-[70px] w-[50px] lg:h-[70px] h-[50px] rounded-full">
                    <img
                      src={notifi.relatedUser?.profileImage || profile}
                      alt=""
                      className="h-full rounded-full"
                    />
                  </div>
                  <div className="  lg:text-[19px] text-[16px] flex flex-row gap-[20px] ">
                    <div className="  font-semibold text-gray-700">
                      {notifi.relatedUser
                        ? `${notifi.relatedUser.firstName} ${notifi.relatedUser.lastName}`
                        : "Unknown User"}
                    </div>
                  </div>
                  <div className="font-semibold text-gray-400">
                    {handleMessage(notifi.type)}
                  </div>
                </div>
                {notifi.relatedPost && (
                  <div className="w-[250px] pl-[100px] flex items-center  h-[80px] overflow-hidden ">
                    <div className="w-[80px] h-[50px] overflow-hidden">
                      <img
                        src={notifi.relatedPost.image}
                        alt=""
                        className="h-full "
                      />
                    </div>
                    <div className="overflow-hidden">
                      {notifi.relatedPost.description}
                    </div>
                  </div>
                )}
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  handledeleteOneNotification(notifi._id);
                }}
              >
                <RxCross1 className="w-[25px] h-[25px] " />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;
