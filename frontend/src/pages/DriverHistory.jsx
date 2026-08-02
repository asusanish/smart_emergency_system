import { useEffect, useState } from "react";

import api from "../api/axios";

import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";

export default function DriverHistory() {
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
    <DashboardLayout title="Emergency History">
      <h1 className="text-2xl font-bold mb-6">🚑 Completed Emergencies</h1>

      {history.length === 0 ? (
        <Card>
          <p className="text-gray-500">No emergency history found</p>
        </Card>
      ) : (
        <div className="space-y-5">
          {history.map((item) => (
            <Card key={item.id}>
              <div className="flex justify-between">
                <div>
                  <h2 className="font-bold text-lg">
                    Patient: {item.patient?.name}
                  </h2>

                  <p>Location: {item.location}</p>

                  <p className="text-sm text-gray-500">
                    Date: {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>

                <Badge
                  variant={item.status === "Completed" ? "success" : "danger"}
                >
                  {item.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
