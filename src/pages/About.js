import React from 'react';
import { 
  Target, 
  Users, 
  Shield, 
  BarChart3, 
  Globe, 
  Zap,
  CheckCircle,
  BookOpen,
  Award
} from 'lucide-react';

const About = () => {
  const methodologies = [
    {
      name: "Heavy Metal Pollution Index (HPI)",
      description: "A comprehensive index that considers the concentration of heavy metals relative to their standard values and assigns weights based on their toxicity.",
      formula: "HPI = Σ(Wi × Qi) / ΣWi"
    },
    {
      name: "Heavy Metal Evaluation Index (HEI)",
      description: "Simple additive index that provides a direct measure of heavy metal contamination by summing the ratios of observed to standard values.",
      formula: "HEI = Σ(Ci / Si)"
    },
    {
      name: "Metal Index (MI)",
      description: "Often equivalent to HEI, providing a straightforward assessment of metal contamination levels in groundwater.",
      formula: "MI = Σ(Ci / Si)"
    },
    {
      name: "Degree of Contamination (Cd)",
      description: "Measures the extent of contamination by calculating the sum of contamination factors minus one for each metal.",
      formula: "Cd = Σ(Ci / Si) - 1"
    },
    {
      name: "Nemerow Index",
      description: "Considers both the maximum and average pollution factors, providing a balanced assessment of contamination.",
      formula: "Nemerow = √[(Max Pi)² + (Avg Pi)²] / 2"
    }
  ];

  const standards = [
    { metal: "Arsenic (As)", who: "0.01", epa: "0.01" },
    { metal: "Lead (Pb)", who: "0.01", epa: "0.015" },
    { metal: "Cadmium (Cd)", who: "0.003", epa: "0.005" },
    { metal: "Chromium (Total Cr)", who: "0.05", epa: "0.10" },
    { metal: "Mercury (Hg)", who: "0.006", epa: "0.002" },
    { metal: "Nickel (Ni)", who: "0.07", epa: "—" },
    { metal: "Copper (Cu)", who: "2.0", epa: "1.3 (Action Level)" },
    { metal: "Zinc (Zn)", who: "3.0", epa: "5.0 (Secondary)" },
    { metal: "Iron (Fe)", who: "0.3 (Aesthetic)", epa: "0.3 (Secondary)" },
    { metal: "Manganese (Mn)", who: "0.4", epa: "0.05 (Secondary)" }
  ];

  return (
    <div className="about-page">
      <div className="container">
        {/* Hero Section */}
        <section className="about-hero">
          <h1>About HMPI Calculator</h1>
          <p>
            A comprehensive tool for assessing groundwater quality through automated calculation 
            of Heavy Metal Pollution Indices using internationally recognized methodologies.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                To provide scientists, researchers, and policymakers with an automated, 
                user-friendly application that streamlines the computation of Heavy Metal 
                Pollution Indices in groundwater, reducing errors and enabling better 
                environmental decision-making.
              </p>
              <div className="mission-points">
                <div className="mission-point">
                  <Target className="w-6 h-6" />
                  <span>Automated computation using standard methodologies</span>
                </div>
                <div className="mission-point">
                  <Users className="w-6 h-6" />
                  <span>User-friendly interface for all users</span>
                </div>
                <div className="mission-point">
                  <Shield className="w-6 h-6" />
                  <span>Enhanced environmental monitoring capabilities</span>
                </div>
              </div>
            </div>
            <div className="mission-image">
              <div className="image-placeholder">
                <Globe className="w-32 h-32 text-blue-500" />
                <p>Environmental Protection</p>
              </div>
            </div>
          </div>
        </section>

        {/* Methodologies Section */}
        <section className="methodologies-section">
          <h2>Calculation Methodologies</h2>
          <p className="section-subtitle">
            Our application implements internationally recognized formulas for heavy metal pollution assessment
          </p>
          <div className="methodologies-grid">
            {methodologies.map((method, index) => (
              <div key={index} className="methodology-card">
                <div className="methodology-header">
                  <BarChart3 className="w-8 h-8" />
                  <h3>{method.name}</h3>
                </div>
                <p className="methodology-description">{method.description}</p>
                <div className="methodology-formula">
                  <strong>Formula:</strong> {method.formula}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Standards Section */}
        <section className="standards-section">
          <h2>Heavy Metal Standards</h2>
          <p className="section-subtitle">
            Based on WHO and EPA drinking water guidelines (values in mg/L). These indicate approximate maximum concentrations considered acceptable for groundwater used for consumption.
          </p>
          <div className="standards-table-container">
            <table className="standards-table">
              <thead>
                <tr>
                  <th>Heavy Metal</th>
                  <th>WHO (mg/L)</th>
                  <th>EPA (mg/L)</th>
                </tr>
              </thead>
              <tbody>
                {standards.map((standard, index) => (
                  <tr key={index}>
                    <td>{standard.metal}</td>
                    <td>{standard.who}</td>
                    <td>{standard.epa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Index Standards/Interpretation Section */}
        <section className="standards-section">
          <h2>Composite Index Guidance</h2>
          <p className="section-subtitle">
            WHO and EPA do not publish formal standards for composite indices (HPI, HEI, MI, Cd, Nemerow). 
            Below are commonly cited interpretation bands from literature; use them as guidance alongside metal-wise limits.
          </p>
          <div className="standards-table-container">
            <table className="standards-table">
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Typical Literature Thresholds</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>HPI (Heavy Metal Pollution Index)</td>
                  <td>≤ 100: Acceptable; &gt; 100: Critical/Unsuitable</td>
                </tr>
                <tr>
                  <td>HEI (Heavy Metal Evaluation Index)</td>
                  <td>&lt; 10: Low; 10–20: Medium; &gt; 20: High contamination</td>
                </tr>
                <tr>
                  <td>MI (Metal Index)</td>
                  <td>&lt; 1: Low; 1–2: Medium; &gt; 2: High contamination</td>
                </tr>
                <tr>
                  <td>Cd (Degree of Contamination)</td>
                  <td>&lt; 1: Low; 1–3: Moderate; &gt; 3: High contamination</td>
                </tr>
                <tr>
                  <td>Nemerow Index</td>
                  <td>≤ 0.7: Clean; 0.7–1: Warning; 1–2: Slight; 2–3: Moderate; &gt; 3: Heavy</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <Zap className="w-8 h-8" />
              <h3>Automated Calculations</h3>
              <p>Streamlined computation with minimal manual intervention</p>
            </div>
            <div className="feature-item">
              <Globe className="w-8 h-8" />
              <h3>Geo-coordinate Integration</h3>
              <p>Seamless integration with geographical data</p>
            </div>
            <div className="feature-item">
              <BarChart3 className="w-8 h-8" />
              <h3>Quality Categorization</h3>
              <p>Intelligent classification based on contamination levels</p>
            </div>
            <div className="feature-item">
              <Users className="w-8 h-8" />
              <h3>User-Friendly Interface</h3>
              <p>Intuitive design for all user types</p>
            </div>
            <div className="feature-item">
              <Shield className="w-8 h-8" />
              <h3>Error Reduction</h3>
              <p>Minimizes manual errors through automation</p>
            </div>
            <div className="feature-item">
              <Award className="w-8 h-8" />
              <h3>Reliable Outputs</h3>
              <p>Consistent and accurate results for decision-making</p>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="impact-section">
          <h2>Environmental Impact</h2>
          <div className="impact-content">
            <div className="impact-text">
              <p>
                The HMPI Calculator plays a crucial role in environmental protection and public health 
                by providing reliable insights into groundwater contamination. Our tool enables:
              </p>
              <ul className="impact-list">
                <li><CheckCircle className="w-5 h-5" />Better decision-making for environmental policies</li>
                <li><CheckCircle className="w-5 h-5" />Enhanced monitoring of groundwater quality</li>
                <li><CheckCircle className="w-5 h-5" />Improved public health protection measures</li>
                <li><CheckCircle className="w-5 h-5" />Standardized assessment methodologies</li>
                <li><CheckCircle className="w-5 h-5" />Accessible insights for all stakeholders</li>
              </ul>
            </div>
            <div className="impact-image">
              <div className="image-placeholder">
                <BookOpen className="w-32 h-32 text-green-500" />
                <p>Research & Development</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;

