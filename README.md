# Heavy Metal Pollution Indices (HMPI) Calculator

A modern, user-friendly React application for computing Heavy Metal Pollution Indices in groundwater using standard formulas with minimal manual intervention.

## 🌟 Features

- **Automated Calculations**: Streamlined computation of heavy metal pollution indices using standard methodologies
- **Geo-coordinate Integration**: Seamless integration of groundwater heavy metal concentration datasets with geographical coordinates
- **Quality Categorization**: Intelligent categorization of groundwater quality based on heavy metal presence
- **User-Friendly Interface**: Intuitive design for scientists, researchers, and policymakers
- **Error Reduction**: Minimizes manual effort and eliminates error-prone processes
- **Reliable Outputs**: Provides consistent and accurate results for better decision-making

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Python 3.7+ (for Flask backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hmpi_flask_app
   ```

2. **Install React dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the Flask backend** (Terminal 1)
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:3001`

2. **Start the React frontend** (Terminal 2)
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser**
   Navigate to `http://localhost:3000` to access the application

## 📁 Project Structure

```
hmpi_flask_app/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── HomePage.js
│   │   ├── Calculator.js
│   │   ├── About.js
│   │   ├── Navigation.js
│   │   └── Footer.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── app.py
├── hmpi_calculator.py
├── requirements.txt
├── package.json
└── README.md
```

## 🧮 Supported Heavy Metals

The application supports calculations for the following heavy metals:

| Metal | Standard Value | Toxicity Level |
|-------|----------------|----------------|
| Arsenic (As) | 0.01 mg/L | High |
| Lead (Pb) | 0.01 mg/L | High |
| Cadmium (Cd) | 0.003 mg/L | High |
| Chromium (Cr) | 0.05 mg/L | High |
| Mercury (Hg) | 0.006 mg/L | High |
| Nickel (Ni) | 0.07 mg/L | Medium |
| Copper (Cu) | 2.0 mg/L | Medium |
| Zinc (Zn) | 3.0 mg/L | Low |
| Iron (Fe) | 0.3 mg/L | Low |
| Manganese (Mn) | 0.4 mg/L | Low |

## 📊 Calculation Methodologies

### 1. Heavy Metal Pollution Index (HPI)
```
HPI = Σ(Wi × Qi) / ΣWi
```
Where:
- Wi = Unit weight for the ith parameter
- Qi = Sub-index of the ith parameter

### 2. Heavy Metal Evaluation Index (HEI)
```
HEI = Σ(Ci / Si)
```
Where:
- Ci = Observed concentration of the ith parameter
- Si = Standard value of the ith parameter

### 3. Metal Index (MI)
```
MI = Σ(Ci / Si)
```

### 4. Degree of Contamination (Cd)
```
Cd = Σ(Ci / Si) - 1
```

### 5. Nemerow Index
```
Nemerow = √[(Max Pi)² + (Avg Pi)²] / 2
```

## 🎯 Usage

1. **Navigate to the Calculator**
   - Click "Start Calculating" on the homepage
   - Or use the navigation menu to access the Calculator

2. **Enter Metal Concentrations**
   - Input the concentration values for the heavy metals you want to analyze
   - Values should be in mg/L
   - Leave fields empty for metals not present in your sample

3. **Calculate HMPI**
   - Click "Calculate HMPI" to process your data
   - The system will compute all relevant indices

4. **Review Results**
   - View the calculated indices and their interpretations
   - Check the safety classification (Safe/Unsafe)
   - Use the results for environmental decision-making

## 🔧 API Endpoints

### POST /api/hmpi/calculate
Calculate heavy metal pollution indices.

**Request Body:**
```json
{
  "heavyMetalConcentrations": {
    "arsenic": 0.05,
    "lead": 0.02,
    "cadmium": 0.001,
    "chromium": 0.1,
    "mercury": 0.003,
    "nickel": 0.15,
    "copper": 1.5,
    "zinc": 2.0,
    "iron": 0.2,
    "manganese": 0.3
  }
}
```

**Response:**
```json
{
  "HPI": 125.45,
  "HEI": 8.23,
  "MI": 8.23,
  "Cd": 7.23,
  "Nemerow": 5.67,
  "classification": "Unsafe"
}
```

## 🌍 Environmental Impact

This application plays a crucial role in:

- **Environmental Protection**: Enabling better monitoring of groundwater quality
- **Public Health**: Providing insights for health protection measures
- **Policy Making**: Supporting evidence-based environmental policies
- **Research**: Facilitating scientific research and analysis
- **Standardization**: Promoting consistent assessment methodologies

## 🛠️ Development

### Available Scripts

- `npm start` - Start the development server
- `npm build` - Build the app for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Technologies Used

- **Frontend**: React 18, React Router, Lucide React Icons
- **Backend**: Flask, Python
- **Styling**: CSS3 with modern features
- **HTTP Client**: Axios

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support, email info@hmpicalculator.com or create an issue in the repository.

## 🙏 Acknowledgments

- WHO and EPA guidelines for drinking water quality standards
- International research on heavy metal pollution assessment
- Environmental monitoring communities worldwide

---

**Built for environmental monitoring and public health protection.**


