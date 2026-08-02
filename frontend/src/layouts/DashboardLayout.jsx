import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function DashboardLayout({ title, children, rightContent }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

    const loadUser = async () => {
      try {
        const res = await api.get("/user/profile");

        setUser(res.data.profile);
      } catch (err) {
        console.log(err);
      }
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">{title}</h1>

        <div className="flex items-center gap-4 relative" ref={menuRef}>
          {rightContent}

          {/* Profile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold shadow">
              {" "}
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs text-gray-500">Welcome back</p>

              <p className="font-semibold">{user?.name}</p>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-14 w-56 bg-white rounded-xl shadow-xl border overflow-hidden z-50">
              <div className="px-4 py-4 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-800">
                  {user?.name || "User"}
                </h3>

                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              <Link
                to={role === "driver" ? "/driver/profile" : "/patient/profile"}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 hover:bg-gray-100"
              >
                👤 My Profile
              </Link>

              <Link
                to={role === "driver" ? "/driver/history" : "/patient/history"}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 hover:bg-gray-100"
              >
                📜 History
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 border-t"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}
