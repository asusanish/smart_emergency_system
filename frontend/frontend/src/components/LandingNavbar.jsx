import { Ambulance } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingNavbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}

        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="bg-red-600 p-2 rounded-xl">
            <Ambulance className="text-white" size={28} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Smart EMS
            </h1>

            <p className="text-xs text-gray-500">
              Emergency Response System
            </p>
          </div>
        </div>

        {/* Navigation */}

        <nav className="hidden md:flex items-center gap-8">

          <button
            onClick={() => navigate("/")}
            className="font-medium text-gray-700 hover:text-red-600 transition"
          >
            Home
          </button>

          <a
            href="#features"
            className="font-medium text-gray-700 hover:text-red-600 transition"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="font-medium text-gray-700 hover:text-red-600 transition"
          >
            How It Works
          </a>

          <a
            href="#contact"
            className="font-medium text-gray-700 hover:text-red-600 transition"
          >
            Contact
          </a>

        </nav>

        {/* Right Buttons */}

        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition font-medium"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition font-medium shadow-md"
          >
            Register
          </button>

        </div>

      </div>
    </header>
  );
}