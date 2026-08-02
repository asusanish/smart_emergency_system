import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import PageHeader from "../components/ui/PageHeader";
import DriverMap from "../components/DriverMap";
import DriverStatusCard from "../components/DriverStatusCard";
import Button from "../components/ui/Button";
import EmergencyDetails from "../components/EmergencyDetails";
import EmergencyList from "../components/EmergencyList";
import useDriverTracking from "../hooks/useDriverTracking";

import {
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Navigation,
} from "lucide-react";

function DriverDashboard() {
  const {
    emergencies,
    selectedEmergency,
    setSelectedEmergency,
    driverLocation,
    setDriverLocation,
    demoMode,
    setDemoMode,
    updateStatus,
  } = useDriverTracking();

  const [routeInfo, setRouteInfo] = useState({
    distance: 0,
    time: 0,
  });

    

  return (
    <DashboardLayout title="Driver Dashboard">
      <PageHeader
        title="Assigned Emergencies"
        subtitle="Manage and respond to emergency requests"
      />

      {/* Driver Status */}

      <DriverStatusCard demoMode={demoMode} setDemoMode={setDemoMode} />

      {emergencies.length === 0 ? (
        <Card>
          <div className="text-center py-10">
            <CheckCircle size={50} className="mx-auto text-green-500" />

            <h2 className="text-xl font-bold mt-4">No Active Emergency</h2>

            <p className="text-gray-500">Waiting for new requests...</p>
          </div>
        </Card>
      ) : (
        <>
          {/* Main Section */}

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Map */}

            <div className="lg:col-span-3">
              <Card>
                <h2 className="text-xl font-bold mb-5">
                  🗺 Live Emergency Map
                </h2>

                <DriverMap
                  patient={{
                    latitude: Number(selectedEmergency.latitude),
                    longitude: Number(selectedEmergency.longitude),
                  }}
                  driver={driverLocation}
                  onRouteInfo={setRouteInfo}

                  //   driver={{
                  //     latitude: Number(selectedEmergency.ambulance.latitude),
                  //     longitude: Number(selectedEmergency.ambulance.longitude),
                  //   }}
                  //   onRouteFound={setRouteInfo}
                />
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500">Distance</p>

                    <h2 className="text-xl font-bold text-blue-600">
                      {(routeInfo.distance / 1000).toFixed(2)} km
                    </h2>
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500">ETA</p>

                    <h2 className="text-xl font-bold text-green-600">
                      {Math.ceil(routeInfo.time / 60)} min
                    </h2>
                  </div>
                </div>
              </Card>
            </div>

            {/* Details */}

            <div className="lg:col-span-2">
              <div className="lg:col-span-2">
                <EmergencyDetails
                  selectedEmergency={selectedEmergency}
                  updateStatus={updateStatus}
                />
              </div>
            </div>
          </div>

          {/* Emergency List */}

          <EmergencyList
            emergencies={emergencies}
            selectedEmergency={selectedEmergency}
            setSelectedEmergency={setSelectedEmergency}
            setDriverLocation={setDriverLocation}
          />
        </>
      )}
    </DashboardLayout>
  );
}

export default DriverDashboard;
