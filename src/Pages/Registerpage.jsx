import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Registerpage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    repassword: "",
  });

  const [registerError, setRegisterError] = useState("");

  const handleUsername = (e) => {
    const value = e.target.value;

    setUsername(value);

    if (value.trim().length < 3) {
      setErrors((prev) => ({
        ...prev,
        username: "Username must be at least 3 characters",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        username: "",
      }));
    }
  };

  const handlePassword = (e) => {
    const value = e.target.value;

    setPassword(value);

    if (value.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }

    if (repassword && value !== repassword) {
      setErrors((prev) => ({
        ...prev,
        repassword: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        repassword: "",
      }));
    }
  };

  const handleRepassword = (e) => {
    const value = e.target.value;

    setRepassword(value);

    if (password !== value) {
      setErrors((prev) => ({
        ...prev,
        repassword: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        repassword: "",
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setRegisterError("");

    if (!username || !password || !repassword) {
      setRegisterError("All fields are required");
      return;
    }

    if (errors.username || errors.password || errors.repassword) {
      return;
    }

    if (password !== repassword) {
      setRegisterError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/register`,
        {
          username,
          password,
        }
      );

      console.log(response.data);

      alert("Registration Successful!");

      // Optional: Save user data
      localStorage.setItem(
        "user",
        JSON.stringify({
          username,
        })
      );

      setUsername("");
      setPassword("");
      setRepassword("");

      navigate("/");
    } catch (err) {
      console.log(err?.response?.data || err.message);

      if (err.message === "Network Error") {
        setRegisterError(
          `Cannot connect to backend at ${API_BASE_URL}`
        );
      } else {
        setRegisterError(
          err?.response?.data?.msg ||
            err?.response?.data?.error ||
            "Registration failed. Please try again."
        );
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white w-[90%] md:w-[400px] p-10 flex flex-col gap-5 rounded-2xl shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center">
          REGISTER
        </h1>

        <div>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={handleUsername}
            className={`w-full p-3 rounded-lg border outline-none ${
              errors.username
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />

          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={handlePassword}
            className={`w-full p-3 rounded-lg border outline-none ${
              errors.password
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Re-enter password"
            value={repassword}
            onChange={handleRepassword}
            className={`w-full p-3 rounded-lg border outline-none ${
              errors.repassword
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />

          {errors.repassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.repassword}
            </p>
          )}
        </div>

        {registerError && (
          <p className="text-red-500 text-center text-sm">
            {registerError}
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
        >
          REGISTER
        </button>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-500 hover:underline"
          >
            LOGIN
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Registerpage;