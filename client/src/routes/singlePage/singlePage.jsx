import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function SinglePage() {
  const post = useLoaderData();

  const [saved, setSaved] = useState(post.isSaved);
  const [distance, setDistance] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // --------------------------------------------------
  // SAVE / UNSAVE PROPERTY
  // --------------------------------------------------

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setSaved((prev) => !prev);

    try {
      await apiRequest.post("/users/save", {
        postId: post.id,
      });
    } catch (err) {
      console.log(err);

      // Roll back UI if request fails
      setSaved((prev) => !prev);
    }
  };

  // --------------------------------------------------
  // SEND MESSAGE / OPEN CHAT
  // --------------------------------------------------

  const handleMessage = async () => {
    // User must be logged in
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      // Get all chats belonging to current user
      const res = await apiRequest.get("/chats");

      // Check whether a chat with this property owner
      // already exists
      const existingChat = res.data.find((chat) =>
        chat.userIDs.includes(post.user.id)
      );

      let chatId;

      if (existingChat) {
        // Chat already exists
        chatId = existingChat.id;
      } else {
        // Create a new chat
        const newChat = await apiRequest.post("/chats", {
          receiverId: post.user.id,
        });

        chatId = newChat.data.id;
      }

      // Open Profile page and pass chat ID
      navigate(`/profile?chatId=${chatId}`);
    } catch (err) {
      console.error("Failed to start chat:", err);
    }
  };

  return (
    <div className="singlePage">

      {/* ==========================================
          PROPERTY DETAILS
      ========================================== */}

      <div className="details">
        <div className="wrapper">

          <Slider images={post.images} />

          <div className="info">

            <div className="top">

              <div className="post">

                <h1>{post.title}</h1>

                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>

                <div className="price">
                  Rs{post.price}
                </div>

              </div>

              <div className="user">

                <img
                  src={post.user.avatar}
                  alt=""
                />

                <span>
                  {post.user.username}
                </span>

              </div>

            </div>

            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  post.postDetail.desc
                ),
              }}
            ></div>

          </div>

        </div>
      </div>


      {/* ==========================================
          FEATURES
      ========================================== */}

      <div className="features">

        <div className="wrapper">

          {/* GENERAL */}

          <p className="title">
            General
          </p>

          <div className="listVertical">

            <div className="feature">

              <img src="/utility.png" alt="" />

              <div className="featureText">

                <span>
                  Utilities
                </span>

                {post.postDetail.utilities === "owner" ? (
                  <p>
                    Owner is responsible
                  </p>
                ) : (
                  <p>
                    Tenant is responsible
                  </p>
                )}

              </div>

            </div>


            <div className="feature">

              <img src="/pet.png" alt="" />

              <div className="featureText">

                <span>
                  Pet Policy
                </span>

                {post.postDetail.pet === "allowed" ? (
                  <p>
                    Pets Allowed
                  </p>
                ) : (
                  <p>
                    Pets not Allowed
                  </p>
                )}

              </div>

            </div>


            <div className="feature">

              <img src="/fee.png" alt="" />

              <div className="featureText">

                <span>
                  Income Policy
                </span>

                <p>
                  {post.postDetail.income}
                </p>

              </div>

            </div>

          </div>


          {/* ==========================================
              SIZES
          ========================================== */}

          <p className="title">
            Sizes
          </p>

          <div className="sizes">

            <div className="size">

              <img src="/size.png" alt="" />

              <span>
                {post.postDetail.size} sqft
              </span>

            </div>


            <div className="size">

              <img src="/bed.png" alt="" />

              <span>
                {post.bedroom} beds
              </span>

            </div>


            <div className="size">

              <img src="/bath.png" alt="" />

              <span>
                {post.bathroom} bathroom
              </span>

            </div>

          </div>


          {/* ==========================================
              NEARBY PLACES
          ========================================== */}

          <p className="title">
            Nearby Places
          </p>

          <div className="listHorizontal">

            <div className="feature">

              <img src="/school.png" alt="" />

              <div className="featureText">

                <span>
                  School
                </span>

                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail.school + "m"}{" "}
                  away
                </p>

              </div>

            </div>


            <div className="feature">

              <img src="/pet.png" alt="" />

              <div className="featureText">

                <span>
                  Bus Stop
                </span>

                <p>
                  {post.postDetail.bus}m away
                </p>

              </div>

            </div>


            <div className="feature">

              <img src="/fee.png" alt="" />

              <div className="featureText">

                <span>
                  Restaurant
                </span>

                <p>
                  {post.postDetail.restaurant}m away
                </p>

              </div>

            </div>

          </div>


          {/* ==========================================
              LOCATION
          ========================================== */}

          <div className="locationTitle">

            <p className="title">
              Location
            </p>

            {distance !== null && (
              <span className="propertyDistance">
                {distance.toFixed(2)} km away
              </span>
            )}

          </div>


          <div className="mapContainer">

            <Map
              items={[post]}
              mapMode="single"
              onDistanceChange={setDistance}
            />

          </div>


          {/* ==========================================
              BUTTONS
          ========================================== */}

          <div className="buttons">

            {/* SEND MESSAGE */}

            <button onClick={handleMessage}>

              <img
                src="/chat.png"
                alt=""
              />

              Send a Message

            </button>


            {/* SAVE PROPERTY */}

            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved
                  ? "#fece51"
                  : "white",
              }}
            >

              <img
                src="/save.png"
                alt=""
              />

              {saved
                ? "Place Saved"
                : "Save the Place"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default SinglePage;




// import "./singlePage.scss";
// import Slider from "../../components/slider/Slider";
// import Map from "../../components/map/Map";
// import { useNavigate, useLoaderData } from "react-router-dom";
// import DOMPurify from "dompurify";
// import { useContext, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import apiRequest from "../../lib/apiRequest";

// function SinglePage() {
//   const post = useLoaderData();

//   const [saved, setSaved] = useState(post.isSaved);

//   // Store distance from user's current location to this property
//   const [distance, setDistance] = useState(null);

//   const { currentUser } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSave = async () => {
//     if (!currentUser) {
//       navigate("/login");
//       return;
//     }

//     // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
//     setSaved((prev) => !prev);

//     try {
//       await apiRequest.post("/users/save", {
//         postId: post.id,
//       });
//     } catch (err) {
//       console.log(err);
//       setSaved((prev) => !prev);
//     }
//   };

//   const handleMessage = async () => {
//     if (!currentUser) {
//       navigate("/login");
//       return;
//     }

//     try {
//       // 1. Get all current chats
//       const res = await apiRequest.get("/chats");

//       // 2. Check if a chat with the owner already exists
//       const existingChat = res.data.find((chat) =>
//         chat.userIDs.includes(post.user.id),
//       );

//       let chatId;

//       if (existingChat) {
//         chatId = existingChat.id;
//       } else {
//         // 3. If not, create a new chat
//         const newChat = await apiRequest.post("/chats", {
//           receiverId: post.user.id,
//         });

//         chatId = newChat.data.id;
//       }

//       // 4. Redirect to profile with query param to auto-open the chat
//       navigate(`/profile?chatId=${chatId}`);
//     } catch (err) {
//       console.error("Failed to start chat", err);
//     }
//   };

//   return (
//     <div className="singlePage">
//       <div className="details">
//         <div className="wrapper">
//           <Slider images={post.images} />

//           <div className="info">
//             <div className="top">
//               <div className="post">
//                 <h1>{post.title}</h1>

//                 <div className="address">
//                   <img src="/pin.png" alt="" />
//                   <span>{post.address}</span>
//                 </div>

//                 <div className="price">Rs{post.price}</div>
//               </div>

//               <div className="user">
//                 <img src={post.user.avatar} alt="" />
//                 <span>{post.user.username}</span>
//               </div>
//             </div>

//             <div
//               className="bottom"
//               dangerouslySetInnerHTML={{
//                 __html: DOMPurify.sanitize(post.postDetail.desc),
//               }}
//             ></div>
//           </div>
//         </div>
//       </div>

//       <div className="features">
//         <div className="wrapper">
//           {/* General */}
//           <p className="title">General</p>

//           <div className="listVertical">
//             <div className="feature">
//               <img src="/utility.png" alt="" />

//               <div className="featureText">
//                 <span>Utilities</span>

//                 {post.postDetail.utilities === "owner" ? (
//                   <p>Owner is responsible</p>
//                 ) : (
//                   <p>Tenant is responsible</p>
//                 )}
//               </div>
//             </div>

//             <div className="feature">
//               <img src="/pet.png" alt="" />

//               <div className="featureText">
//                 <span>Pet Policy</span>

//                 {post.postDetail.pet === "allowed" ? (
//                   <p>Pets Allowed</p>
//                 ) : (
//                   <p>Pets not Allowed</p>
//                 )}
//               </div>
//             </div>

//             <div className="feature">
//               <img src="/fee.png" alt="" />

//               <div className="featureText">
//                 <span>Income Policy</span>
//                 <p>{post.postDetail.income}</p>
//               </div>
//             </div>
//           </div>

//           {/* Sizes */}
//           <p className="title">Sizes</p>

//           <div className="sizes">
//             <div className="size">
//               <img src="/size.png" alt="" />
//               <span>{post.postDetail.size} sqft</span>
//             </div>

//             <div className="size">
//               <img src="/bed.png" alt="" />
//               <span>{post.bedroom} beds</span>
//             </div>

//             <div className="size">
//               <img src="/bath.png" alt="" />
//               <span>{post.bathroom} bathroom</span>
//             </div>
//           </div>

//           {/* Nearby Places */}
//           <p className="title">Nearby Places</p>

//           <div className="listHorizontal">
//             <div className="feature">
//               <img src="/school.png" alt="" />

//               <div className="featureText">
//                 <span>School</span>

//                 <p>
//                   {post.postDetail.school > 999
//                     ? post.postDetail.school / 1000 + "km"
//                     : post.postDetail.school + "m"}{" "}
//                   away
//                 </p>
//               </div>
//             </div>

//             <div className="feature">
//               <img src="/pet.png" alt="" />

//               <div className="featureText">
//                 <span>Bus Stop</span>
//                 <p>{post.postDetail.bus}m away</p>
//               </div>
//             </div>

//             <div className="feature">
//               <img src="/fee.png" alt="" />

//               <div className="featureText">
//                 <span>Restaurant</span>
//                 <p>{post.postDetail.restaurant}m away</p>
//               </div>
//             </div>
//           </div>

//           {/* Location + Distance */}
//           <div className="locationTitle">
//             <p className="title">Location</p>

//             {distance !== null && (
//               <span className="propertyDistance">
//                 {distance.toFixed(2)} km away
//               </span>
//             )}
//           </div>

//           {/* Map */}
//           <div className="mapContainer">
//             {/* <Map
//               items={[post]}
//               onDistanceChange={setDistance}
//             /> */}
//             <Map
//               items={[post]}
//               mapMode="single"
//               onDistanceChange={setDistance}
//             />
//           </div>

//           {/* Buttons */}
//           <div className="buttons">
//             <button onClick={handleMessage}>
//               <img src="/chat.png" alt="" />
//               Send a Message
//             </button>

//             <button
//               onClick={handleSave}
//               style={{
//                 backgroundColor: saved ? "#fece51" : "white",
//               }}
//             >
//               <img src="/save.png" alt="" />
//               {saved ? "Place Saved" : "Save the Place"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SinglePage;
