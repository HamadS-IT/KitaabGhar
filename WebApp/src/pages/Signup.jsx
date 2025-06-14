import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from '../api/axios';

const Signup = () => {
  const history = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  if (isLoggedIn === true) {
    history("/");
  }
  const [Data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic:"",
    role: "user", // Default role set to "user"
    question:"",
    answer:"",
    address:""
  });

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async () => {
    try {
      if (
        Data.name === ""                        ||
        Data.email === ""                       ||
        Data.password === ""                    ||
        Data.question === ""                    ||
        Data.answer === ""                      ||
        Data.address === ""
      ) {
        alert("All fields are required");
      } else {

        if (Data.profilePic === ""){Data.profilePic = "https://sectricity.com/wp-content/uploads/2023/05/Hacker-Cyber-Security-Internet-Sectricity.jpg"}
        const response = await axios.post(
          "/auth/register",
          Data
        );
        setData({ username: "", email: "", password: "", profilePic: "", role: "user" });
        alert(response.data.message);
        history("/login");
      }
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="h-auto bg-zinc-900 px-12 py-8 flex items-center justify-center">
      <div className="bg-zinc-800 rounded-lg px-8 py-5 w-full md:w-3/6 lg:w-2/6">
        <p className="text-zinc-200 text-xl">Sign Up</p>
        <div className="mt-4">
          <div className="mt-4">
            <label className="text-zinc-400">Select Role</label>
            <div className="flex flex-row justify-between mt-2 text-zinc-200">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={Data.role === "user"}
                  onChange={change}
                  className="mr-2"
                />
                User
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="publisher"
                  checked={Data.role === "publisher"}
                  onChange={change}
                  className="mr-2"
                />
                Publisher
              </label>
              {/* <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={Data.role === "admin"}
                  onChange={change}
                  className="mr-2"
                />
                Admin
              </label> */}
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="" className="text-zinc-400">
              Name
            </label>
            <input
              type="text"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="Jon Doe"
              name="name"
              required
              value={Data.name}
              onChange={change}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="" className="text-zinc-400">
              Email
            </label>
            <input
              type="text"
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none"
              placeholder="xyz@example.com"
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
            <label htmlFor="" className="text-zinc-400">
            Profile Picture Link
            </label>
            <input
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none "
              rows="5"
              placeholder="https://sectricity.com/wp-content/uploads/2023/05/Hacker-Cyber-Security-Internet-Sectricity.jpg"
              name="profilePic"
              value={Data.profilePic}
              onChange={change}
            />
          </div>
          
          <div className="mt-4">
            <label htmlFor="" className="text-zinc-400">
            Address
            </label>
            <textarea
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none "
              rows="5"
              placeholder="454 Isaac Frye Hwy, Wilton, New Hampshire"
              name="address"
              value={Data.address}
              required
              onChange={change}
            />

          </div>

          <div className="mt-4">
            <label htmlFor="" className="text-zinc-400">
            Security Question
            </label>
            <input
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none "
              placeholder="What is your University Name ?"
              name="question"
              required
              value={Data.question}
              onChange={change}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="" className="text-zinc-400">
            Security Question Answer
            </label>
            <input
              className="w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none "
              placeholder="UOK"
              name="answer"
              required
              value={Data.answer}
              onChange={change}
            />
          </div>
          <div className="mt-4">
            <button
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-all duration-300"
              onClick={submit}
            >
              SignUp
            </button>
          </div>
          <p className="flex mt-4 items-center justify-center text-zinc-200 font-semibold">
            Or
          </p>
          <p className="flex mt-4 items-center justify-center text-zinc-500 font-semibold">
            Already have an account? &nbsp;
            <Link to="/login" className="hover:text-blue-500">
              <u>LogIn</u>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
