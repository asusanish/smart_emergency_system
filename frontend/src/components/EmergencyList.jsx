import Card from "./ui/Card";
import Badge from "./ui/Badge";

export default function EmergencyList({
  emergencies,
  selectedEmergency,
  setSelectedEmergency,
  setDriverLocation,
}) {
  return (
    <Card className="mt-8">
      <h2 className="text-xl font-bold mb-6">
        Assigned Emergencies
      </h2>

      <div className="space-y-4">
        {emergencies.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedEmergency(item);
               loadTimeline(item.id);

              setDriverLocation({
                latitude: Number(item.ambulance.latitude),
                longitude: Number(item.ambulance.longitude),
              });
            }}
            className={`cursor-pointer rounded-xl border p-5 transition hover:border-blue-500 hover:bg-slate-50 ${
              selectedEmergency?.id === item.id
                ? "border-blue-500 bg-blue-50"
                : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">
                  {item.emergency_type}
                </h3>

                <p className="text-gray-500 mt-1">
                  {item.description}
                </p>
              </div>

              <Badge>{item.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}