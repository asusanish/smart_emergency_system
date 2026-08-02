import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/ui/Card";
import { Users, Ambulance, Activity, CheckCircle } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import AdminEmergencyMap from "../components/AdminEmergencyMap";
import AdminEmergencyModal from "../components/AdminEmergencyModal";
import AmbulanceManagement from "../components/admin/AmbulanceManagement";
import UserManagement from "../components/admin/UserManagement";
import DriverManagement from "../components/admin/DriverManagement";
import EmergencyHistory from "../components/admin/EmergencyHistory";
import AdminAnalytics from "../components/admin/AdminAnalytics";
import LiveEmergency from "../components/admin/LiveEmergency";

function AdminDashboard() {
  const [data, setData] = useState(null);

  const loadDashboard = async () => {
    try {
      const response = await api.get("/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setData(response.data);
      if (selectedEmergency) {
        const updated = response.data.live_emergencies.find(
          (e) => e.id === selectedEmergency.id,
        );

        if (updated) {
          setSelectedEmergency(updated);
          loadTimeline(updated.id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(() => {
      loadDashboard();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityVariant = (severity) => {
    switch (severity) {
      case "Critical":
        return "danger";
      case "High":
        return "warning";
      case "Medium":
        return "info";
      default:
        return "success";
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Pending":
        return "warning";

      case "Accepted":
        return "success";

      case "On The Way":
        return "info";

      case "Waiting":
        return "secondary";

      case "Completed":
        return "success";

      default:
        return "secondary";
    }
  };

  const [selectedEmergency, setSelectedEmergency] = useState(null);

  const handleView = (item) => {
    console.log("VIEW ITEM:", item);

    if (!item) {
      console.log("No emergency selected");
      return;
    }
    setSelectedEmergency(item);
    loadTimeline(item.id);
  };

  const [timeline, setTimeline] = useState([]);

  const loadTimeline = async (id) => {
    try {
      const response = await api.get(`/emergency/${id}/timeline`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setTimeline(response.data.timeline || []);
    } catch (err) {
      console.log(err);
    }
  };

  const openEmergency = async (emergency) => {
    try {
      const response = await api.get(`/admin/emergencies/${emergency.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSelectedEmergency(response.data.emergency);
    } catch (error) {
      console.log(error.response?.data || error);
    }
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <PageHeader subtitle="Monitor ambulances, emergencies and system activity" />

      {data && (
        <div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total Users</p>

                  <h2 className="text-3xl font-bold mt-2">
                    {data.total_users}
                  </h2>
                </div>

                <Users className="text-blue-600" size={42} />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Ambulances</p>

                  <h2 className="text-3xl font-bold mt-2">
                    {data.total_ambulances}
                  </h2>
                </div>

                <Ambulance className="text-red-600" size={42} />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Available</p>

                  <h2 className="text-3xl font-bold mt-2 text-green-600">
                    {data.available_ambulances}
                  </h2>
                </div>

                <CheckCircle className="text-green-600" size={42} />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Active Emergencies</p>

                  <h2 className="text-3xl font-bold mt-2 text-red-600">
                    {data.active_emergencies}
                  </h2>
                </div>

                <Activity className="text-red-600" size={42} />
              </div>
            </Card>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mt-10 mb-5">🚨 Live Emergencies</h2>
      {/* <button
        onClick={() => setSoundEnabled(!soundEnabled)}

        className="
text-sm
bg-gray-100
px-3
py-2
rounded-lg
"
      >
        {soundEnabled ? "🔊 Sound" : "🔇 Muted"}
      </button> */}

      {data?.live_emergencies?.length === 0 ? (
        <Card className="text-center py-8">
          <h3 className="text-lg font-semibold text-gray-600">
            No Active Emergencies
          </h3>
          <p className="text-gray-500 mt-2">
            Everything looks good. There are currently no active emergency
            requests.
          </p>
        </Card>
      ) : (
        <table className="w-full border rounded-xl overflow-hidden">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-3">Patient</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Driver</th>
              <th>Vehicle</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data?.live_emergencies?.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">
                  {item.patient?.name ?? item.patient_name ?? "Unknown"}
                </td>

                <td>{item.emergency_type}</td>

                <td>
                  <Badge variant={getSeverityVariant(item.severity)}>
                    {item.severity}
                  </Badge>
                </td>

                <td>
                  <Badge variant={getStatusVariant(item.status)}>
                    {item.status}
                  </Badge>
                </td>

                <td>{item.ambulance?.driver?.name ?? "—"}</td>

                <td>{item.ambulance?.vehicle_number ?? "—"}</td>

                <td>
                  <Button size="sm" onClick={() => handleView(item)}>
                    👁 View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <AdminAnalytics />
      <LiveEmergency onViewEmergency={openEmergency} />
      <AmbulanceManagement />
      <DriverManagement />
      <UserManagement />
      <EmergencyHistory />

      {selectedEmergency && (
        <AdminEmergencyModal
          emergency={selectedEmergency}
          timeline={timeline}
          onClose={() => setSelectedEmergency(null)}
          getStatusVariant={getStatusVariant}
          getSeverityVariant={getSeverityVariant}
        />
      )}
    </DashboardLayout>
  );
}

export default AdminDashboard;
