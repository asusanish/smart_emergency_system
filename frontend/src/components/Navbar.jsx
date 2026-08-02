import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ title }) {

  const navigate = useNavigate();

 const user = JSON.parse(
    localStorage.getItem("user") || "{}"
);

  const logout = () => {

    localStorage.clear();

    navigate("/");

  };

  return (

    <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">

      <div>

        <h1 className="text-2xl font-bold">

          {title}

        </h1>

      </div>

      <div className="flex items-center gap-5">

        <Bell className="cursor-pointer"/>

        <div className="text-right">

          <p className="font-semibold">

            {user?.name}

          </p>

          <p className="text-sm text-gray-500">

            {user?.role}

          </p>

        </div>

        <button
    onClick={logout}
    className="p-2 rounded-lg hover:bg-gray-100 transition"
>

          <LogOut/>

        </button>

      </div>

    </header>

  );

}