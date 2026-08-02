import { useEffect, useState } from "react";
import api from "../api/axios";

export default function useDriverTracking() {
  const [driverLocation, setDriverLocation] = useState(null);
  const [emergencies, setEmergencies] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  const loadEmergencies = async () => {
    try {
      const response = await api.get("/driver/emergencies", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = response.data.emergencies || [];

      setEmergencies(data);

      if (data.length > 0) {
        if (!selectedEmergency) {
          setSelectedEmergency(data[0]);
          loadTimeline(data[0].id);
        }

        if (!driverLocation) {
          setDriverLocation({
            latitude: Number(data[0].ambulance.latitude),
            longitude: Number(data[0].ambulance.longitude),
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(
        `/driver/emergency/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

    //   loadEmergencies();
    setEmergencies(prev =>
        prev.map(item =>
            item.id === id
            ? {...item,status}
            : item
        )
    );


    if(selectedEmergency?.id === id)
    {
        setSelectedEmergency(prev=>({
            ...prev,
            status
        }));
    }
    } catch (err) {
      console.log(err);
    }
  };

  // Poll Emergencies
  useEffect(() => {
    loadEmergencies();

    const interval = setInterval(loadEmergencies, 3000);

    return () => clearInterval(interval);
  }, []);

  // Demo Mode
  useEffect(() => {
    if (!demoMode) return;
    if (!selectedEmergency) return;
    if (!driverLocation) return;

    const interval = setInterval(() => {
      setDriverLocation((prev) => {
        if (!prev) return prev;

        const targetLat = Number(selectedEmergency.latitude);
        const targetLng = Number(selectedEmergency.longitude);

        const dx = targetLat - prev.latitude;
        const dy = targetLng - prev.longitude;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 0.0002) {
          clearInterval(interval);
          setDemoMode(false);
          return prev;
        }

        const next = {
          latitude: prev.latitude + dx * 0.08,
          longitude: prev.longitude + dy * 0.08,
        };

        api.put(
          "/driver/location",
          next,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);

  }, [demoMode, selectedEmergency]);

  // Live GPS
  useEffect(() => {
    if (demoMode) return;

    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setDriverLocation({
          latitude,
          longitude,
        });

        await api.put(
          "/driver/location",
          {
            latitude,
            longitude,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);

  }, [demoMode]);

  return {
    emergencies,
    selectedEmergency,
    setSelectedEmergency,

    driverLocation,
    setDriverLocation,

    demoMode,
    setDemoMode,

    updateStatus,
  };
}