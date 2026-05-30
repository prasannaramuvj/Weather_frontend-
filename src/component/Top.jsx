import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function Top() {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cities = ["Chennai", "Delhi", "Mumbai", "Trichy"];

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const responses = await Promise.all(
          cities.map((city) =>
            axios.get(`${API_BASE_URL}/api/weather?city=${city}`),
          ),
        );

        setWeatherData(responses.map((res) => res.data));
        setError(null);
      } catch (error) {
        console.log(error);
        if (error.message === "Network Error") {
          setError(
            `Cannot reach backend at ${API_BASE_URL}. Start the backend server or set VITE_API_BASE_URL in .env.`,
          );
        } else {
          setError("Failed to fetch weather data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="p-4">
      {loading && (
        <p className="text-center text-lg">Loading weather data...</p>
      )}
      {error && <p className="text-center text-lg text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {weatherData.map((item) => (
          <div
            key={item.name || item.id || Math.random()}
            className="bg-blue-200 rounded-xl p-4 shadow-lg"
          >
            <h1 className="text-2xl font-bold">
              {item.name || "Unknown City"}
            </h1>

            <p className="text-xl">{item.main?.temp?.toFixed(1) ?? "N/A"} °C</p>

            <p>{item.weather?.[0]?.description ?? "No data"}</p>

            <p className="text-sm">Humidity: {item.main?.humidity ?? "N/A"}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Top;
