import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EmergencyPublic() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    emergency_type: "Accident",
    description: "",
  });

  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setMessage("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setMessage("📍 Location detected");
      },
      () => {
        setMessage("Please enable location access.");
      },
      {
        enableHighAccuracy: true,
      },
    );
  };

  const sendSOS = async () => {
    if (!location) {
      alert("Waiting for your location...");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/public-emergency", {
        ...form,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      console.log(response.data);

      setMessage("🚑 Emergency request sent successfully");

      // Save emergency ID if returned
      if (response.data.emergency?.id) {
        localStorage.setItem("currentEmergencyId", response.data.emergency.id);
      }

      setTimeout(() => {
        navigate("/patient");
      }, 1000);
    } catch (err) {
      console.error(err);

      setMessage(
        err.response?.data?.message || "Failed to send emergency request.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex justify-center items-center p-6">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-4xl font-black text-center text-red-600">
          🚨 EMERGENCY SOS
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Your location will be sent to the nearest ambulance.
        </p>

        <input
          name="name"
          placeholder="Your Name"
          className="w-full border rounded-lg p-3 mb-3"
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          className="w-full border rounded-lg p-3 mb-3"
          onChange={handleChange}
        />

        <select
          name="emergency_type"
          className="w-full border rounded-lg p-3 mb-3"
          onChange={handleChange}
        >
          <option>Accident</option>
          <option>Medical Emergency</option>
          <option>Fire</option>
        </select>

        <textarea
          name="description"
          placeholder="Describe the emergency..."
          className="w-full border rounded-lg p-3 mb-5"
          rows="4"
          onChange={handleChange}
        />

        <button
          onClick={getLocation}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mb-4"
        >
          📍 Refresh Location
        </button>

        <button
          disabled={!location || loading}
          onClick={sendSOS}
          className={`w-full py-5 rounded-full text-2xl font-bold transition ${
            !location || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 animate-pulse text-white"
          }`}
        >
          {loading ? "Sending..." : "🚨 SEND SOS"}
        </button>

        <p className="mt-5 text-center font-medium">{message}</p>
      </div>
    </div>
  );
}
