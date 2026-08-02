import { useEffect, useState } from "react";

import api from "../../api/axios";

import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

import DriverModal from "./DriverModal";

function DriverManagement() {
  const [drivers, setDrivers] = useState([]);

  const [selectedDriver, setSelectedDriver] = useState(null);

  const loadDrivers = async () => {
    try {
      const response = await api.get("/admin/drivers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setDrivers(response.data.drivers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadDrivers();
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
      <h2 className="text-2xl font-bold mb-5">🚗 Driver Management</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Driver</th>

              <th>Phone</th>

              <th>Ambulance</th>

              <th>Status</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id} className="border-b">
                <td className="p-3 font-semibold">{driver.name}</td>

                <td>{driver.phone ?? "-"}</td>

                <td>{driver.ambulance?.vehicle_number ?? "Not Assigned"}</td>

                <td>
                  <Badge variant={getStatusVariant(driver.status)}>
                    {driver.status}
                  </Badge>
                </td>

                <td>
                  <Button onClick={() => setSelectedDriver(driver)}>
                    👁 View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DriverModal
        driver={selectedDriver}

        onClose={() => setSelectedDriver(null)}
      />
    </Card>
  );
}

export default DriverManagement;
