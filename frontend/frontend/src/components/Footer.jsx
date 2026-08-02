import {
  Ambulance,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  Globe,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-slate-950 text-white"
    >
      {/* Background Glow */}

      <div className="absolute top-0 left-0 w-72 h-72 bg-red-600/10 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}

          <div>

            <div className="flex items-center gap-3">

              <div className="bg-red-600 p-3 rounded-xl">

                <Ambulance size={28} />

              </div>

              <div>

                <h2 className="text-2xl font-bold">

                  Smart EMS

                </h2>

                <p className="text-slate-400 text-sm">

                  Emergency Response System

                </p>

              </div>

            </div>

            <p className="mt-6 text-slate-400 leading-7">

              Smart EMS connects patients with nearby ambulances using
              GPS-based intelligent dispatch, helping reduce emergency
              response time and save lives.

            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-xl font-semibold mb-6">

              Quick Links

            </h3>

            <ul className="space-y-3 text-slate-400">

              <li>
                <a href="#" className="hover:text-red-400 transition">
                  Home
                </a>
              </li>

              <li>
                <a href="#features" className="hover:text-red-400 transition">
                  Features
                </a>
              </li>

              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-red-400 transition"
                >
                  How It Works
                </a>
              </li>

              <li>
                <a href="/login" className="hover:text-red-400 transition">
                  Login
                </a>
              </li>

              <li>
                <a href="/register" className="hover:text-red-400 transition">
                  Register
                </a>
              </li>

            </ul>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-xl font-semibold mb-6">

              Contact

            </h3>

            <div className="space-y-4 text-slate-400">

              <div className="flex items-center gap-3">

                <Phone size={18} className="text-red-400"/>

                +977 9800000000

              </div>

              <div className="flex items-center gap-3">

                <Mail size={18} className="text-red-400"/>

                smartems@gmail.com

              </div>

              <div className="flex items-center gap-3">

                <MapPin size={18} className="text-red-400"/>

                Kathmandu, Nepal

              </div>

            </div>

          </div>

          {/* Emergency */}

          <div>

            <h3 className="text-xl font-semibold mb-6">

              Emergency Notice

            </h3>

            <div className="bg-red-600/10 border border-red-500 rounded-2xl p-5">

              <HeartPulse className="text-red-500 mb-4"/>

              <p className="text-slate-300 leading-7">

                During medical emergencies, immediately request an
                ambulance through Smart EMS for rapid response and
                live tracking.

              </p>

            </div>

          </div>

        </div>

        {/* Divider */}

        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">

          <p className="text-slate-500 text-center">

            © 2026 Smart Emergency Response System.
            All Rights Reserved.

          </p>

          {/* Social */}

          <div className="flex gap-4">

            <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-red-600 transition flex items-center justify-center">

             <Globe size={18}/>

            </button>

            <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-red-600 transition flex items-center justify-center">

            <ShieldCheck size={18}/>

            </button>

            <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-red-600 transition flex items-center justify-center">

              <ArrowUpRight size={18}/>
            </button>

          </div>

        </div>

      </div>
    </footer>
  );
}