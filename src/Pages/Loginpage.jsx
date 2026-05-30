import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Loginpage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();

  const handleusername = (e) => {
    const value = e.target.value;
    setUsername(value);
    setLoginError("");

    if (value.length < 3) {
      setErrors({ ...errors, username: "enter the valid username" });
    } else {
      setErrors({ ...errors, username: "" });
    }
  };

  const handlepassword = (e) => {
    const value = e.target.value;
    setPassword(value);
    setLoginError("");

    if (value.length < 3) {
      setErrors({ ...errors, password: "enter the valid password" });
    } else {
      setErrors({ ...errors, password: "" });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (username.trim().length < 3 || password.trim().length < 3) {
      setLoginError("Please enter a valid username and password.");
      return;
    }

    console.log("Username:", username);
    console.log("Password:", password);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        username,
        password,
      });

      localStorage.setItem("username", username);
      console.log(response.data);
      navigate("/dashboard");
    } catch (err) {
      console.log(err?.response?.data || err.message);
      if (err.message === "Network Error") {
        setLoginError(
          `Cannot reach backend at ${API_BASE_URL}. Start the backend server or set VITE_API_BASE_URL in .env.`,
        );
      } else {
        setLoginError(
          err?.response?.data?.msg ||
            err?.response?.data?.error ||
            "Login failed. Check your credentials.",
        );
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="bg-white w-[90%] md:w-[400px] h-auto flex flex-col justify-center p-10 gap-5 rounded-2xl shadow-lg"
        onSubmit={handleLogin}
      >
        <h1 className="text-3xl font-bold text-center mb-3">Login</h1>

        <input
          type="text"
          placeholder="Enter the username"
          className={`border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
            ${errors.username ? "border-red-500" : "border-gray-300"}`}
          value={username}
          onChange={handleusername}
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username}</p>
        )}

        <input
          type="password"
          placeholder="Enter the password"
          className={`border border-gray-300 p-3 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
            ${errors.password ? "border-red-500" : "border-gray-300"}`}
          value={password}
          onChange={handlepassword}
        />

        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          LOGIN
        </button>

        {loginError && (
          <p className="text-red-500 text-sm text-center">{loginError}</p>
        )}

        <p className="text-center text-gray-600">
          Don’t have an account?{" "}
          <span className="text-blue-500 cursor-pointer hover:underline">
            <Link to="/register">Register</Link>
          </span>
        </p>
      </form>
    </div>
  );
};

export default Loginpage;
