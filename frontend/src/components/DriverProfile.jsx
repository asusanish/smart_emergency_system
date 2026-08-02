import { useEffect, useState } from "react";
import api from "../api/axios";
import Card from "./ui/Card";
import Badge from "./ui/Badge";

function DriverProfile() {
  const [profile, setProfile] = useState(null);

  const loadProfile = async () => {
    try {
      const response = await api.get("/driver/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setProfile(response.data.profile);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (!profile) {
    return null;
  }

  return (
    <Card className="p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">👨‍🚑 Driver Profile</h2>

      <div
        className="
            grid
            md:grid-cols-2
            gap-5
            "
      >
        <div>
          <p className="text-gray-500">Name</p>

          <h3 className="font-bold">{profile.name}</h3>
        </div>

        <div>
          <p className="text-gray-500">Email</p>

          <h3 className="font-bold">{profile.email}</h3>
        </div>

        <div>
          <p className="text-gray-500">Phone</p>

          <h3 className="font-bold">{profile.phone || "N/A"}</h3>
        </div>

        <div>
          <p className="text-gray-500">Driver Status</p>

          <Badge status="Available" />
        </div>

        <div>
          <p className="text-gray-500">Ambulance</p>

          <h3 className="font-bold">
            🚑
            {profile.ambulance?.vehicle_number || "Not Assigned"}
          </h3>
        </div>
      </div>
    </Card>
  );
}

export default DriverProfile;
