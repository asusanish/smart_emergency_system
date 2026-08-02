export default function Input({
  label,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-2">
      <label className="font-medium text-gray-700">
        {label}
      </label>

      <input
        className={`w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
        {...props}
      />
    </div>
  );
}