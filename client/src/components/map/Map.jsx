import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import Pin from "../pin/Pin";
import RoutingMachine from "./RoutingMachine"; // We'll create this

function Map({ items, selectedItem, onItemSelect }) {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (err) => {
        console.warn("Could not get user location, using default:", err);
        setUserLocation([28.3949, 84.124]); // Default to Nepal
      }
    );
  }, []);

  if (!userLocation) return <div>Loading map...</div>;

  return (
    <MapContainer
      center={userLocation}
      zoom={14}
      scrollWheelZoom={true}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((item) => (
        <Pin item={item} key={item.id} onClick={onItemSelect} />
      ))}
      {selectedItem && userLocation && (
        <RoutingMachine
          position="topright"
          start={userLocation}
          end={[selectedItem.latitude, selectedItem.longitude]}
        />
      )}
    </MapContainer>
  );
}

export default Map;

// import { useEffect, useState } from "react";
// import { MapContainer, TileLayer } from "react-leaflet";
// import "./map.scss";
// import "leaflet/dist/leaflet.css";
// import Pin from "../pin/Pin";

// function Map({ items }) {
//   const [userLocation, setUserLocation] = useState(null);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setUserLocation([position.coords.latitude, position.coords.longitude]);
//       },
//       (err) => {
//         console.warn("Could not get user location, using default:", err);
//         setUserLocation([28.3949, 84.124]); // Default to Nepal
//       }
//     );
//   }, []);

//   if (!userLocation) return <div>Loading map...</div>;

//   return (
//     <MapContainer
//       center={userLocation}
//       zoom={11} // Zoom suitable for city-level view
//       scrollWheelZoom={true}
//       className="map"
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       {items.map((item) => (
//         <Pin item={item} key={item.id} />
//       ))}
//     </MapContainer>
//   );
// }

// export default Map;
