import {
  Ambulance,
  Siren,
  Clock3,
  ShieldCheck,
} from "lucide-react";

const stats = [
  {
    icon: Ambulance,
    value: "120+",
    title: "Ambulances",
    description: "Available across service areas",
    color: "bg-red-100 text-red-600",
  },
  {
    icon: Siren,
    value: "500+",
    title: "Emergencies",
    description: "Successfully handled",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Clock3,
    value: "8 min",
    title: "Average Response",
    description: "Fast emergency dispatch",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: ShieldCheck,
    value: "24/7",
    title: "Emergency Support",
    description: "Always ready to respond",
    color: "bg-purple-100 text-purple-600",
  },
];

export default function Stats() {
  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <span className="text-red-600 font-semibold uppercase tracking-widest">
            Our Impact
          </span>

          <h2 className="text-4xl font-bold text-slate-900 mt-3">
            Trusted Emergency Response
          </h2>

          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Our platform is designed to provide rapid emergency
            assistance through intelligent ambulance dispatch,
            GPS tracking, and real-time monitoring.
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group bg-slate-50 hover:bg-white rounded-3xl border border-slate-200 hover:border-red-200 shadow-sm hover:shadow-xl transition-all duration-300 p-8"
              >

                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.color}`}
                >
                  <Icon size={32} />
                </div>

                <h3 className="text-4xl font-extrabold text-slate-900 mt-8">
                  {item.value}
                </h3>

                <h4 className="text-xl font-semibold mt-2 text-slate-800">
                  {item.title}
                </h4>

                <p className="text-slate-500 mt-3">
                  {item.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}