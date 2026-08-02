import { useEffect, useState } from "react";
import api from "../../api/axios";

import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import AmbulanceModal from "./AmbulanceModal";

function AmbulanceManagement() {
  const [ambulances, setAmbulances] = useState([]);
  const [selectedAmbulance,setSelectedAmbulance] = useState(null);

  const loadAmbulances = async () => {
    try {
      const response = await api.get("/admin/ambulances", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setAmbulances(response.data.ambulances);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadAmbulances();
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case "Available":
        return "success";

      case "Busy":
        return "danger";

      case "Offline":
        return "secondary";

      default:
        return "warning";
    }
  };


  return (
    <Card className="mt-8 p-6">
      <h2 className="text-2xl font-bold mb-5">🚑 Ambulance Management</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Vehicle</th>

              <th className="p-3">Driver</th>

              <th className="p-3">Phone</th>

              <th className="p-3">Status</th>

              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {ambulances.map((ambulance) => (
              <tr key={ambulance.id} className="border-b">
                <td className="p-3 font-semibold">
                  {ambulance.vehicle_number}
                </td>

                <td>{ambulance.driver?.name ?? "Not Assigned"}</td>

                <td>{ambulance.driver?.phone ?? "-"}</td>

                <td>
                  <Badge variant={getStatusVariant(ambulance.status)}>
                    {ambulance.status}
                  </Badge>
                </td>

                <td>
                  <Button onClick={() => setSelectedAmbulance(ambulance)}>
                    👁 View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AmbulanceModal
        ambulance={selectedAmbulance}

        onClose={() => setSelectedAmbulance(null)}
      />
    </Card>
  );
}

export default AmbulanceManagement;
