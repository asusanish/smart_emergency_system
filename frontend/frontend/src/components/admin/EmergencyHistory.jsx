import { useEffect, useState } from "react";

import api from "../../api/axios";

import Card from "../ui/Card";
import Badge from "../ui/Badge";

function EmergencyHistory() {
  const [emergencies, setEmergencies] = useState([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [severity, setSeverity] = useState("");

  const loadHistory = async () => {
    try {
      const response = await api.get("/admin/emergency-history", {
        params: {
          search,
          status,
          severity,
        },

        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setEmergencies(response.data.emergencies);
    } catch (error) {
      console.log(error.response?.data || error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [search, status, severity]);

  const getStatusVariant = (status) => {
    switch (status) {
      case "Completed":
        return "success";

      case "Cancelled":
        return "danger";

      case "Rejected":
        return "danger";

      case "Accepted":
        return "info";

      case "Assigned":
        return "info";

      case "Searching":
        return "warning";

      case "Pending":
        return "warning";

      default:
        return "secondary";
    }
  };

  const getSeverityVariant = (severity) => {
    switch (severity) {
      case "Critical":
        return "danger";

      case "High":
        return "warning";

      case "Medium":
        return "info";

      case "Low":
        return "success";

      default:
        return "secondary";
    }
  };

  return (
    <Card className="mt-8 p-6">
      <h2 className="text-2xl font-bold mb-5">📋 Emergency History</h2>

      {/* Filters */}

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"

          placeholder="Search patient..."

          className="border rounded-lg px-3 py-2"

          value={search}

          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2"

          value={status}

          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>

          <option value="Pending">Pending</option>

          <option value="Searching">Searching</option>

          <option value="Assigned">Assigned</option>

          <option value="Accepted">Accepted</option>

          <option value="On The Way">On The Way</option>

          <option value="Completed">Completed</option>

          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          className="border rounded-lg px-3 py-2"

          value={severity}

          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="">All Severity</option>

          <option value="Critical">Critical</option>

          <option value="High">High</option>

          <option value="Medium">Medium</option>

          <option value="Low">Low</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Patient</th>

              <th className="p-3">Driver</th>

              <th className="p-3">Ambulance</th>

              <th className="p-3">Type</th>

              <th className="p-3">Severity</th>

              <th className="p-3">Status</th>

              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {emergencies.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-5 text-gray-500">
                  No emergency records found
                </td>
              </tr>
            ) : (
              emergencies.map((emergency) => (
                <tr
                  key={emergency.id}

                  className="border-b"
                >
                  <td className="p-3 font-semibold">
                    {emergency.patient?.name ?? "Unknown"}
                  </td>

                  <td>{emergency.ambulance?.driver?.name ?? "Not Assigned"}</td>

                  <td>{emergency.ambulance?.vehicle_number ?? "-"}</td>

                  <td>{emergency.emergency_type ?? "-"}</td>

                  <td>
                    <Badge variant={getSeverityVariant(emergency.severity)}>
                      {emergency.severity ?? "-"}
                    </Badge>
                  </td>

                  <td>
                    <Badge variant={getStatusVariant(emergency.status)}>
                      {emergency.status}
                    </Badge>
                  </td>

                  <td>{new Date(emergency.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default EmergencyHistory;
