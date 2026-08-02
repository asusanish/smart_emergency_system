import { MapPinned, Ambulance, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <MapPinned size={36} className="text-red-600" />,
    title: "Live GPS Tracking",
    description:
      "Capture and monitor patient location accurately in real time.",
  },
  {
    icon: <Ambulance size={36} className="text-red-600" />,
    title: "Smart Dispatch",
    description:
      "Automatically assign the nearest available ambulance.",
  },
  {
    icon: <ShieldCheck size={36} className="text-red-600" />,
    title: "24/7 Emergency",
    description:
      "Emergency services available whenever they are needed.",
  },
];

export default function Features() {
  return (
    <section  id="features" className="max-w-7xl mx-auto px-6 py-20">

      <h2 className="text-4xl font-bold text-center">
        Why Choose Our System?
      </h2>

      <div className="grid md:grid-cols-3 gap-8 mt-16">

        {features.map((item, index) => (

          <div
            key={index}
            className="bg-white rounded-2xl p-8 shadow hover:shadow-xl transition"
          >

            {item.icon}

            <h3 className="text-xl font-bold mt-6">
              {item.title}
            </h3>

            <p className="text-slate-600 mt-3">
              {item.description}
            </p>

          </div>

        ))}

      </div>

    </section>
    
  );
}