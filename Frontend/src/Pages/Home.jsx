import React, { useContext, useRef, useState } from "react";
import Nav from "../Components/Nav";
import profile from "../assets/profile.png";
import { FiPlus } from "react-icons/fi";
import { IoCameraOutline } from "react-icons/io5";
import { RiPencilFill } from "react-icons/ri";
import EditProfile from "../Components/EditProfile";
import { RxCross1 } from "react-icons/rx";
import { BsImage } from "react-icons/bs";
import { authDataContext } from "../Context/AuthContext";
import axios from "axios";
import Post from "../Components/Post";
import { useEffect } from "react";
import { userDataContext } from "../Context/UserContext";

function Home() {
  let {
    userData,
    setUserData,
    getCurrentuser,
    getPost,
    edit,
    setEdit,
    postData,
    setPostData,
    handleGetProfile,
  } = useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext);
  let [frontendImage, setFrontendImage] = useState("");
  let [backendImage, setBackendImage] = useState("");
  let [description, setDescription] = useState("");
  let [uploadPost, setuploadPost] = useState(false);
  let [posting, setPosting] = useState(false);
  let image = useRef();
  let [suggestedUser, setSuggestedUser] = useState([]);

  function handleImage(e) {
    let file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  }

  async function handleUploadPost() {
    setPosting(true);
    try {
      let formdata = new FormData();
      formdata.append("description", description);
      if (backendImage) {
        formdata.append("image", backendImage);
      }

      let result = await axios.post(
        serverUrl + "/api/post/createpost",
        formdata,
        {
          withCredentials: true,
        }
      );

      console.log(result);
      setPosting(false);
      setuploadPost(false);
    } catch (error) {
      setPosting(false);

      console.log(error);

      console.log("handleupload post error");
    }
  }

  const handleSuggestedUser = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/user/suggest", {
        withCredentials: true,
      });
      setSuggestedUser(result.data);
    } catch (error) {
      console.log("handleSuggestedUser error");
      if (error.response && error.response.data) {
        console.log("Backend error:", error.response.data);
      } else {
        console.log(error);
      }
      setSuggestedUser([]);
    }
  };

  useEffect(() => {
    handleSuggestedUser();
  }, []);

  useEffect(() => {
    getCurrentuser();
    getPost();
  }, []);

  return (
    <div className="w-full min-h-[100vh] bg-[#f3f2ec] pt-[90px] flex justify-center items-center lg:items-start relative gap-[10px] flex-col lg:flex-row pb-[50px]">
      {edit && <EditProfile />}
      <Nav />
      <div className="lg:w-[25%] md:w-[25%] lg:min-h-[250px] p-[10px] bg-white shadow-xl ml-[20px] hidden lg:flex relative flex-col rounded-lg">
        <div
          className="w-[100%] h-[100px] bg-gray-500 rounded-md overflow-hidden flex justify-center cursor-pointer items-center"
          onClick={() => {
            setEdit(true);
          }}
        >
          <img src={userData.coverImage || ""} alt="" className="w-full" />
          <IoCameraOutline className="absolute w-[25px] right-[20px] top-[15px] h-[25px] text-[#d7e0e3] cursor-pointer " />
        </div>
        <div
          className=" w-[50px] h-[50px] rounded-full top-[80px] left-[30px] absolute cursor-pointer overflow-hidden flex justify-center items-center "
          onClick={() => {
            setEdit(true);
          }}
        >
          <img
            src={userData.profileImage || profile}
            alt=""
            className="h-full"
          />
        </div>
        <div className="w-[20px] h-[20px] z-40 absolute top-[105px] rounded-full flex justify-center items-center left-[70px] bg-[#57d2ff] cursor-pointer">
          <FiPlus className=" text-white" />
        </div>

        <div className="mt-[25px] pl-[10px] font-semibold text-gray-700 text-[18px]">
          <div>{`${userData.firstName} ${userData.lastName}`}</div>
          <div className="font-semibold text-gray-600 text-[17px]">
            {userData.headline || ""}
          </div>
          <div className="font-semibold text-gray-500 text-[16px]">
            {userData.location}
          </div>
          <button
            className="w-full h-[40px] border-2 mt-[10px] border-b-cyan-500 outline-none  rounded-full cursor-pointer text-cyan-500 flex justify-center items-center gap-[5px]"
            onClick={() => {
              setEdit(true);
            }}
          >
            Edit Profile
            <RiPencilFill />
          </button>
        </div>
      </div>

      {uploadPost && (
        <div className="w-full h-full bg-black z-[100] fixed top-0 left-0 opacity-[0.6]"></div>
      )}
      {uploadPost && (
        <div className="w-[90%] max-w-[500px] lg:h-[530px] h-[560px] top-20 bg-white shadow-lg rounded-lg fixed z-[200] p-[10px] flex flex-col justify-start items-start gap-[10px]">
          <div
            className=" absolute top-[20px] right-[20px] cursor-pointer "
            onClick={() => {}}
          >
            <RxCross1
              className="w-[25px] h-[25px] text-gray-800 font-bold "
              onClick={() => {
                setuploadPost(false);
              }}
            />
          </div>
          <div className="flex justify-start items-center gap-[10px] p-[10px] ">
            <div className=" w-[50px] h-[50px] rounded-full  overflow-hidden flex justify-center items-center ">
              <img
                src={userData.profileImage || profile}
                alt=""
                className="h-full"
              />
            </div>
            <div className=" pl-[10px] font-semibold text-gray-700 text-[18px]">
              <div>{`${userData.firstName} ${userData.lastName}`}</div>
            </div>
          </div>
          <textarea
            id=""
            className={`w-full ${
              frontendImage ? "h-[200px]" : "h-[550px]"
            } outline-none border-none  resize-none bg-white p-[10px]  rounded-lg overflow-auto`}
            placeholder="what do you want to talk about"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          ></textarea>
          <input type="file" ref={image} hidden onChange={handleImage} />
          <div className="w-full h-[300px] overflow-hidden flex justify-center items-center rounded-lg">
            <img src={frontendImage || ""} alt="" className="h-full" />
          </div>
          <div className="w-full h-[200px] flex flex-col">
            <div className="p-[20px] flex items-center justify-start border-b-2 border-gray-500">
              <BsImage
                className="w-[24px] h-[24px] text-gray-500 cursor-pointer"
                onClick={() => {
                  image.current.click();
                }}
              />
            </div>

            <div className="w-full flex justify-end items-center">
              <button
                className="w-[20%] h-[40px] border-2 mt-[10px] bg-cyan-500 outline-none  rounded-full cursor-pointer text-white "
                onClick={() => {
                  handleUploadPost();
                }}
                disabled={posting}
              >
                {posting ? "Posting.." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="lg:w-[50%] w-[90%] min-h-[200px] absolute top-20 mx-[5px] lg:relative lg:top-0  flex flex-col gap-[15px] ">
        <div className="w-full h-[120px] bg-white shadow-lg rounded-lg flex justify-start items-center gap-[20px] px-[40px]">
          <div className=" w-[50px] h-[50px] rounded-full  overflow-hidden flex justify-center items-center ">
            <img
              src={userData.profileImage || profile}
              alt=""
              className="h-full"
            />
          </div>
          <button
            className="w-[80%] h-[30%] border-1 border-gray-500 rounded-3xl flex justify-start items-center px-[20px] text-gray-700 cursor-pointer  hover:bg-gray-100"
            onClick={() => {
              setuploadPost(true);
            }}
          >
            start a post
          </button>
        </div>

        {postData?.map((post, index) => (
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
      <div className="lg:w-[25%] md:w-[25%] lg:min-h-[250px] rounded-lg pt-[10px] bg-white shadow-xl mr-[10px] hiddien flex-col lg:flex md:flex justify-start items-center">
        <h1 className="text-[20px] text-gray-600 font-semibold">
          Suggested Users
        </h1>
        {suggestedUser.length > 0 && (
          <div
            className=" w-full flex flex-col gap-[10px] hover:bg-gray-200 cursor-pointer  p-[10px]  "
            onClick={() => {
              handleGetProfile(sg.userName);
            }}
          >
            {suggestedUser.map((sg) => (
              <div className="flex flex-row justify-start p-[10px] items-center mt-[10px] gap-[10px] overflow-hidden">
                <div className="w-[40px] h-[40px] rounded-full  cursor-pointer overflow-hidden flex justify-center flex-row items-center">
                  <img
                    src={sg.profileImage || profile}
                    alt=""
                    className="w-full h-full"
                  />
                </div>
                <div className="flex flex-col ">
                  <div className="font-semibold text-gray-700 text-[18px]">
                    {`${sg.firstName} ${sg.lastName}`}
                  </div>
                  <div className="font-semibold text-gray-600 text-[15px]">
                    {sg.headline}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {suggestedUser.length == 0 && (
          <div className="text-[22px] font-bold text-gray-500 py-[60px] items-center">
            No Suggested User
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
