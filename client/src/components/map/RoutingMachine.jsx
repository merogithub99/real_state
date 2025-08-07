import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

function RoutingMachine({ start, end, position }) {
  useEffect(() => {
    if (!start || !end) return;

    const map = L.DomUtil.get("map");
    if (map == null || map._leaflet_id == null) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      routeWhileDragging: true,
      showAlternatives: true,
      fitSelectedRoutes: true,
      show: true,
      collapsible: true,
      position: position || "topright",
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 4 }]
      },
      createMarker: function() { return null; } // Disable default markers
    }).addTo(map._leaflet_map);

    return () => {
      map._leaflet_map.removeControl(routingControl);
    };
  }, [start, end, position]);

  return null;
}

export default RoutingMachine;