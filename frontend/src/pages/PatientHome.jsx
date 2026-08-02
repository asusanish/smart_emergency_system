import { useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { motion } from "framer-motion";
import { MapPin, Car, HeartPulse, Flame } from "lucide-react";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import TextArea from "../components/ui/TextArea";
import Badge from "../components/ui/Badge";
import PageHeader from "../components/ui/PageHeader";
import { toast } from "react-hot-toast";
import AmbulanceSelection from "../components/AmbulanceSelection";

import PatientTracking from "../components/PatientTracking";
import EmergencyMap from "../components/EmergencyMap";
import UserProfile from "../components/UserProfile";
import PatientHistory from "../components/PatientHistory";


function PatientHome() {
  const [type, setType] = useState("Accident");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [showAmbulances, setShowAmbulances] = useState(false);
  const [showCompletedCard, setShowCompletedCard] = useState(false);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setSelectedAmbulance(null);
        setShowAmbulances(false);
        setMessage("Location captured ✅");

        setTimeout(() => {
          setMessage("");
        }, 3000);
      },
      () => {
        setMessage("Location permission denied");
      },
    );
  };

  const sendSOS = async () => {
    if (!location) {
      toast.error("Please get your location first.");
      return;
    }

    if (!selectedAmbulance) {
      toast.error("Please select an ambulance.");
      return;
    }

    try {
      const response = await api.post(
        "/emergency",
        {
          ambulance_id: selectedAmbulance.id,
          emergency_type: type,
          severity: "Critical",
          latitude: location.latitude,
          longitude: location.longitude,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      toast.success("Emergency request sent successfully!");

      console.log(response.data);

      //   setMessage(
      //     `Request sent to ${selectedAmbulance.driver?.name}. Waiting for driver response...`,
      //   );
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Emergency request failed.");
    }
  };

  // return(

  //         <DashboardLayout title="Patient Dashboard">

  //         <h1>
  //             Smart Emergency Response 🚑
  //         </h1>

  //         <h2>
  //             Emergency SOS
  //         </h2>

  //         <button
  //         onClick={getLocation}
  //         >
  //             📍 Get Current Location
  //         </button>

  //         <br/><br/>

  //         <select
  //         value={type}
  //         onChange={(e)=>setType(e.target.value)}
  //         >

  //             <option>
  //                 Accident
  //             </option>

  //             <option>
  //                 Medical Emergency
  //             </option>

  //             <option>
  //                 Fire
  //             </option>

  //         </select>

  //         <br/><br/>

  //         <textarea

  //         placeholder="Describe emergency"

  //         value={description}

  //         onChange={(e)=>setDescription(e.target.value)}

  //         />

  //         <br/><br/>

  //         <button
  //         onClick={sendSOS}
  //         >

  //             🚨 SEND SOS

  //         </button>

  //         <h3>
  //             {message}
  //         </h3>

  //     </DashboardLayout>

  // )
  return (
    <DashboardLayout title="Patient Dashboard">
      <PageHeader
        title="Emergency Assistance"
        subtitle="Request ambulance support when you need it most"
      />

      
      <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white mb-8">
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendSOS}
            className="h-40 w-40 rounded-full bg-white text-red-600 text-3xl font-bold shadow-xl"
          >
            🚨
            <br />
            SOS
          </motion.button>

          <p className="mt-5 text-lg">Press only during emergency</p>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card
          className={`cursor-pointer ${
            type === "Accident" ? "ring-2 ring-blue-500" : ""
          }`}
          onClick={() => setType("Accident")}
        >
          <Car size={35} className="text-blue-600" />

          <h3 className="font-bold mt-3">Accident</h3>

          <p className="text-gray-500">Road accidents</p>
        </Card>

        <Card
          className={`cursor-pointer ${
            type === "Medical Emergency" ? "ring-2 ring-green-500" : ""
          }`}
          onClick={() => setType("Medical Emergency")}
        >
          <HeartPulse size={35} className="text-green-600" />

          <h3 className="font-bold mt-3">Medical</h3>

          <p className="text-gray-500">Health emergency</p>
        </Card>

        <Card
          className={`cursor-pointer ${
            type === "Fire" ? "ring-2 ring-orange-500" : ""
          }`}
          onClick={() => setType("Fire")}
        >
          <Flame size={35} className="text-orange-600" />

          <h3 className="font-bold mt-3">Fire</h3>

          <p className="text-gray-500">Fire accident</p>
        </Card>
      </div>

      <Card className="mt-8">
        <Button onClick={getLocation}>
          <MapPin size={20} />
          Get Current Location
        </Button>
        <EmergencyMap location={location} />
        {location && !showAmbulances && (
          <Button className="mt-5" onClick={() => setShowAmbulances(true)}>
            🔍 Find Nearby Ambulances
          </Button>
        )}
        {showAmbulances && (
          <AmbulanceSelection
            location={location}
            onSelect={(ambulance) => {
              setSelectedAmbulance(ambulance);
              setShowAmbulances(false);
            }}
          />
        )}

        {location && (
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-gray-500">Latitude</p>

              <h2 className="text-lg font-bold">{location.latitude}</h2>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-gray-500">Longitude</p>

              <h2 className="text-lg font-bold">{location.longitude}</h2>
            </div>
          </div>
        )}

        <select value={type} onChange={(e) => setType(e.target.value)}>
          ...
        </select>
        <p className="mt-3 text-gray-500">
          {location ? "📍 Location captured" : "Location not captured"}
        </p>
      </Card>

      <Card className="mt-8">
        <TextArea
          label="Emergency Description"
          placeholder="Describe what happened..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Card>

      {selectedAmbulance && (
        <Card className="mt-6">
          <h2 className="text-xl font-bold mb-4">✅ Selected Ambulance</h2>

          <div className="space-y-2">
            <p>
              <strong>Vehicle:</strong> {selectedAmbulance.vehicle_number}
            </p>

            <p>
              <strong>Driver:</strong> {selectedAmbulance.driver?.name}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {selectedAmbulance.driver?.phone ?? "Not Available"}
            </p>

            <p>
              <strong>Status:</strong> {selectedAmbulance.status}
            </p>
          </div>
        </Card>
      )}
      {selectedAmbulance && (
        <Button variant="danger" className="mt-5 w-full" onClick={sendSOS}>
          🚨 Send Emergency Request
        </Button>
      )}

      {message && (
        <Card className="mt-8">
          <h3 className="font-bold">{message}</h3>
        </Card>
      )}

      <PatientTracking />
    </DashboardLayout>
  );
}

export default PatientHome;
