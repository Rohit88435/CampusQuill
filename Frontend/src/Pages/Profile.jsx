import React from "react";
import Nav from "../Components/Nav";
import profile from "../assets/profile.png";
import { FiPlus } from "react-icons/fi";
import { IoCameraOutline } from "react-icons/io5";
import { userDataContext } from "../Context/UserContext";
import { RiPencilFill } from "react-icons/ri";
import EditProfile from "../Components/EditProfile";
import { useContext } from "react";
import { useState } from "react";
import axios from "axios";
import { authDataContext } from "../Context/AuthContext";
import { useEffect } from "react";
import Post from "../Components/Post";
import ConnectionButton from "../Components/ConnectionButton";
function Profile() {
  let {
    userData,
    setUserData,
    edit,
    setEdit,
    postData,
    setPostData,
    getProfile,
    setGetProfile,
  } = useContext(userDataContext);
  let [profilepost, setProfilePost] = useState([]);
  let [userConnection, setUserConnection] = useState([]);
  let { serverUrl } = useContext(authDataContext);
  let [seePost, setSeePost] = useState(false);
  const handleGetUserConnection = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/connection", {
        withCredentials: true,
      });
      setUserConnection(result.data);
      userData(result.data);
    } catch (error) {
      console.log("handleGetUserConnection error");
    }
  };

  useEffect(() => {
    setProfilePost(
      postData.filter((post) => post.author._id == getProfile._id)
    );
  }, [getProfile]);
  return (
    <div className="w-full min-h-[100vh]  flex flex-col  items-center pt-[100px] bg-[#f0efe7]">
      <Nav />
      {edit && <EditProfile />}

      <div className="w-full max-w-[900px]  min-h-[100vh] flex flex-col gap-[10px] pb-[40px] ">
        <div className="relative bg-white pb-[40px] rounded shadow-lg">
          <div
            className="w-[100%] h-[200px] bg-gray-500 rounded-md overflow-hidden flex justify-center cursor-pointer items-center"
            onClick={() => {
              setEdit(true);
            }}
          >
            <img src={getProfile.coverImage || ""} alt="" className="w-full" />
            <IoCameraOutline className="absolute w-[25px] right-[20px] top-[15px] h-[25px] text-[#d7e0e3] cursor-pointer " />
          </div>
          <div
            className=" w-[50px] h-[50px] rounded-full top-[180px] left-[30px] absolute cursor-pointer overflow-hidden flex justify-center items-center "
            onClick={() => {
              setEdit(true);
            }}
          >
            <img
              src={getProfile.profileImage || profile}
              alt=""
              className="h-full"
            />
          </div>
          <div className="w-[20px] h-[20px] z-40 absolute top-[205px] rounded-full flex justify-center items-center left-[70px] bg-[#57d2ff] cursor-pointer">
            <FiPlus className=" text-white" />
          </div>

          <div className="mt-[40px] ml-[20px]  pl-[10px] font-semibold text-gray-700 text-[18px]">
            <div>{`${getProfile.firstName} ${getProfile.lastName}`}</div>
            <div className="font-semibold text-gray-600 text-[17px]">
              {getProfile.headline || ""}
            </div>
            <div className="font-semibold text-gray-500 text-[16px]">
              {getProfile.location}
            </div>
            <div className="font-semibold text-gray-500 text-[16px]">
              {`${getProfile.connection.length} connections`}
            </div>
            {getProfile._id == userData._id ? (
              <button
                className="min-w-[150px]  h-[40px] border-2 mt-[10px] border-b-cyan-500 outline-none  rounded-full cursor-pointer text-cyan-500 flex justify-center items-center gap-[5px]"
                onClick={() => {
                  setEdit(true);
                }}
              >
                Edit Profile
                <RiPencilFill />
              </button>
            ) : (
              <div className="mt-[10px]">
                <ConnectionButton userId={getProfile._id} />
              </div>
            )}
          </div>
        </div>

        <div className="w-full  h-[100px] p-[20px] bg-white shadow-xl flex justify-between items-center">
          <div className="text-[22px] text-gray-700 font-semibold ">
            {" "}
            {`Posts (${profilepost.length})`}
          </div>
          <div
            className="cursor-pointer text-[16px] font-medium hover:text-[17px]"
            onClick={() => {
              setSeePost((prev) => !prev);
            }}
          >
            See Posts
          </div>
        </div>
        <div className={`w-full  ${seePost ? "flex" : "hidden"} flex-col `}>
          {profilepost.map((post, index) => (
            <Post
              key={index}
              id={post._id}
              description={post.description}
              author={post.author}
              image={post.image}
              like={post.like}
              comment={post.comment}
              createdAt={post.createdAt}
            />
          ))}
        </div>
        {getProfile.skills.length > 0 && (
          <div className="w-full min-h-[100px] flex flex-col justify-center px-[20px] py-[20px] font-semibold bg-white shadow-lg rounded-lg ">
            <div className=" text-[22px] text-gray-700 p-[10px]">Skills</div>
            <div className=" text-[18px] px-[10px]  font-semibold flex flex-wrap gap-[20px] pb-[10px]  justify-start items-center  ">
              {userData.skills.map((skill) => (
                <div className="text-[20px]">{skill} </div>
              ))}

              {getProfile._id == userData._id ? (
                <button
                  className="min-w-[150px] h-[40px] border-2 mt-[10px] border-cyan-500 outline-none  rounded-full cursor-pointer text-cyan-500 "
                  onClick={() => {
                    setEdit(true);
                  }}
                >
                  Add Skills
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        )}
        {getProfile.education.length > 0 && (
          <div className="w-full min-h-[100px] flex flex-col justify-center px-[20px] py-[0]  bg-white shadow-lg rounded-lg ">
            <div className=" text-[22px] text-gray-700 p-[10px] font-semibold">
              Education
            </div>
            <div className="w-full  px-[10px]   flex flex-col gap-[20px] pb-[20px]  justify-center items-Start  ">
              {getProfile.education.map((edu) => (
                <div>
                  <div className="text-[20px]">College : {edu.college} </div>
                  <div className="text-[20px]">Degree : {edu.degree} </div>
                  <div className="text-[20px]">Course : {edu.course} </div>
                </div>
              ))}
              {getProfile._id == userData._id ? (
                <button
                  className="w-[150px] h-[40px] border-2 mt-[10px] border-cyan-500 outline-none  rounded-full cursor-pointer text-cyan-500 "
                  onClick={() => {
                    setEdit(true);
                  }}
                >
                  Add Education
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        )}

        {getProfile.experience.length > 0 && (
          <div className="w-full min-h-[100px] flex flex-col justify-center px-[20px] py-[0]  bg-white shadow-lg rounded-lg ">
            <div className=" text-[22px] text-gray-700 p-[10px] font-semibold">
              Experience
            </div>
            <div className="w-full  px-[10px]   flex flex-col gap-[20px] pb-[20px]  justify-center items-Start  ">
              {getProfile.experience.map((exp) => (
                <div>
                  <div className="text-[20px]">Title : {exp.college} </div>
                  <div className="text-[20px]">
                    Company Name : {exp.degree}{" "}
                  </div>
                  <div className="text-[20px]">Description : {exp.course} </div>
                </div>
              ))}
              {getProfile._id == userData._id ? (
                <button
                  className="w-[150px] h-[40px] border-2 mt-[10px] border-cyan-500 outline-none  rounded-full cursor-pointer text-cyan-500 "
                  onClick={() => {
                    setEdit(true);
                  }}
                >
                  Add Experience
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
