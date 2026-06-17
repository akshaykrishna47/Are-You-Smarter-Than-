import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import './Home.css'

function Home() {
  return (
    <div className="home-neon">
      <div className="home-stage">
        <img src={logo} alt="Game logo" className="home-logo" />
        <Link to="/Menu">
          <button type="button" className="home-btn">▶</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;