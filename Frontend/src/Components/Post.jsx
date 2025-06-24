import React, { useContext, useEffect, useState } from "react";
import profile from "../assets/profile.png";
import moment from "moment";
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { authDataContext } from "../Context/AuthContext";
import axios from "axios";
import { BiSolidLike } from "react-icons/bi";
import { MdSend } from "react-icons/md";
import { io } from "socket.io-client";

let socket = io("http://localhost:9000");
import { userDataContext } from "../Context/UserContext";
import ConnectionButton from "./ConnectionButton";

function Post({ id, author, like, comment, description, image, createdAt }) {
  let { userData, getPost, setUserData, handleGetProfile } =
    useContext(userDataContext);
  let [more, setMore] = useState(false);
  let { serverUrl } = useContext(authDataContext);
  let [likes, setLikes] = useState(like || []);
  let [likecolor, setLikeColor] = useState(false);
  let [commentContent, setCommentContent] = useState("");
  let [comments, setComments] = useState(comment || []);
  let [showComment, setShowcomment] = useState(false);

  const handlelike = async () => {
    try {
      let result = await axios.get(serverUrl + `/api/post/like/${id}`, {
        withCredentials: true,
      });

      console.log(result);

      // Assuming result.data.like is the updated like array from backend
      if (result.data && result.data.like) {
        setLikes(result.data.like);
      }
    } catch (error) {
      console.log("like error frontend");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      let result = await axios.post(
        serverUrl + `/api/post/comment/${id}`,
        {
          content: commentContent,
        },
        {
          withCredentials: true,
        }
      );
      if (result.data && result.data.comment) {
        setComments(result.data.comment);
      }
      setCommentContent("");
    } catch (error) {
      console.log("comment error");
    }
  };

  useEffect(() => {
    socket.on("likeUpdated", ({ postId, likes }) => {
      if (postId == id) {
        setLikes(likes);
      }
    });

    socket.on("commentAdded", ({ postId, comm }) => {
      if (postId == id) {
        setComments(comm);
      }
    });
    return () => {
      socket.off("likeUpdated");
      socket.off("commentAdded");
    };
  }, [id]);

  useEffect(() => {
    getPost();
  }, [likes, setLikes, comments]);

  return (
    <div className=" w-full min-h-[200px]  overflow-hidden bg-white rounded-lg shadow-lg p-[20px] flex flex-col gap-[10px]">
      <div className="flex justify-between items-center ">
        <div className="flex justify-start items-center gap-[10px] ">
          <div
            className=" w-[50px] h-[50px] rounded-full  overflow-hidden flex justify-center items-center "
            onClick={() => {
              handleGetProfile(author.userName);
            }}
          >
            <img
              src={author.profileImage || profile}
              alt=""
              className="h-full"
            />
          </div>

          <div>
            <div className="  font-semibold text-gray-700 text-[18px]">{`${author.firstName} ${author.lastName}`}</div>
            <div className="  text-gray-600 text-[15px]">{author.headline}</div>
            <div className="  text-gray-700 text-[15px]">
              {moment(createdAt).fromNow()}
            </div>
          </div>
        </div>
        <div>
          {userData._id != author._id && (
            <ConnectionButton userId={author._id} />
          )}
        </div>
      </div>
      <div className=" flex flex-col justify-center items-center">
        <div
          className={`w-full ${
            !more ? "max-h-[100px] overflow-hidden" : ""
          } font-semibold text-gray-700   pl-[30px]`}
        >
          {description}
          <div
            className=" font-medium text-gray-700  cursor-pointer"
            onClick={() => {
              setMore((prev) => !prev);
            }}
          >
            {!more ? " read more.." : "read less.."}
          </div>
        </div>

        {image && (
          <div className=" h-[400px] w-[300px] lg:w-[500px] object-cover  overflow-hidden rounded-lg  flex justify-center items-center ">
            <img
              src={image}
              alt=""
              className="lg:w-[80%] h-[90%]  rounded-lg"
            />
          </div>
        )}

        <div className=" w-full">
          <div className="w-full flex justify-between   items-center p-[20px] pb-[10px]">
            <div className="flex items-center justify-center gap-[5px] text-[18px]">
              <BiLike className="text-[#1ebbff]  h-[20px] w-[20px] " />
              <span>{likes.length}</span>
            </div>
            <div
              className="flex items-center justify-center gap-[5px] text-[18px]"
              onClick={() => {
                setShowcomment((prev) => !prev);
              }}
            >
              <span>{comment.length}</span>
              <span>
                <FaRegCommentDots className="text-blue-700    w-[24px] h-[24px]" />
              </span>
            </div>
          </div>
          <div className="w-full border-b-2  border-gray-500"></div>
          <div className="w-full h-[10px] flex justify-evenly  items-center p-[20px] pb-[10px] gap-[30px] ">
            {!likes.includes(userData._id) && (
              <div
                className=" flex justify-start items-center gap-[5px] cursor-pointer w-[50%] h-full "
                onClick={handlelike}
              >
                <BiLike
                  className={` text-gray-600
                w-[24px] h-[24px]  hover:w-[26px] hover:h-[26px]`}
                />
                <span className="text-[18px]">Like</span>
              </div>
            )}
            {likes.includes(userData._id) && (
              <div
                className=" flex justify-start items-center gap-[5px] cursor-pointer w-[50%] h-full "
                onClick={handlelike}
              >
                <BiSolidLike
                  className={`text-[#1ebbff] 
                w-[24px] h-[24px]  hover:w-[26px] hover:h-[26px]`}
                />
                <span className=" text-[#1ebbff]  text-[19px]">Liked</span>
              </div>
            )}
            <div
              className="flex justify-end items-center gap-[5px] w-[50%] h-full hover:text-[18px] cursor-pointer"
              onClick={() => {
                setShowcomment((prev) => !prev);
              }}
            >
              <FaRegCommentDots className="text-gray-600  w-[24px] h-[24px] " />
              <span>Comment</span>
            </div>
          </div>
          <div className="w-[100%] p-[20px] pt-[10px] pb-[5px] ">
            <form
              onSubmit={handleComment}
              className="w-full flex justify-between items-center border-b-2 border-gray-300 p-[10px]"
            >
              <input
                type="text"
                placeholder={"leave a comment"}
                className="w-[90%] font-semibold outline-none border-none px-[10px] py-[5px]"
                value={commentContent}
                onChange={(e) => {
                  setCommentContent(e.target.value);
                }}
                required
              />
              <button className="w-[10%] ">
                <MdSend
                  className="w-full text-2xl text-blue-600
                "
                />
              </button>
            </form>

            {showComment && (
              <div className="flex flex-col gap-[10px]">
                {comments.map((com) => (
                  <div className="flex flex-col  gap-[20px] border-b-2 border-gray-300 p-[10px]">
                    <div className="w-full flex justify-start items-center">
                      <div className=" w-[50px] h-[50px] rounded-full  overflow-hidden flex justify-center items-center ">
                        <img
                          src={com.user.profileImage || profile}
                          className="h-full"
                        />
                      </div>
                      <div className="  font-semibold text-gray-700 text-[18px]">{`${com.user.firstName} ${com.user.lastName}`}</div>
                    </div>
                    <div className="pl-[50px] ">{com.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
