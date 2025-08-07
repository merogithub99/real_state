import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {

  const {currentUser} = useContext(AuthContext)

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Find your Dream house and appartment here🏚️</h1>
          <p>
           
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>1000+</h1>
              <h2>Got their space</h2>
            </div>
            <div className="box">
              <h1>100s</h1>
              <h2>Of Agent </h2>
            </div>
            <div className="box">
              <h1>Space  </h1>
              <h2>On every possible city</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default HomePage;
