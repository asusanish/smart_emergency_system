import { useEffect } from "react";

function EmergencyToast({
  emergency,

  onClose,

  onView,

  soundEnabled,
}) {
  useEffect(() => {
    if (soundEnabled) {
      const audio = new Audio("/sounds/emergency.mp3");

      audio.play().catch(() => {});
    }

    const timer = setTimeout(() => {
      onClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  if (!emergency) return null;

  return (
    <div
      className="
fixed
top-6
right-6
z-50
w-96
bg-white
shadow-2xl
border-l-8
border-red-600
rounded-xl
p-5
"
    >
      <div
        className="
flex
justify-between
items-center
"
      >
        <h2
          className="
text-xl
font-bold
text-red-600
"
        >
          🚨 Emergency Alert
        </h2>

        <button onClick={onClose}>✕</button>
      </div>

      <div className="mt-4">
        <p>
          <b>Patient:</b> {emergency.patient?.name}
        </p>

        <p>
          <b>Status:</b> {emergency.status}
        </p>

        <p>
          <b>Severity:</b>{" "}
          <span
            className="
text-red-600
font-bold
"
          >
            HIGH
          </span>
        </p>
      </div>

      <div
        className="
flex
gap-3
mt-5
"
      >
        <button
          onClick={() => onView(emergency)}

          className="
bg-red-600
text-white
px-4
py-2
rounded-lg
"
        >
          Open
        </button>

        <button
          onClick={onClose}

          className="
bg-gray-200
px-4
py-2
rounded-lg
"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default EmergencyToast;
