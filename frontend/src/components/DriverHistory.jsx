import { useEffect, useState } from "react";
import api from "../api/axios";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

function DriverHistory() {
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    try {
      const response = await api.get("/driver/history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setHistory(response.data.history);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <Card className="mt-8 p-6">
      <h2 className="text-2xl font-bold mb-5">🚑 Emergency History</h2>

      {history.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No completed emergency history found
        </p>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="
                  border
                  rounded-xl
                  p-5
                  flex
                  justify-between
                  items-center
                  "
            >
              <div>
                <h3 className="font-bold text-lg">
                  {item.patient?.name || "Unknown Patient"}
                </h3>

                <p className="text-gray-500">
                  Ambulance: {item.ambulance?.vehicle_number || "N/A"}
                </p>

                <p className="text-sm text-gray-400">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>

              <Badge status={item.status} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default DriverHistory;
