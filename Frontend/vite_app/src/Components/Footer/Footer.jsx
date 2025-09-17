import React from 'react';
import { useNavigate} from 'react-router-dom';
import { Phone, MapPin, Clock } from 'lucide-react';
import { MdMailOutline } from "react-icons/md";
import './footer.css';


export default function Footer() {
  const navigate = useNavigate();

  const handelhostel=()=>{
    navigate("/hostel");
  };

  const handelcommunity=()=>{
    navigate("/hostel");
  };

  const handelmeal=()=>{
    navigate("/meals");
  };
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3 className="footer-title">Homy</h3>
            <p className="footer-text">
            Providing comfortable and affordable hostel stays with essential services at your fingertips. Experience a hassle-free living environment with quality meals, community support, and seamless transport solutions—all in one place.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Contact Us</h3>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <Phone className="footer-icon" />
                <span>+91 98765 43210</span>
              </div>
              <div className="footer-contact-item">
                <MdMailOutline  className="footer-icon" />
                <span>support@homy.com</span>
              </div>
              <div className="footer-contact-item">
                <MapPin className="footer-icon" />
                <span>123 Food Street, Mumbai</span>
              </div>
              <div className="footer-contact-item">
                <Clock className="footer-icon" />
                <span>10:00 AM - 9:00 PM</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a onClick={handelhostel}>Hostel</a></li>
              <li><a onClick={handelcommunity}>Community</a></li>
              <li><a onClick={handelmeal}>Meal</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Policies</h3>
            <ul className="footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Refund Policy</a></li>
              <li><a href="#">Cancellation Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Homy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
