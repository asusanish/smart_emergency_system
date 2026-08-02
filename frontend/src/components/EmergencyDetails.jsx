import { useEffect, useState } from "react";
import api from "../api/axios";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import EmergencyTimeline from "./EmergencyTimeline";

import {
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Navigation,
  ExternalLink
} from "lucide-react";

export default function EmergencyDetails({ selectedEmergency, updateStatus }) {
  const [timeline, setTimeline] = useState([]);

  const loadTimeline = async (id) => {
    try {
      const response = await api.get(`/emergency/${id}/timeline`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Timeline API:", response.data);

      setTimeline(response.data.timeline);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!selectedEmergency) return;

    loadTimeline(selectedEmergency.id);
  }, [selectedEmergency]);

  if (!selectedEmergency) return null;

  return (
    <Card>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex gap-2 items-center">
          <AlertTriangle className="text-red-500" />

          {selectedEmergency.emergency_type}
        </h2>

        <Badge>{selectedEmergency.status}</Badge>
      </div>

      <div className="space-y-5 mt-6">
        <p className="flex gap-2">
          <Clock size={18} />

          <strong>Severity:</strong>

          {selectedEmergency.severity}
        </p>

        <p className="flex gap-2">
          <MapPin size={18} />
          {selectedEmergency.latitude},{selectedEmergency.longitude}
        </p>

        <div>
          <p className="font-semibold mb-2">Description</p>

          <p className="text-gray-600">{selectedEmergency.description}</p>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        

        <div className="flex flex-wrap gap-3 mt-8">

  {selectedEmergency.status === "Pending" && (
    <>
      <Button
        variant="success"
        onClick={() =>
          updateStatus(selectedEmergency.id, "Accepted")
        }
      >
        ✅ Accept
      </Button>

      {/* <Button
        variant="danger"
        onClick={() =>
          updateStatus(selectedEmergency.id, "Rejected")
        }
      >
        ❌ Reject
      </Button> */}
      <Button
            variant="danger"
            onClick={() =>
                updateStatus(
                    selectedEmergency.id,
                    "Rejected"
                )
            }
        >
            ❌ Reject
        </Button>
    </>
  )}

  {selectedEmergency.status === "Accepted" && (
    <Button
      variant="primary"
      onClick={() =>
        updateStatus(selectedEmergency.id, "On The Way")
      }
    >
      🚑 On The Way
    </Button>
  )}

  {selectedEmergency.status === "On The Way" && (
    <>
      <Button
        variant="success"
        onClick={() =>
          updateStatus(selectedEmergency.id, "Completed")
        }
      >
        ✅ Completed
      </Button>

      <Button
        variant="secondary"
        onClick={() => {
          const origin =
            `${selectedEmergency.ambulance.latitude},${selectedEmergency.ambulance.longitude}`;

          const destination =
            `${selectedEmergency.latitude},${selectedEmergency.longitude}`;

          window.open(
            `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`,
            "_blank"
          );
        }}
      >
        🗺 Navigate
      </Button>
    </>
  )}

</div>

        
      </div>

      {/* Timeline */}

      <div className="mt-8">
        <EmergencyTimeline timeline={timeline} />
      </div>
    </Card>
  );
}
