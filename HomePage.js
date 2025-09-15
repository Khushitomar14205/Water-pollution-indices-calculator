import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  Shield, 
  BarChart3, 
  Globe, 
  Users, 
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: <Calculator className="w-8 h-8" />,
      title: "Automated Calculations",
      description: "Streamlined computation of heavy metal pollution indices using standard methodologies with minimal manual intervention."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Geo-coordinate Integration",
      description: "Seamless integration of groundwater heavy metal concentration datasets with precise geographical coordinates."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Quality Categorization",
      description: "Intelligent categorization of groundwater quality based on heavy metal presence and contamination levels."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "User-Friendly Interface",
      description: "Intuitive design for scientists, researchers, and policymakers with easy-to-use navigation and clear results."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Error Reduction",
      description: "Minimizes manual effort and eliminates error-prone processes through automated validation and calculations."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Reliable Outputs",
      description: "Provides consistent and accurate results for better decision-making and environmental monitoring."
    }
  ];

  const stats = [
    { number: "99.9%", label: "Accuracy Rate" },
    { number: "50+", label: "Heavy Metals Supported" },
    { number: "1000+", label: "Calculations Performed" },
    { number: "24/7", label: "Availability" }
  ];

  const benefits = [
    "Enhanced environmental monitoring capabilities",
    "Improved public health protection measures",
    "Streamlined decision-making processes",
    "Reduced calculation time and errors",
    "Standardized assessment methodologies",
    "Accessible insights for all users"
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>SafeSip: Heavy Metal Pollution Indices Calculator</h1>
          <p>
            Automated, user-friendly application for computing Heavy Metal Pollution Indices (HMPI) 
            in groundwater using standard formulas with minimal manual intervention.
          </p>
          <div className="hero-buttons">
            <Link to="/calculator" className="cta-button">
              Start Calculating
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/about" className="cta-button secondary">
              Learn More
            </Link>
            <Link to="/gis" className="cta-button secondary">Water Quality Map</Link>
            <Link to="/outputs" className="cta-button secondary">Past Data Insights</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Key Features</h2>
          <p className="features-subtitle">
            Comprehensive tools for groundwater quality assessment and heavy metal contamination analysis
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact">
        <div className="container">
          <div className="impact-content">
            <div className="impact-text">
              <h2>Making a Real Impact</h2>
              <p>
                Our application provides accessible and reliable insights into groundwater heavy metal contamination, 
                enabling better decision-making, enhanced environmental monitoring, and improved public health protection.
              </p>
              <div className="benefits-list">
                {benefits.map((benefit, index) => (
                  <div key={index} className="benefit-item">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="impact-image">
              <div className="image-placeholder">
                <Globe className="w-32 h-32 text-blue-500" />
                <p>Groundwater Quality Assessment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <h2>Trusted by Professionals</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>
              Join researchers, scientists, and policymakers in making informed decisions 
              about groundwater quality and environmental protection.
            </p>
            <Link to="/calculator" className="cta-button large">
              Access the Calculator
              <ArrowRight className="w-6 h-6 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

