import { Ambulance, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">

        {/* Left */}

        <div>

          <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold">
            🚑 Emergency Medical Services
          </span>

          <h1 className="text-5xl font-extrabold mt-6 leading-tight text-slate-900">
            Every Second Counts During
            <span className="text-red-600"> Emergencies.</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 leading-8">
            Smart Emergency Response System connects patients with
            the nearest available ambulance using real-time GPS
            tracking and intelligent dispatch.
          </p>

          <div className="flex gap-4 mt-10">

            <button
              onClick={() => navigate("/emergency")}
              className="bg-red-600 hover:bg-red-700 transition text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
            >
              <Ambulance size={22} />
              Request Ambulance
            </button>

            <button
              onClick={() => navigate("/login")}
              className="border border-slate-300 hover:bg-slate-100 transition px-8 py-4 rounded-xl font-semibold flex items-center gap-2"
            >
              Login
              <ArrowRight size={18} />
            </button>

          </div>

          <div className="flex gap-10 mt-12">

            <div>
              <h3 className="text-3xl font-bold text-red-600">24/7</h3>
              <p className="text-slate-500">Emergency Support</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-red-600">GPS</h3>
              <p className="text-slate-500">Live Tracking</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-red-600">Fast</h3>
              <p className="text-slate-500">Dispatch</p>
            </div>

          </div>

        </div>

        {/* Right */}

        <div className="flex justify-center">

          <div className="bg-white rounded-3xl shadow-xl h-[450px] flex items-center justify-center">
  <p className="text-6xl">🚑</p>
</div>

        </div>

      </div>
    </section>
  );
}