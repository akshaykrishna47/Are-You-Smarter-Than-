import { Link } from "react-router-dom";
import logo from "../images/logo.webp";
import './Home.css'

function Home() {
  return (
    <div className="home-neon">
      <div className="home-stage">
        <img src={logo} alt="Game logo" className="home-logo" />
        <Link to="/Menu">
          <button type="button" className="home-btn">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path class="pp-morph-icon" d="M8 5 L8 19 L19 12 Z" fill="currentColor" />
            </svg>
        </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;