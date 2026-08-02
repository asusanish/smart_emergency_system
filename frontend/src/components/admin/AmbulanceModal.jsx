import { useState } from "react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

function AmbulanceModal({ ambulance, onClose }) {
  const [status, setStatus] = useState(ambulance?.status || "");
  if (!ambulance) return null;

  return (
    <div
      className="
        fixed inset-0 
bg-black/40
flex items-center justify-center
z-50
"
    >
      <Card className="w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">🚑 Ambulance Details</h2>

          <Button onClick={onClose}>✕</Button>
        </div>

        <div className="space-y-3">
          <p>
            <strong>Vehicle:</strong> {ambulance.vehicle_number}
          </p>

          <p>
            <strong>Driver:</strong> {ambulance.driver?.name ?? "Not Assigned"}
          </p>

          <p>
            <strong>Phone:</strong> {ambulance.driver?.phone ?? "-"}
          </p>

          <div>
            <strong>Status:</strong>

            <Badge>{ambulance.status}</Badge>
          </div>
        </div>

        <hr className="my-5" />

        <h3 className="font-bold mb-3">Change Status</h3>

        <div className="flex gap-3">
          <Button>🟢 Available</Button>

          <Button>🔴 Busy</Button>

          <Button>⚫ Offline</Button>
        </div>
      </Card>
    </div>
  );
}

export default AmbulanceModal;
