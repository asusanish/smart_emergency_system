import {
  Ambulance,
  LayoutDashboard,
  Siren,
  Truck,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-blue-700 text-white">

      <div className="flex items-center gap-3 p-6 border-b border-blue-500">

        <Ambulance size={34} />

        <div>

          <h1 className="font-bold text-xl">

            Smart Emergency

          </h1>

          <p className="text-sm opacity-80">

            Response System

          </p>

        </div>

      </div>

      <nav className="mt-6">

        <a
          href="/patient"
          className="flex items-center gap-3 px-6 py-4 hover:bg-blue-600"
        >
          <LayoutDashboard size={20}/>
          Dashboard
        </a>

        <a
          href="/driver"
          className="flex items-center gap-3 px-6 py-4 hover:bg-blue-600"
        >
          <Truck size={20}/>
          Driver
        </a>

        <a
          href="/admin"
          className="flex items-center gap-3 px-6 py-4 hover:bg-blue-600"
        >
          <Siren size={20}/>
          Admin
        </a>

      </nav>

    </aside>
  );
}