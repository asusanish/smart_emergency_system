import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ambulance, Mail, Lock } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../api/axios";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Login Successful");

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else if (response.data.user.role === "driver") {
        navigate("/driver");
      } else {
        navigate("/patient");
      }
    } catch (err) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* LEFT */}

      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-700 to-blue-500 text-white p-16">

        <div className="flex items-center gap-3 mb-10">
          <Ambulance size={50} />
          <div>
            <h1 className="text-4xl font-bold">
              Smart Emergency
            </h1>
            <p className="opacity-90">
              Response System
            </p>
          </div>
        </div>

        <h2 className="text-5xl font-bold leading-tight">
          Every Second
          <br />
          Counts.
        </h2>

        <p className="mt-6 text-lg opacity-90">
          Fast ambulance dispatch powered by smart technology.
        </p>

        <div className="mt-10 space-y-4 text-lg">
          <p>✅ GPS Enabled Dispatch</p>
          <p>✅ Real-time Driver Updates</p>
          <p>✅ Emergency Management</p>
        </div>

      </div>

      {/* RIGHT */}

      <div className="flex items-center justify-center bg-slate-100 p-8">

        <Card className="w-full max-w-md">

          <h2 className="text-3xl font-bold">
            Welcome Back 👋
          </h2>

          <p className="text-gray-500 mt-2 mb-8">
            Login to continue
          </p>

          <form onSubmit={login} className="space-y-6">

            <div className="relative">

              <Mail
                className="absolute left-4 top-[45px] text-gray-400"
                size={20}
              />

              <Input
                label="Email"
                placeholder="Enter email"
                className="pl-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>

            <div className="relative">

              <Lock
                className="absolute left-4 top-[45px] text-gray-400"
                size={20}
              />

              <Input
                type="password"
                label="Password"
                placeholder="Password"
                className="pl-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

            </div>

            <Button className="w-full">
              Login
            </Button>

          </form>

        </Card>

      </div>

    </div>
  );
}