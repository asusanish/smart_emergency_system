import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import polyline from "@mapbox/polyline";

export default function RoutePolyline({
  from,
  to,
  onRouteInfo,
}) {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    const fetchRoute = async () => {
      try {
        const url = 
          `https://router.project-osrm.org/route/v1/driving/` +
          `${from.longitude},${from.latitude};` +
          `${to.longitude},${to.latitude}` +
          `?overview=full&geometries=polyline`;

        const response = await fetch(url);

        const data = await response.json();

        const route = data.routes[0];

        if (!route) return;


        // Distance + ETA
        onRouteInfo?.({
          distance: route.distance,
          time: route.duration,
        });


        // Decode road path
        const points = polyline.decode(
          route.geometry
        );


        const latlngs = points.map((point) => [
          point[0],
          point[1],
        ]);


        const line = L.polyline(
          latlngs,
          {
            color: "#2563eb",
            weight: 6,
          }
        ).addTo(map);


        return () => {
          map.removeLayer(line);
        };


      } catch(error) {
        console.log(
          "Route error:",
          error
        );
      }
    };


    fetchRoute();

  }, [from, to, map]);


  return null;
}