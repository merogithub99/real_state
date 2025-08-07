import { useState, useEffect } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";

function NewPostPage() {
  const navigate = useNavigate();

  // Default form values
  const [formValues, setFormValues] = useState({
    title: "rent rent rent",
    price: 50000,
    address: "kathmandu",
    city: "kathmandu",
    bedroom: 2,
    bathroom: 1,
    latitude: "",
    longitude: "",
    type: "rent",
    property: "apartment",
    utilities: "owner",
    pet: "allowed",
    income: "",
    size: 200,
    school: 100,
    bus: 100,
    restaurant: 100,
  });

  const [value, setValue] = useState(""); // for ReactQuill
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  // Get user's geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormValues((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
      },
      (err) => {
        console.warn("Error fetching location:", err);
      }
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: formValues.title,
          price: parseInt(formValues.price),
          address: formValues.address,
          city: formValues.city,
          bedroom: parseInt(formValues.bedroom),
          bathroom: parseInt(formValues.bathroom),
          type: formValues.type,
          property: formValues.property,
          latitude: formValues.latitude,
          longitude: formValues.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          utilities: formValues.utilities,
          pet: formValues.pet,
          income: formValues.income,
          size: parseInt(formValues.size),
          school: parseInt(formValues.school),
          bus: parseInt(formValues.bus),
          restaurant: parseInt(formValues.restaurant),
        },
      });
      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError("Failed to submit post.");
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            {[
              ["Title", "title", "text"],
              ["Price", "price", "number"],
              ["Address", "address", "text"],
              ["City", "city", "text"],
              ["Bedroom Number", "bedroom", "number"],
              ["Bathroom Number", "bathroom", "number"],
              ["Latitude", "latitude", "text"],
              ["Longitude", "longitude", "text"],
              ["Income Policy", "income", "text"],
              ["Total Size (sqft)", "size", "number"],
              ["School", "school", "number"],
              ["bus", "bus", "number"],
              ["Restaurant", "restaurant", "number"],
            ].map(([label, name, type]) => (
              <div className="item" key={name}>
                <label htmlFor={name}>{label}</label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={formValues[name]}
                  onChange={handleChange}
                  min={type === "number" ? 0 : undefined}
                />
              </div>
            ))}

            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>

            <div className="item">
              <label htmlFor="type">Type</label>
              <select
                name="type"
                value={formValues.type}
                onChange={handleChange}
              >
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="property">Property</label>
              <select
                name="property"
                value={formValues.property}
                onChange={handleChange}
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="room">Room</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select
                name="utilities"
                value={formValues.utilities}
                onChange={handleChange}
              >
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet" value={formValues.pet} onChange={handleChange}>
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>

            <button className="sendButton">Add</button>
            {error && <span>{error}</span>}
          </form>
        </div>
      </div>

      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "lamadev",
            uploadPreset: "estate",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;
