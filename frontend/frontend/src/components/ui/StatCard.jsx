import Card from "./Card";

export default function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <Card>

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div className="text-4xl">
          {icon}
        </div>

      </div>

    </Card>
  );
}