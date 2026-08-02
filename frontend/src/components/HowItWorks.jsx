import {
  PhoneCall,
  MapPinned,
  Ambulance,
  Hospital,
} from "lucide-react";

const steps = [
  {
    icon: PhoneCall,
    title: "Request SOS",
    description: "Patient requests emergency assistance with a single tap.",
    color: "bg-red-500",
    pulse: "bg-red-300",
  },
  {
    icon: MapPinned,
    title: "Detect GPS",
    description: "The patient's live GPS location is captured automatically.",
    color: "bg-blue-500",
    pulse: "bg-blue-300",
  },
  {
    icon: Ambulance,
    title: "Dispatch",
    description: "The nearest available ambulance is assigned instantly.",
    color: "bg-green-500",
    pulse: "bg-green-300",
  },
  {
    icon: Hospital,
    title: "Reach Hospital",
    description: "The patient is transported safely to the hospital.",
    color: "bg-purple-500",
    pulse: "bg-purple-300",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-28 bg-gradient-to-br from-white via-slate-50 to-red-50"
    >
      {/* Background Blur */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-200 rounded-full blur-3xl opacity-20"></div>

      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}

        <div className="text-center">

          <span className="text-red-600 uppercase tracking-[0.25em] font-semibold">
            Process
          </span>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            How Smart EMS Works
          </h2>

          <p className="mt-5 max-w-3xl mx-auto text-slate-600 leading-8">
            Smart EMS minimizes emergency response time by intelligently
            dispatching the nearest available ambulance using live GPS tracking.
          </p>

        </div>

        {/* Timeline */}

        <div className="relative mt-24">

          {/* Gradient Line */}

          <div className="hidden lg:block absolute top-10 left-24 right-24 h-1 rounded-full bg-gradient-to-r from-red-300 via-blue-300 via-green-300 to-purple-300"></div>

          {/* Steps */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 relative">

            {steps.map((step, index) => {

              const Icon = step.icon;

              return (

                <div
                  key={index}
                  className="group flex flex-col items-center text-center"
                >

                  {/* Icon */}

                  <div className="relative">

                    {/* Pulse */}

                    <div
                      className={`absolute inset-0 rounded-full ${step.pulse} opacity-30 animate-ping`}
                    ></div>

                    {/* Glass Circle */}

                    <div
                      className={`
                        relative
                        w-20
                        h-20
                        rounded-full
                        ${step.color}
                        flex
                        items-center
                        justify-center
                        border-4
                        border-white
                        shadow-xl
                        backdrop-blur-xl
                        transition-all
                        duration-500
                        group-hover:scale-110
                        group-hover:-translate-y-2
                        group-hover:rotate-6
                      `}
                    >
                      <Icon className="text-white" size={34} />
                    </div>

                  </div>

                  {/* Step Number */}

                  <div className="mt-5 w-9 h-9 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white font-bold shadow-lg">

                    {index + 1}

                  </div>

                  {/* Card */}

                  <div className="mt-6 bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-md border border-white transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2 h-[206px]">

                    <h3 className="text-2xl font-bold tracking-tight text-slate-900">

                      {step.title}

                    </h3>

                    <p className="mt-4 text-slate-500 leading-7">

                      {step.description}

                    </p>

                  </div>

                </div>

              );

            })}

          </div>

        </div>

        {/* Bottom Divider */}

        <div className="mt-24 flex justify-center">

          <div className="w-40 h-1 rounded-full bg-gradient-to-r from-red-500 via-blue-500 via-green-500 to-purple-500"></div>

        </div>

      </div>
    </section>
  );
}