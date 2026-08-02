export default function Select({
  label,
  children,
  ...props
}) {
  return (
    <div className="space-y-2">
      <label className="font-medium">
        {label}
      </label>

      <select
        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}