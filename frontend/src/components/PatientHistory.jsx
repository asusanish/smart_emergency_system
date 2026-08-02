import { useEffect, useState } from "react";
import api from "../api/axios";
import Card from "./ui/Card";

export default function PatientHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await api.get("/patient/history");

      console.log("Patient history:", res.data);

      setHistory(res.data.history || []);
    } catch (err) {
      console.error("History Error:", err);
    }
  };

  return (
    <Card className="p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">
        📜 Emergency History
      </h2>

      {history.length === 0 ? (
        <p className="text-gray-500">No emergency requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="text-left py-3 px-2">Emergency</th>
                <th className="text-left py-3 px-2">Severity</th>
                <th className="text-left py-3 px-2">Status</th>
                <th className="text-left py-3 px-2">Date</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">{item.emergency_type}</td>
                  <td className="py-3 px-2">{item.severity}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Accepted"
                          ? "bg-blue-100 text-blue-700"
                          : item.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}