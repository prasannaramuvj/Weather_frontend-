import React from "react";
import Top from "../component/Top";
import { useNavigate } from "react-router-dom";
import Bottom from "../component/Bottom";

const Dashboard = () => {
  const username = localStorage.getItem("username") || "hai";

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("username");
    navigate("/");
  };
  return (
    <div>
      <div className="flex justify-between p-1">
        <h1>Hello Hi {username}</h1>
        <div className="">
          <button
            onClick={logout}
            className="bg-red-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
      <Top />
      <Bottom />
    </div>
  );
};

export default Dashboard;
