import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { patientIcon } from "../utils/mapIcons";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function EmergencyMap({ location }) {
  if (!location) {
    return (
      <div className="h-[450px] rounded-2xl bg-slate-100 flex items-center justify-center text-gray-500">
        📍 Location not available
      </div>
    );
  }

  return (
    <MapContainer
      center={[location.latitude, location.longitude]}
      zoom={16}
      scrollWheelZoom={true}
      className="h-[450px] w-full rounded-2xl shadow-lg"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
        icon={patientIcon}
        position={[location.latitude, location.longitude]}
      >
        <Popup>
          <strong>Your Location</strong>
          <br />
          Emergency Position
        </Popup>
      </Marker>
    </MapContainer>
  );
}
