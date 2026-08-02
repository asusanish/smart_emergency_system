import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function DashboardLayout({
  title,
  children,
}) {
  return (
    <div className="min-h-screen bg-slate-100">

      <Sidebar />

      <div className="ml-64">

        <Navbar title={title} />

        <main className="p-8">

          {children}

        </main>

      </div>

    </div>
  );
}