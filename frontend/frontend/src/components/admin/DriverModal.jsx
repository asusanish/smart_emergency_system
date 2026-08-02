import Card from "../ui/Card";
import Button from "../ui/Button";

function DriverModal({ driver, onClose }) {
  if (!driver) return null;

  return (
    <div
      className="
        fixed inset-0
        bg-black/40
        flex
        justify-center
        items-center
        z-50
        "
    >
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">🚗 Driver Details</h2>

        <div className="space-y-3">
          <p>
            <b>Name:</b> {driver.name}
          </p>

          <p>
            <b>Email:</b> {driver.email}
          </p>

          <p>
            <b>Phone:</b> {driver.phone ?? "-"}
          </p>

          <p>
            <b>Status:</b> {driver.status}
          </p>

          <p>
            <b>Ambulance:</b>
            {driver.ambulance?.vehicle_number ?? "Not Assigned"}
          </p>
        </div>

        <Button className="mt-6" onClick={onClose}>
          Close
        </Button>
      </Card>
    </div>
  );
}

export default DriverModal;
