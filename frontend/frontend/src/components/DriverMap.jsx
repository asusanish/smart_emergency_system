import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { patientIcon, ambulanceIcon } from "../utils/mapIcons";
import RoutePolyline from "./RoutePolyline";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function DriverMap({ patient, driver, onRouteInfo }) {
  if (!patient) return null;

  return (
    <MapContainer
      center={[patient.latitude, patient.longitude]}
      zoom={14}
      className="h-[450px] rounded-2xl"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Patient */}

      <Marker
        icon={patientIcon}
        position={[patient.latitude, patient.longitude]}
      >
        <Popup>🚨 Patient</Popup>
      </Marker>

      {/* Ambulance */}

      {driver && (
        <Marker
          icon={ambulanceIcon}
          position={[driver.latitude, driver.longitude]}
        >
          <Popup>🚑 Ambulance</Popup>
        </Marker>
      )}

      {/* Real Road Route */}

      {driver && (
        <RoutePolyline from={driver} to={patient} onRouteInfo={onRouteInfo} />
      )}
    </MapContainer>
  );
}
