import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientHome from "./pages/PatientHome";
import DriverDashboard from "./pages/DriverDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EmergencyPublic from "./pages/EmergencyPublic";

import PatientProfile from "./pages/patient/PatientProfile";
import PatientHistoryPage from "./pages/patient/PatientHistory";

import DriverProfilePage from "./pages/driver/DriverProfile";
import DriverHistory from "./pages/DriverHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/emergency" element={<EmergencyPublic />} />

        <Route path="/patient" element={<PatientHome />} />

        <Route path="/driver" element={<DriverDashboard />} />

        <Route path="/admin" element={<AdminDashboard />} />

        {/* Patient */}
        <Route path="/patient/profile" element={<PatientProfile />} />

        <Route path="/patient/history" element={<PatientHistoryPage />} />

        {/* Driver */}
        <Route path="/driver/profile" element={<DriverProfilePage />} />

        <Route path="/driver/history" element={<DriverHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
