const colors = {
  Pending: "bg-yellow-100 text-yellow-700",
  "On The Way": "bg-blue-100 text-blue-700",
  Arrived: "bg-purple-100 text-purple-700",
  Completed: "bg-green-100 text-green-700",
  Critical: "bg-red-100 text-red-700",
};

export default function Badge({ children }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${
        colors[children] || "bg-gray-100 text-gray-700"
      }`}
    >
      {children}
    </span>
  );
}