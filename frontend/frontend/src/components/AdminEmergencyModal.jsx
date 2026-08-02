import { useState } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import AdminEmergencyMap from "./AdminEmergencyMap";
import EmergencyTimeline from "./EmergencyTimeline";
import {
  User,
  Phone,
  Ambulance,
  ShieldAlert,
  Car,
  Activity,
} from "lucide-react";
import Badge from "./ui/Badge";

import { PhoneCall, MapPin, Copy } from "lucide-react";

const openGoogleMaps = () => {
  const lat = emergency.latitude;
  const lng = emergency.longitude;

  window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
};

const copyLocation = () => {
  navigator.clipboard.writeText(
    `${emergency.latitude}, ${emergency.longitude}`,
  );
};

export default function AdminEmergencyModal({
  emergency,
  timeline,
  onClose,
  getStatusVariant,
  getSeverityVariant,
}) {
  if (!emergency) return null;

  const [routeInfo, setRouteInfo] = useState({
    distance: 0,
    time: 0,
  });
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-[95%] max-w-6xl max-h-[90vh] rounded-xl overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">🚨 Emergency #{emergency.id}</h2>

          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Patient Card */}
            <Card className="p-6 rounded-2xl shadow-sm border">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-100 p-3 rounded-xl">
                  <User className="text-red-600" size={22} />
                </div>

                <div>
                  <h3 className="text-xl font-bold">Patient</h3>
                  <p className="text-sm text-gray-500">
                    Emergency Request Information
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Name</span>
                  <span className="font-semibold">
                    {emergency.patient?.name ??
                      emergency.patient_name ??
                      "Unknown"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Phone size={16} />
                    Phone
                  </span>

                  <span className="font-semibold">{emergency.phone}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Ambulance size={16} />
                    Emergency
                  </span>

                  <span className="font-semibold">
                    {emergency.emergency_type}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-gray-500">
                    <ShieldAlert size={16} />
                    Severity
                  </span>

                  <Badge variant={getSeverityVariant(emergency.severity)}>
                    {emergency.severity}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Driver Card */}

            <Card className="p-6 rounded-2xl shadow-sm border">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Car className="text-blue-600" size={22} />
                </div>

                <div>
                  <h3 className="text-xl font-bold">Driver</h3>

                  <p className="text-sm text-gray-500">Assigned Ambulance</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Driver</span>

                  <span className="font-semibold">
                    {emergency.ambulance?.driver?.name ?? "Not Assigned"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Phone size={16} />
                    Phone
                  </span>

                  <span className="font-semibold">
                    {emergency.ambulance?.driver?.phone ?? "-"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Ambulance size={16} />
                    Vehicle
                  </span>

                  <span className="font-semibold">
                    {emergency.ambulance?.vehicle_number ?? "-"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-gray-500">
                    <Activity size={16} />
                    Status
                  </span>

                  <Badge variant={getStatusVariant(emergency.status)}>
                    {emergency.status}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          <Card className="mt-6 p-5">
            <h3 className="text-lg font-bold mb-4">⚡ Quick Actions</h3>

            <div className="grid md:grid-cols-4 gap-4">
              <a href={`tel:${emergency.phone}`}>
                <Button className="w-full">
                  <PhoneCall size={18} />
                  Call Patient
                </Button>
              </a>

              <a href={`tel:${emergency.ambulance?.driver?.phone}`}>
                <Button className="w-full">
                  <PhoneCall size={18} />
                  Call Driver
                </Button>
              </a>

              <Button onClick={openGoogleMaps}>
                <MapPin size={18} />
                Open Maps
              </Button>

              <Button onClick={copyLocation}>
                <Copy size={18} />
                Copy Location
              </Button>
            </div>
          </Card>
          <Card className="mt-6 p-5">
            <h2 className="text-xl font-bold mb-4">🗺 Live Tracking</h2>

            <AdminEmergencyMap
              emergency={emergency}
              setRouteInfo={setRouteInfo}
            />

            <div className="grid grid-cols-2 gap-4 mt-5">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-gray-500">Distance</p>

                <h2 className="text-xl font-bold text-blue-600">
                  {(routeInfo.distance / 1000).toFixed(2)}
                  km
                </h2>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-gray-500">ETA</p>

                <h2 className="text-xl font-bold text-green-600">
                  {Math.ceil(routeInfo.time / 60)}
                  min
                </h2>
              </div>
            </div>
          </Card>
          <EmergencyTimeline timeline={timeline} />
        </div>
      </div>
    </div>
  );
}
