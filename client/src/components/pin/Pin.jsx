import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "./pin.scss";
import { Link } from "react-router-dom";

function Pin({ item, onClick }) {
  return (
    <Marker
      position={[item.latitude, item.longitude]}
      icon={
        new Icon({
          iconUrl: "/pin.png", // Make sure you have this image in your public folder
          iconSize: [32, 32], // Adjust size as needed
        })
      }
      eventHandlers={{
        click: () => {
          if (onClick) onClick(item); // Only call if onClick handler provided
        },
      }}
    >
      <Popup>
        <div className="popupContainer">
          <img src={item.images[0]} alt={item.title} />
          <div className="textContainer">
            <Link to={`/${item.id}`}>{item.title}</Link>
            <span>{item.bedroom} bedroom</span>
            <b>Rs {item.price}</b>
            <button
              className="directionsButton"
              onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick(item);
              }}
            >
              Get Directions
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;

// import { Marker, Popup } from "react-leaflet";
// import "./pin.scss";
// import { Link } from "react-router-dom";

// function Pin({ item }) {
//   return (
//     <Marker position={[item.latitude, item.longitude]}>
//       <Popup>
//         <div className="popupContainer">
//           <img src={item.images[0]} alt="" />
//           <div className="textContainer">
//             <Link to={`/${item.id}`}>{item.title}</Link>
//             <span>{item.bedroom} bedroom</span>
//             <b>Rs {item.price}</b>
//           </div>
//         </div>
//       </Popup>
//     </Marker>
//   );
// }

// export default Pin;
