export default function TextArea({
  label,
  ...props
}) {
  return (
    <div className="space-y-2">
      <label className="font-medium">
        {label}
      </label>

      <textarea
        rows={4}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        {...props}
      />
    </div>
  );
}