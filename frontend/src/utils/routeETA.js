export async function getRouteETA(ambulance, patient) {
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${ambulance.longitude},${ambulance.latitude};` +
      `${patient.longitude},${patient.latitude}` +
      `?overview=false`;

    const response = await fetch(url);

    const data = await response.json();
    console.log("OSRM Response:", data);

    if (data.routes.length > 0) {
      const route = data.routes[0];

      return {
        distance: (route.distance / 1000).toFixed(2),

        duration: Math.ceil(route.duration / 60),
      };
    }
  } catch (error) {
    console.log("ETA Error:", error);
  }

  return null;
}
