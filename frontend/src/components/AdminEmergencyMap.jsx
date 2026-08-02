import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import L from "leaflet";

import RoutePolyline from "./RoutePolyline";

import "leaflet/dist/leaflet.css";

const patientIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",

  iconSize: [35, 35],
});

const ambulanceIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2967/2967350.png",

  iconSize: [40, 40],
});

function AdminEmergencyMap({ emergency, routeInfo, setRouteInfo }) {
  const patient = {
    latitude: Number(emergency.latitude),
    longitude: Number(emergency.longitude),
  };

  const driver = {
    latitude: Number(emergency.ambulance?.latitude),

    longitude: Number(emergency.ambulance?.longitude),
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow">
      <MapContainer
        center={[patient.latitude, patient.longitude]}

        zoom={14}

        style={{
          height: "450px",
          width: "100%",
        }}
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Patient */}

        <Marker
          position={[patient.latitude, patient.longitude]}

          icon={patientIcon}
        >
          <Popup>
            <div>
              <h3 className="font-bold">👤 Patient Location</h3>

              <p>
                Emergency:
                {emergency.emergency_type}
              </p>

              <p>
                Severity:
                {emergency.severity}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Ambulance */}

        {emergency.ambulance && (
          <Marker
            position={[driver.latitude, driver.longitude]}

            icon={ambulanceIcon}
          >
            <Popup>
              <div>
                <h3 className="font-bold">🚑 Ambulance</h3>

                <p>
                  Driver:
                  {emergency.ambulance.driver?.name}
                </p>

                <p>
                  Vehicle:
                  {emergency.ambulance.vehicle_number}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route */}

        {emergency.ambulance && (
          <RoutePolyline
            start={driver}

            end={patient}

            onRouteInfo={setRouteInfo}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default AdminEmergencyMap;
