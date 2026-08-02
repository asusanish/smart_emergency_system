import { useEffect, useState } from "react";
import api from "../api/axios";
import Card from "./ui/Card";
import Button from "./ui/Button";

export default function AmbulanceSelection({ onSelect, location }) {
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {

  if(location?.latitude && location?.longitude){
      loadAmbulances();
  }

}, [location]);

  const loadAmbulances = async () => {

  console.log("Sending location:", location);

  try {
    const response = await api.get("/ambulances/nearby", {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    console.log("Ambulance response:", response.data);

    setAmbulances(response.data.ambulances);

  } catch (error) {
    console.log(error.response?.data || error);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return <p>Loading nearby ambulances...</p>;
  }

  if (ambulances.length === 0) {
    return <p>No available ambulances nearby.</p>;
  }

  return (
    <div className="space-y-4">
      {ambulances.map((ambulance) => (
        <Card key={ambulance.id}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg">
                🚑 {ambulance.vehicle_number}
              </h2>

              <p>Driver: {ambulance.driver?.name}</p>
              <p>Distance: {ambulance.distance} km</p>

              <p>ETA: {ambulance.eta} min</p>

              <p>Status: {ambulance.status}</p>
            </div>

            <Button onClick={() => onSelect(ambulance)}>Select</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
