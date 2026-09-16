import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import Pin from "../pin/Pin";
import RoutingMachine from "./RoutingMachine";

// Haversine distance calculation
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function Map({
  items,
  selectedItem,
  onItemSelect,
  onDistanceChange,
  mapMode = "list",
}) {
  const [userLocation, setUserLocation] = useState(null);

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported");

      // Kathmandu fallback
      setUserLocation([27.7172, 85.324]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log(
          "Current location:",
          latitude,
          longitude
        );

        setUserLocation([latitude, longitude]);
      },
      (error) => {
        console.error("Geolocation error:", error);

        // Kathmandu fallback
        setUserLocation([27.7172, 85.324]);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Calculate distance from user to each property
  useEffect(() => {
    if (userLocation && items.length > 0) {
      items.forEach((item) => {
        const latitude = Number(item.latitude);
        const longitude = Number(item.longitude);

        const distance = getDistanceFromLatLonInKm(
          userLocation[0],
          userLocation[1],
          latitude,
          longitude
        );

        console.log(
          `Distance to ${item.title}: ${distance.toFixed(2)} km`
        );

        if (onDistanceChange) {
          onDistanceChange(distance);
        }
      });
    }
  }, [userLocation, items, onDistanceChange]);

  // Wait until location is available
  if (!userLocation) {
    return <div>Getting your location...</div>;
  }

  return (
    <MapContainer
      center={
        mapMode === "single" && items.length > 0
          ? [
              Number(items[0].latitude),
              Number(items[0].longitude),
            ]
          : userLocation
      }
      zoom={mapMode === "single" ? 15 : 13}
      scrollWheelZoom={true}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Property markers */}
      {items.map((item) => (
        <Pin
          item={item}
          key={item.id}
          onClick={onItemSelect}
        />
      ))}

      {/* Route from user to selected property */}
      {selectedItem && (
        <RoutingMachine
          position="topright"
          start={userLocation}
          end={[
            Number(selectedItem.latitude),
            Number(selectedItem.longitude),
          ]}
        />
      )}
    </MapContainer>
  );
}

export default Map;

// recently commented

// import { useEffect, useState } from "react";
// import { MapContainer, TileLayer } from "react-leaflet";
// import "./map.scss";
// import "leaflet/dist/leaflet.css";
// import Pin from "../pin/Pin";
// import RoutingMachine from "./RoutingMachine"; // We'll create this

// // --- Helper Functions ---
// function deg2rad(deg) {
//   return deg * (Math.PI / 180);
// }

// //algorithm
// function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
//   const R = 6371; // Radius of earth in km
//   const dLat = deg2rad(lat2 - lat1);
//   const dLon = deg2rad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(deg2rad(lat1)) *
//       Math.cos(deg2rad(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }
// //algo

// function Map({ items, selectedItem, onItemSelect }) {
//   const [userLocation, setUserLocation] = useState(null);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setUserLocation([position.coords.latitude, position.coords.longitude]);
//       },
//       (err) => {
//         console.warn("Could not get user location, using default:", err);
//         setUserLocation([28.3949, 84.124]); // Default to Nepal
//       },
//     );
//   }, []);

//   // Calculate distances once location is available
//   useEffect(() => {
//     if (userLocation) {
//       items.forEach((item) => {
//         const distance = getDistanceFromLatLonInKm(
//           userLocation[0],
//           userLocation[1],
//           item.latitude,
//           item.longitude,
//         );
//         console.log(`Distance to ${item.title}: ${distance.toFixed(2)} km`);
//       });
//     }
//   }, [userLocation, items]);
//   //algo

//   if (!userLocation) return <div>Loading map...</div>;

//   return (
//     <MapContainer
//       center={userLocation}
//       zoom={14}
//       scrollWheelZoom={true}
//       className="map"
//     >
//       <TileLayer
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       {items.map((item) => (
//         <Pin item={item} key={item.id} onClick={onItemSelect} />
//       ))}
//       {selectedItem && userLocation && (
//         <RoutingMachine
//           position="topright"
//           start={userLocation}
//           end={[selectedItem.latitude, selectedItem.longitude]}
//         />
//       )}
//     </MapContainer>
//   );
// }

// export default Map;

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
