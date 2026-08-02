import { useEffect, useState } from "react";

import api from "../../api/axios";

import Card from "../ui/Card";

function LiveEmergency() {
  const [emergencies, setEmergencies] = useState([]);

  const [previousCount, setPreviousCount] = useState(0);

  const loadLive = async () => {
    try {
      const response = await api.get("/admin/live-emergencies", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const current = response.data.count;

      // New emergency detected

      if (current > previousCount) {
        alert("🚨 New Emergency Request Received!");
      }

      setPreviousCount(current);

      setEmergencies(response.data.emergencies);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadLive();

    const interval = setInterval(loadLive, 5000);

    return () => clearInterval(interval);
  }, [previousCount]);

  return (
    <Card className="p-6 mt-8">
      <h2 className="text-2xl font-bold mb-5">🚨 Live Emergencies</h2>

      {emergencies.length === 0 ? (
        <p className="text-gray-500">No active emergencies</p>
      ) : (
        <div className="space-y-4">
          {emergencies.map((emergency) => (
            <div
              key={emergency.id}

              className="
border rounded-xl
p-4
flex
justify-between
items-center
"
            >
              <div>
                <h3 className="font-bold">{emergency.patient?.name}</h3>

                <p>{emergency.status}</p>
              </div>

              <div>
                🚑
                {emergency.ambulance
                  ? emergency.ambulance.vehicle_number
                  : "Searching..."}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default LiveEmergency;
