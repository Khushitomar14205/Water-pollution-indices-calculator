import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>HMPI Calculator</h3>
            <p>
              Automated, user-friendly application for computing Heavy Metal Pollution Indices 
              in groundwater using standard formulas with minimal manual intervention.
            </p>
            <div className="footer-links">
              <Link to="/calculator" className="footer-link">
                <Calculator className="w-4 h-4" />
                Start Calculating
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/calculator">Calculator</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/gis">Water Quality Map</Link></li>
              <li><Link to="/outputs">Past Data Insights</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Features</h3>
            <ul className="footer-links-list">
              <li>Automated Calculations</li>
              <li>Geo-coordinate Integration</li>
              <li>Quality Categorization</li>
              <li>Error Reduction</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact</h3>
            <div className="contact-info">
              <div className="contact-item">
                <Mail className="w-4 h-4" />
                <span>info@hmpicalculator.com</span>
              </div>
              <div className="contact-item">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <MapPin className="w-4 h-4" />
                <span>Environmental Research Center</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 HMPI Calculator. All rights reserved.</p>
          <p>Built for environmental monitoring and public health protection.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

