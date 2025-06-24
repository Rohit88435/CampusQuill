import { useContext, useState } from "react";
import logo from "../assets/logo.png";
import { Navigate, useNavigate } from "react-router-dom";
import { authDataContext } from "../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { userDataContext } from "../Context/UserContext";

function SignIn() {
  let { userData, setUserData } = useContext(userDataContext);

  let [show, setShow] = useState(false);
  let { serverUrl } = useContext(authDataContext);

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [err, setErr] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result = await axios.post(
        serverUrl + "/api/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(result);
      setUserData(result.data);
      Navigate("/");
      setEmail("");
      setPassword("");
      setLoading(false);
      toast.success("sign In Successfully");
    } catch (error) {
      console.log("frontend error");
      setErr(error.response.data.message);
      setLoading(false);
      console.log(error);
    }
  };

  let navigate = useNavigate();
  return (
    <div className="w-[100%] h-screen bg-white flex flex-col justify-start items-center gap-[10px]">
      <div className="p-[30px] lg:p-[35px] w-full flex items-center">
        <img src={logo} alt="" className="w-[180px]" />
      </div>

      <form
        action=""
        className="w-[90%] max-w-[400px] h-[500px] border-1 rounded-lg border-cyan-50 md:shadow-2xl flex flex-col justify-center items-center gap-[20px]"
        onSubmit={handleSignIn}
      >
        <h1 className="text-[30px] text-blue-500 font-bold items-center mb-[20px]">
          Sign In
        </h1>

        <input
          type="email"
          name=""
          id=""
          placeholder="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
          className="w-[90%] h-[50px] border-1 rounded-md  pl-[10px] outline-none "
        />
        <div className="w-[90%] h-[50px] border-1 text-[18px] rounded-md  pl-[10px] outline-none flex items-center ">
          <input
            type={!show ? "password" : "text"}
            name=""
            id=""
            placeholder="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
            className="w-full h-full border-none text-[18px] rounded-md  outline-none "
          />
          <span
            className="pr-[5px] text-blue-400 cursor-pointer"
            onClick={() => {
              setShow((prev) => !prev);
            }}
          >
            show
          </span>
        </div>
        {err && <p className="text-center text-red-500">*{err}</p>}
        <button
          className="w-[80%] h-[40px] bg-blue-400 rounded-4xl mt-[15px] text-white font-semibold "
          disabled={loading}
        >
          {loading ? "Loading.." : "Sign In"}
        </button>
        <p>
          Register your account ?
          <span
            className="text-blue-500 cursor-pointer font-semibold hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}
export default SignIn;
