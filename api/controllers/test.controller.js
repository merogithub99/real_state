import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = async (req, res) => {
  console.log(req.userId);
  res.status(200).json({ message: "You are Authenticated" });
};

export const shouldBeAdmin = async (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not Authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not Valid!" });
    if (!payload.isAdmin) {
      return res.status(403).json({ message: "Not authorized!" });
    }
  });

  res.status(200).json({ message: "You are Authenticated" });
};

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


 // Calculate distances once location is available
//  useEffect(() => {
//   if (userLocation) {
//     items.forEach((item) => {
//       const distance = getDistanceFromLatLonInKm(
//         userLocation[0],
//         userLocation[1],
//         item.latitude,
//         item.longitude
//       );
//       console.log(`Distance to ${item.title}: ${distance.toFixed(2)} km`);
//     });
//   }
// }, [userLocation, items]);

// if (!userLocation) return <div>Loading map...</div>;

// function deg2rad(deg) {
//   return deg * (Math.PI / 180);
// }

// const mockProperties = [
//   { id: 1, name: "Room A", latitude: 27.7052, longitude: 85.3294 },
//   { id: 2, name: "Room B", latitude: 27.7100, longitude: 85.3300 },
//   { id: 3, name: "Room C", latitude: 27.7250, longitude: 85.3400 },
// ];

// app.get('/api/properties/nearby', async (req, res) => {
//   const { userLat, userLon, radius } = req.query;

//   if (!userLat || !userLon || !radius) {
//     return res.status(400).json({ error: 'Missing query parameters' });
//   }

//   const userLatNum = parseFloat(userLat);
//   const userLonNum = parseFloat(userLon);
//   const radiusNum = parseFloat(radius);

//   const nearby = mockProperties.filter((p) => {
//     const dist = getDistanceFromLatLonInKm(userLatNum, userLonNum, p.latitude, p.longitude);
//     return dist <= radiusNum;
//   });

//   console.log('User Location:', userLatNum, userLonNum);
//   console.log('Nearby Properties:', nearby);

//   res.json(nearby);
// });
