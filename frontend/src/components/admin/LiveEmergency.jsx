import { useEffect, useState } from "react";

import api from "../../api/axios";

import Card from "../ui/Card";

import EmergencyToast from "./EmergencyToast";

function LiveEmergency({ onViewEmergency }) {
  const [emergencies, setEmergencies] = useState([]);

  const [previousCount, setPreviousCount] = useState(0);
  const [newEmergency, setNewEmergency] = useState(null);

  const [alertHistory, setAlertHistory] = useState([]);

  const [soundEnabled, setSoundEnabled] = useState(true);

  const [lastEmergencyId, setLastEmergencyId] = useState(null);

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
        const latest = response.data.emergencies[0];

        if (latest && latest.id !== lastEmergencyId) {
          setNewEmergency(latest);

          setLastEmergencyId(latest.id);

          setAlertHistory((prev) => [latest, ...prev].slice(0, 5));
        }
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
    <>
      <EmergencyToast
        emergency={newEmergency}

        soundEnabled={soundEnabled}

        onClose={() => setNewEmergency(null)}

        onView={(emergency) => {
          if (onViewEmergency) {
            onViewEmergency(emergency);
          }

          setNewEmergency(null);
        }}
      />
      ;
      <Card className="p-6 mt-8">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">🚨 Live Emergencies</h2>

          <div
            className="
bg-red-100
text-red-700
px-4
py-2
rounded-full
font-bold
"
          >
            {emergencies.length} Active
          </div>

          <Card className="p-6 mt-6">
            <h3 className="text-xl font-bold mb-4">🔔 Recent Alerts</h3>

            {alertHistory.length === 0 ? (
              <p className="text-gray-500">No alerts yet</p>
            ) : (
              alertHistory.map((alert) => (
                <div
                  key={alert.id}

                  className="
border-b
py-3
"
                >
                  🚨
                  {alert.patient?.name}-{alert.status}
                </div>
              ))
            )}
          </Card>
        </div>

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
    </>
  );
}

export default LiveEmergency;
