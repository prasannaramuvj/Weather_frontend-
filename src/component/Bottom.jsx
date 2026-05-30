import React, { useState } from "react";
import axios from "axios";

import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Bottom = () => {
  const [name, setName] = useState("");
  const [weather, setWeather] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [fetchError, setFetchError] = useState("");

  const handleclick = async () => {
    try {
      // Current Weather
      const weatherResponse = await axios.get(
        `${API_BASE_URL}/api/weather?city=${name}`,
      );

      setWeather(weatherResponse.data);

      // 5-Day Forecast
      const forecastResponse = await axios.get(
        `${API_BASE_URL}/api/forecast?city=${name}`,
      );

      const dailyData = forecastResponse.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00"),
      );

      const labels = dailyData.map((item) =>
        new Date(item.dt_txt).toLocaleDateString("en-US", {
          weekday: "short",
        }),
      );

      const temps = dailyData.map((item) => item.main.temp);

      setChartData({
        labels,
        datasets: [
          {
            label: "Temperature (°C)",
            data: temps,
            tension: 0.4,
          },
        ],
      });
    } catch (err) {
      console.log(err?.response?.data || err.message);
      if (err.message === "Network Error") {
        setFetchError(
          `Cannot reach backend at ${API_BASE_URL}. Start the backend server or set VITE_API_BASE_URL in .env.`,
        );
      } else {
        setFetchError(err?.response?.data?.msg || err.message);
      }
    }
  };

  const now = new Date();

  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  const day = now.toLocaleDateString("en-US", {
    weekday: "long",
  });

  return (
    <>
      {/* Search */}
      <div className="flex gap-3 mx-150">
        <input
          type="search"
          className="bg-gray-500 p-3 rounded-lg text-white"
          placeholder="Enter city"
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleclick}
          className="bg-blue-500 px-5 rounded-lg text-white"
        >
          Search
        </button>
      </div>

      {fetchError && <p className="text-red-500 text-sm mt-3">{fetchError}</p>}

      {weather &&
        weather.sys &&
        weather.main &&
        weather.weather &&
        weather.weather[0] && (
          <div className="flex gap-8 items-start mt-6 mx-10">
            {/* Weather Card */}
            <div className="flex flex-col justify-between items-center w-[400px] gap-2 bg-gray-200 p-5 rounded-xl">
              <h1 className="text-3xl font-bold">
                {weather.name},<span> {weather.sys.country}</span>
              </h1>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather"
              />

              <h2>Date : {date}</h2>
              <h3>Time : {time}</h3>
              <h3>Day : {day}</h3>

              <h5 className="text-xl uppercase">
                {weather.weather[0].description}
              </h5>

              <h2 className="text-4xl font-bold">
                {weather.main.temp.toFixed(2)} °C
              </h2>

              <div className="flex gap-4">
                <span>MIN : {weather.main.temp_min.toFixed(2)} °C</span>

                <span>MAX : {weather.main.temp_max.toFixed(2)} °C</span>
              </div>
            </div>

            {/* Graph */}
            {chartData && (
              <div className="w-[650px] bg-white p-5 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  5-Day Forecast
                </h2>

                <Line data={chartData} />
              </div>
            )}
          </div>
        )}
    </>
  );
};

export default Bottom;
