/* eslint-disable react/no-unescaped-entities */
// eslint-disable-next-line no-unused-vars
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from '../api/axios';
import { authActions } from "../store/auth";
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const Login = () => {
  const [Data, setData] = useState({ email: "", password: "", deviceID: "" });
  const history = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  if (isLoggedIn === true) {
    history("/");
  }

  const getDeviceId = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId; // This is the unique persistent device ID
  };

  const dispatch = useDispatch();
  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };
  const submit = async (e) => {
    e.preventDefault();
    try {
      if (Data.email === "" || Data.password === "") {
        alert("All fields are required");
      } else {
        const deviceId = await getDeviceId();
        const response = await axios.post('/auth/login', { email:Data.email, password:Data.password, deviceId, });
        console.log(response);
        setData({ email: "", password: "" });
        dispatch(authActions.login());
        history("/profile");
        dispatch(authActions.changeRole(response.data.role));
        localStorage.setItem("id", response.data._id);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
      }
    } catch (error) {
      alert(error.response.data.error);
    }
  };
  return (
    <div className="h-screen bg-zinc-900 px-12 py-8 flex items-center justify-center">
      <div className="bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-3/6 lg:w-2/6">
        <p className="text-zinc-200 text-xl">Login</p>
        <div className="mt-4">
          <div>
            <label htmlFor="" className="text-zinc-400">
              Email
            </label>
            <input
              type="text"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="email"
              name="email"
              required
              value={Data.email}
              onChange={change}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="" className="text-zinc-400">
              Password
            </label>
            <input
              type="password"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none "
              placeholder="password"
              name="password"
              required
              value={Data.password}
              onChange={change}
            />
          </div>
          <div className="mt-4">
            <button
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-all duration-300"
              onClick={submit}
            >
              LogIn
            </button>
          </div>
          <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold">
            Or
          </p>
          <p className="flex mt-4 items-center justify-center text-zinc-500 font-semibold">
            Don't have an account? &nbsp;
            <Link to="/signup" className="hover:text-blue-500">
              <u>Sign Up</u>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
