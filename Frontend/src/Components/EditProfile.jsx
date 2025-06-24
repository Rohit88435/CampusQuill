import React, { useContext, useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { userDataContext } from "../Context/UserContext";
import profile from "../assets/profile.png";
import { FiPlus } from "react-icons/fi";
import { IoCameraOutline } from "react-icons/io5";
import axios from "axios";
import { authDataContext } from "../Context/AuthContext";

function EditProfile() {
  let { userData, setUserData, edit, setEdit } = useContext(userDataContext);

  let [saving, setSaving] = useState(false);
  let { serverUrl } = useContext(authDataContext);
  let [firstName, setFirstName] = useState(userData.firstName || "");
  let [lastName, setLastName] = useState(userData.lastName || "");
  let [userName, setUserName] = useState(userData.userName || "");
  let [headline, setHeadline] = useState(userData.headline || "");
  let [location, setLocation] = useState(userData.location || "");
  let [gender, setGender] = useState(userData.gender || "");
  let [skills, setSkills] = useState(userData.skills || []);
  let [newSkills, setNewSkills] = useState("");
  let [education, setEducation] = useState(userData.education || []);
  let [newEducation, setNeweducation] = useState({
    college: "",
    degree: "",
    course: "",
  });
  let [experience, setExperience] = useState(userData.experience || []);
  let [newExperience, setNewexperience] = useState({
    title: "",
    company: "",
    description: "",
  });

  let [frontendProfileImg, setFrontendProfileImg] = useState(
    userData.profileImage || profile
  );
  let [backendProfileImage, setBackendProfileImage] = useState(null);
  let [frontendCoverImg, setFrontendCoverImg] = useState(
    userData.coverImage || ""
  );
  let [backendCoverImage, setBackendCoverImage] = useState(null);
  let profileImage = useRef();
  let coverImage = useRef();

  function addSkill(e) {
    e.preventDefault();
    if (newSkills && !skills.includes(newSkills)) {
      setSkills([...skills, newSkills]);
    }
    setNewSkills("");
  }
  function addEducation(e) {
    e.preventDefault();
    if (newEducation.college && newEducation.degree && newEducation.course) {
      setEducation([...education, newEducation]);
    }
    setNeweducation({
      college: "",
      degree: "",
      course: "",
    });
  }

  function addExperience(e) {
    if (
      newExperience.title &&
      newExperience.company &&
      newExperience.description
    ) {
      setExperience([...experience, newExperience]);
    }
    setNewexperience({
      title: "",
      company: "",
      description: "",
    });
  }

  function removeSkill(skill) {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    }
  }

  function removeEducation(edu) {
    if (education.includes(edu)) {
      setEducation(education.filter((e) => e !== edu));
    }
  }

  function removeExperience(exp) {
    if (experience.includes(exp)) {
      setExperience(experience.filter((e) => e !== exp));
    }
  }

  function handleProfileImg(e) {
    let file = e.target.files[0];
    setBackendProfileImage(file);
    setFrontendProfileImg(URL.createObjectURL(file));
  }
  function handleCoverImg(e) {
    let file = e.target.files[0];
    setBackendCoverImage(file);
    setFrontendCoverImg(URL.createObjectURL(file));
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      let formdata = new FormData();

      formdata.append("firstName", firstName);
      formdata.append("lastName", lastName);
      formdata.append("userName", userName);
      formdata.append("headline", headline);
      formdata.append("gender", gender);
      formdata.append("location", location);
      formdata.append("skills", JSON.stringify(skills));
      formdata.append("education", JSON.stringify(education));
      formdata.append("experience", JSON.stringify(experience));

      if (backendProfileImage) {
        formdata.append("profileImage", backendProfileImage);
      }
      if (backendCoverImage) {
        formdata.append("coverImage", backendCoverImage);
      }
      let result = await axios.put(
        serverUrl + "/api/user/updateprofile",
        formdata,
        { withCredentials: true }
      );

      console.log(result.data);

      setUserData(result.data);
      setSaving(false);
      setEdit(false);
    } catch (error) {
      console.log(error);
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-[100vh] fixed top-0  z-[100] flex justify-center items-center">
      <input
        type="file"
        accept="image/*"
        hidden
        ref={profileImage}
        onChange={handleProfileImg}
      />

      <input
        type="file"
        accept="image/*"
        hidden
        ref={coverImage}
        onChange={handleCoverImg}
      />
      <div className="bg-black opacity-[0.7] w-full h-full top-0 left-0 absolute"></div>
      <div className="w-[90%] max-w-[600px] h-[600px] bg-white relative z-[200] p-[10px] rounded-md shadow-lg overflow-auto">
        <div
          className=" absolute top-[20px] right-[20px] cursor-pointer "
          onClick={() => {
            setEdit(false);
          }}
        >
          <RxCross1 className="w-[25px] h-[25px] text-gray-800 font-bold " />
        </div>
        <div
          className="w-full h-[150px] bg-gray-500 overflow-hidden object-fill rounded-lg mt-[40px]"
          onClick={() => {
            coverImage.current.click();
          }}
        >
          <img src={frontendCoverImg} alt="" className="w-full object-fill " />
          <IoCameraOutline className="absolute w-[25px] right-[20px] top-15 h-[25px] text-[#d7e0e3] cursor-pointer " />
        </div>
        <div
          className=" w-[70px] h-[70px] rounded-full  top-40 left-6 absolute cursor-pointer overflow-hidden flex justify-center items-center "
          onClick={() => {
            profileImage.current.click();
          }}
        >
          <img src={frontendProfileImg} alt="" className="h-full" />
        </div>
        <div className="w-[20px] h-[20px] z-40 absolute top-50 rounded-full flex justify-center items-center left-[80px] bg-[#57d2ff] cursor-pointer">
          <FiPlus className=" text-white" />
        </div>

        <div
          action=""
          className="w-full flex flex-col items-center justify-center gap-[20px] mt-[45px] "
        >
          <input
            type="text"
            placeholder="firstname"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            className="w-full outline-none  border-gray-600 px-[10px] py-[5px] text-[18px] border-1 rounded-lg"
          />
          <input
            type="text"
            placeholder="lastname"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            className="w-full outline-none  border-gray-600 px-[10px] py-[5px] text-[18px] border-1 rounded-lg"
          />
          <input
            type="text"
            placeholder="username"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            className="w-full outline-none  border-gray-600 px-[10px] py-[5px] text-[18px] border-1 rounded-lg"
          />
          <input
            type="text"
            placeholder="headline"
            value={headline}
            onChange={(e) => {
              setHeadline(e.target.value);
            }}
            className="w-full outline-none  border-gray-600 px-[10px] py-[5px] text-[18px] border-1 rounded-lg"
          />
          <input
            type="text"
            placeholder="location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
            }}
            className="w-full outline-none  border-gray-600 px-[10px] py-[5px] text-[18px] border-1 rounded-lg"
          />
          <input
            type="text"
            placeholder="male/female/other"
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
            }}
            className="w-full outline-none  border-gray-600 px-[10px] py-[5px] text-[18px] border-1 rounded-lg"
          />
          <div className="w-full p-[10px] border-1 border-gray-600 flex flex-col gap-[10px] rounded-lg ">
            <h1 className="text-semibold">Skills</h1>
            {skills && (
              <div>
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="w-full  h-[40px] border-none
                     bg-slate-300 rounded-xl flex justify-between items-center my-[5px] px-[10px] py-[5px] text-gray-800 "
                  >
                    <span>{skill}</span>
                    <RxCross1
                      className="w-[20px] h-[20px] text-gray-800 font-bold  cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    />
                  </div>
                ))}
              </div>
            )}
            <div action="" className=" w-full flex flex-col gap-[10px]">
              <input
                type="text"
                placeholder="Add new skill"
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
                className="w-full outline-none  border-gray-600 px-[10px] py-[5px] text-[18px] border-1 rounded-lg"
              />
              <button
                className="w-[20%] h-[40px] border-2 mt-[10px] bg-cyan-500 outline-none  rounded-full cursor-pointer text-white "
                onClick={addSkill}
              >
                Add Skills
              </button>
            </div>
          </div>
          <div className="w-full p-[10px] border-1 border-gray-600 flex flex-col gap-[10px] rounded-lg ">
            <h1 className="text-semibold">Education</h1>
            {education && (
              <div>
                {education.map((edu, index) => (
                  <div
                    key={index}
                    className="w-full  h-[80px] border-none
                     bg-slate-300 rounded-xl flex justify-between items-center my-[5px] px-[10px] py-[5px] text-gray-800 "
                  >
                    <div>
                      <div>College : {edu.college} </div>
                      <div>Degree : {edu.degree}</div>
                      <div>Course : {edu.course}</div>
                    </div>
                    <RxCross1
                      className="w-[20px] h-[20px] text-gray-800 font-bold  cursor-pointer"
                      onClick={() => {
                        removeEducation(edu);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            <div action="" className=" w-full flex flex-col gap-[10px]">
              <input
                type="text"
                placeholder="college"
                value={newEducation.college}
                onChange={(e) =>
                  setNeweducation({ ...newEducation, college: e.target.value })
                }
                className="w-full outline-none  border-gray-600 px-[10px] py-[5px] text-[18px] border-1 rounded-lg"
              />
              <input
                type="text"
                placeholder="degree"
                value={newEducation.degree}
                onChange={(e) =>
                  setNeweducation({ ...newEducation, degree: e.target.value })
                }
                className="w-full outline-none  border-gray-600 px-[10px] py-[5px] text-[18px] border-1 rounded-lg"
              />
              <input
                type="text"
                placeholder="course"
                value={newEducation.course}
                onChange={(e) =>
                  setNeweducation({ ...newEducation, course: e.target.value })
                }
                className="w-full outline-none  border-gray-600 px-[10px] py-[5px] text-[18px] border-1 rounded-lg"
              />
              <button
                className="w-[30%] h-[40px] border-2 mt-[10px] bg-cyan-500 outline-none  rounded-full cursor-pointer text-white "
                onClick={addEducation}
              >
                Add Education
              </button>
            </div>
          </div>
          <div className="w-full p-[10px] border-1 border-gray-600 flex flex-col gap-[10px] rounded-lg ">
            <h1 className="text-semibold">Experience</h1>
            {experience && (
              <div>
                {experience.map((exp, index) => (
                  <div
                    key={index}
                    className="w-full  h-[80px] border-none
                     bg-slate-300 rounded-xl flex justify-between items-center my-[5px] px-[10px] py-[5px] text-gray-800 "
                  >
                    <div>
                      <div>Title : {exp.title} </div>
                      <div>Company : {exp.company}</div>
                      <div>Description : {exp.description}</div>
                    </div>
                    <RxCross1
                      className="w-[20px] h-[20px] text-gray-800 font-bold  cursor-pointer"
                      onClick={() => {
                        removeExperience(exp);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            <div action="" className=" w-full flex flex-col gap-[10px]">
              <input
                type="text"
                placeholder="title"
                value={newExperience.title}
                onChange={(e) =>
                  setNewexperience({ ...newExperience, title: e.target.value })
                }
                className="w-full outline-none  border-gray-600 px-[10px] py-[5px] text-[18px] border-1 rounded-lg"
              />
              <input
                type="text"
                placeholder="company"
                value={newExperience.company}
                onChange={(e) =>
                  setNewexperience({
                    ...newExperience,
                    company: e.target.value,
                  })
                }
                className="w-full outline-none  border-gray-600 px-[10px] py-[5px] text-[18px] border-1 rounded-lg"
              />
              <input
                type="text"
                placeholder="description"
                value={newExperience.description}
                onChange={(e) =>
                  setNewexperience({
                    ...newExperience,
                    description: e.target.value,
                  })
                }
                className="w-full outline-none  border-gray-600 px-[10px] py-[5px] text-[18px] border-1 rounded-lg"
              />
              <button
                className="w-[30%] h-[40px] border-2 mt-[10px] bg-cyan-500 outline-none  rounded-full cursor-pointer text-white "
                onClick={addExperience}
              >
                Add Expperince
              </button>
            </div>
          </div>
          <button
            className="w-[30%] h-[40px] border-2 mt-[10px] bg-blue-500 outline-none  rounded-full cursor-pointer text-white "
            onClick={() => handleSaveProfile()}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
