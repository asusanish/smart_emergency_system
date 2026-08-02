import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import DriverMap from "./DriverMap";
import Notification from "./Notification";
import { getRouteETA } from "../utils/routeETA";
import Button from "./ui/Button";
import Card from "./ui/Card";

export default function PatientTracking() {
  const [eta, setEta] = useState(null);

  const [emergency, setEmergency] = useState(null);

  const [notification, setNotification] = useState("");

  // const [statusMessage, setStatusMessage] = useState("");

  const [logs, setLogs] = useState([]);

  const [lastLog, setLastLog] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [logs]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;

    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const loadEmergency = async () => {
    try {
      const response = await api.get("/patient/emergency/current", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data.emergency;

      //       console.log("Emergency:", data);
      // console.log("Ambulance:", data.ambulance);
      // console.log("Driver:", data.ambulance?.driver);
      // console.log("Status:", data.status);

      setEmergency(response.data.emergency);
      setLastLog(response.data.last_log);
      // setStatusMessage(response.data.message);
      setLogs(response.data.logs);

      console.log(response.data);
      console.log(response.data.message);

      //   console.log("Ambulance:", data.ambulance);
      //   console.log("Patient:", {
      //     latitude: data.latitude,
      //     longitude: data.longitude,
      //   });
      const routeETA = await getRouteETA(
        {
          latitude: Number(data.ambulance.latitude),

          longitude: Number(data.ambulance.longitude),
        },

        {
          latitude: Number(data.latitude),

          longitude: Number(data.longitude),
        },
      );
      console.log("Route ETA:", routeETA);

      setEta(routeETA);

      const distance = calculateDistance(
        Number(data.latitude),
        Number(data.longitude),

        Number(data.ambulance.latitude),
        Number(data.ambulance.longitude),
      );

      const speed = 40; // km/h

      const eta = (distance / speed) * 60;

      if (eta <= 5) {
        setNotification("Ambulance is 5 minutes away");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setEmergency(null);
        setEta(null);
        setNotification("");
        return;
      }
      console.log(error);
    }
  };

  useEffect(() => {
    loadEmergency();

    const interval = setInterval(() => {
      loadEmergency();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!emergency) {
    return (
      <div className="bg-green-50 border border-green-300 rounded-xl p-6 mt-6">
        <h2 className="text-xl font-bold text-green-700">
          ✅ No Active Emergency
        </h2>

        <p className="mt-2">Your emergency request has been completed.</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    if (status.includes("Accepted")) return "bg-green-100 text-green-700";

    if (status.includes("Completed")) return "bg-green-100 text-green-700";

    if (status.includes("rejected")) return "bg-red-100 text-red-700";

    if (status.includes("Searching")) return "bg-yellow-100 text-yellow-700";

    if (status.includes("Assigned")) return "bg-blue-100 text-blue-700";

    return "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    if (status.includes("Emergency Requested")) return "🚨";

    if (status.includes("Assigned")) return "🚑";

    if (status.includes("Searching")) return "🔍";

    if (status.includes("Accepted")) return "✅";

    if (status.includes("On The Way")) return "🚗";

    if (status.includes("Completed")) return "🏥";

    if (status.includes("rejected")) return "❌";

    return "📍";
  };

  return (
    <>
      <Notification message={notification} />
      <div>
        <h2 className="text-xl font-bold mb-5">🚑 Ambulance Tracking</h2>

        <DriverMap
          patient={{
            latitude: Number(emergency.latitude),
            longitude: Number(emergency.longitude),
          }}
          driver={{
            latitude: Number(emergency.ambulance.latitude),
            longitude: Number(emergency.ambulance.longitude),
          }}
        />
        <Card className="mt-6">
          <h2 className="text-xl font-bold mb-5">📋 Emergency Activity</h2>

          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-red-600"></div>

                  <div className="w-0.5 flex-1 bg-gray-300"></div>
                </div>

                <div className="flex-1 pb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getStatusIcon(log.status)}</span>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(log.status)}`}
                    >
                      {log.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(log.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <div ref={bottomRef}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <p className="mt-4 font-semibold">Status: {emergency.status}</p>
        {emergency.status === "Pending" && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 mt-5">
            <h2 className="font-bold text-yellow-700">
              ⏳ Waiting for driver to accept your request...
            </h2>
          </div>
        )}

        {emergency.status === "Reassigning" && (
          <Card className="bg-yellow-50 border border-yellow-300 p-5 mt-5">
            <h2 className="font-bold text-yellow-700">
              {lastLog && (
                <Card className="bg-blue-50 border border-blue-300 mt-5">
                  <p className="font-semibold">{lastLog}</p>
                </Card>
              )}
            </h2>

            <p className="mt-2">Searching for another nearby ambulance...</p>
          </Card>
        )}

        {emergency.status === "Waiting" && (
          <Card className="bg-blue-50 border border-blue-300 p-5 mt-5">
            <h2 className="font-bold text-blue-700 text-lg">
              🚑 Waiting for Available Ambulance
            </h2>

            <p className="mt-2">All nearby ambulances are currently busy.</p>

            <p>Your emergency request is still active.</p>

            <p className="mt-2 font-medium">
              The system will automatically assign the next available ambulance.
            </p>
          </Card>
        )}

        {(emergency.status === "Accepted" ||
          emergency.status === "On The Way") &&
          emergency?.ambulance?.driver && (
            <div className="bg-white rounded-xl shadow p-5 mt-5">
              <h2 className="font-bold text-xl mb-4">🚑 Driver Information</h2>

              <p>
                <strong>Name:</strong> {emergency.ambulance?.driver?.name}
              </p>

              <p>
                <strong>Vehicle:</strong> {emergency.ambulance.vehicle_number}
              </p>

              <p>
                <strong>Assigned Driver:</strong>{" "}
                {emergency.ambulance?.driver?.name}
              </p>

              <p>
                <strong>Phone:</strong> {emergency.ambulance.driver.phone}
              </p>
              <a href={`tel:${emergency.ambulance.driver.phone}`}>
                <Button variant="primary" className="w-full mt-4">
                  📞 Call Driver (Optional)
                </Button>
              </a>
            </div>
          )}
        {emergency.status === "Completed" && (
          <div className="bg-green-50 border border-green-300 rounded-xl p-5 mt-5">
            <h2 className="font-bold text-green-700">✅ Emergency Completed</h2>

            <p className="mt-2">
              Thank you for using Smart Emergency Response.
            </p>
          </div>
        )}

        <p className="mt-3 font-semibold">
          🚗 ETA:
          {eta
            ? `${eta.duration} minutes (${eta.distance} km)`
            : "Calculating..."}
        </p>
      </div>
    </>
  );
}
