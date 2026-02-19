import React, { useState } from "react";
import Papa from "papaparse";
import {
  FaFlask,
  FaTint,
  FaVial,
  FaLeaf,
  FaExclamationTriangle,
  FaRadiation,
  FaMapMarkerAlt,
  FaFlag,
} from "react-icons/fa";
import "../App.css";

const inputFields = [
  { name: "sampleNo", label: "Sample No.", icon: <FaFlask color="#1976d2" /> },
  { name: "state", label: "State", icon: <FaFlag color="#388e3c" /> },
  { name: "location", label: "Location", icon: <FaMapMarkerAlt color="#81c784" /> },
  { name: "latitude", label: "Latitude", icon: <FaLeaf color="#43a047" /> },
  { name: "longitude", label: "Longitude", icon: <FaLeaf color="#43a047" /> },
  { name: "arsenic", label: "Arsenic (mg/L)", icon: <FaRadiation color="#e53935" /> },
  { name: "lead", label: "Lead (mg/L)", icon: <FaExclamationTriangle color="#fbc02d" /> },
  { name: "cadmium", label: "Cadmium (mg/L)", icon: <FaVial color="#2196f3" /> },
  { name: "chromium", label: "Chromium (mg/L)", icon: <FaVial color="#43a047" /> },
  { name: "mercury", label: "Mercury (mg/L)", icon: <FaVial color="#e53935" /> },
  { name: "nickel", label: "Nickel (mg/L)", icon: <FaVial color="#1976d2" /> },
  { name: "iron", label: "Iron (mg/L)", icon: <FaFlask color="#4caf50" /> },
  { name: "copper", label: "Copper (mg/L)", icon: <FaTint color="#2196f3" /> },
  { name: "zinc", label: "Zinc (mg/L)", icon: <FaTint color="#43a047" /> },
  { name: "manganese", label: "Manganese (mg/L)", icon: <FaVial color="#fbc02d" /> },
];

const ranges = {
  latitude: { min: -90, max: 90 },
  longitude: { min: -180, max: 180 },
  arsenic: { min: 0, max: 10 },
  lead: { min: 0, max: 10 },
  cadmium: { min: 0, max: 10 },
  chromium: { min: 0, max: 10 },
  mercury: { min: 0, max: 10 },
  nickel: { min: 0, max: 10 },
  iron: { min: 0, max: 10 },
  copper: { min: 0, max: 10 },
  zinc: { min: 0, max: 10 },
  manganese: { min: 0, max: 10 },
};

function Calculator() {
  const [inputs, setInputs] = useState(
    inputFields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [inputMode, setInputMode] = useState("manual");
  const [fileName, setFileName] = useState("");
  const [parsedData, setParsedData] = useState([]);
  const [error, setError] = useState("");

  // Manual input handlers
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      for (let i = index + 1; i < form.length; i++) {
        if (form[i].tagName === "INPUT") {
          form[i].focus();
          break;
        }
      }
    }
  };

  // CSV upload handler
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      Papa.parse(e.target.files[0], {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase(),
        complete: (results) => {
          const sanitizedData = results.data.map((row) => {
            const cleaned = {};
            Object.entries(row).forEach(([key, value]) => {
              const k = key.trim().toLowerCase();
              if (!value || value === "") {
                cleaned[k] = null;
              } else if (
                [
                  "latitude",
                  "longitude",
                  "arsenic",
                  "lead",
                  "cadmium",
                  "chromium",
                  "mercury",
                  "nickel",
                  "iron",
                  "copper",
                  "zinc",
                  "manganese",
                ].includes(k)
              ) {
                cleaned[k] = parseFloat(value.toString().replace(",", "."));
              } else {
                cleaned[k] = value;
              }
            });
            return cleaned;
          });
          setParsedData(sanitizedData);
        },
        error: (err) => {
          console.error("CSV parse error:", err);
          setError("Failed to parse CSV file.");
        },
      });
    }
  };

  const sanitizeInputs = (data) => {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      if (["sampleNo", "state", "location"].includes(key)) {
        sanitized[key] = value || "";
        continue;
      }
      const num = parseFloat(value);
      sanitized[key] = isNaN(num) ? null : num;
      if (ranges[key] && sanitized[key] !== null) {
        if (sanitized[key] < ranges[key].min || sanitized[key] > ranges[key].max) {
          throw new Error(
            `${key.charAt(0).toUpperCase() + key.slice(1)} must be between ${
              ranges[key].min
            } and ${ranges[key].max}.`
          );
        }
      }
    }
    return sanitized;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (inputMode === "manual") {
        let sanitizedInputs;
        try {
          sanitizedInputs = sanitizeInputs(inputs);
        } catch (validationErr) {
          setError(validationErr.message);
          return;
        }

        const metals = Object.fromEntries(
          Object.entries(sanitizedInputs).filter(
            ([k]) => k in ranges
          )
        );

        const response = await fetch("http://127.0.0.1:8000/api/hmpi/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ heavyMetalConcentrations: metals }),
        });

        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          setError(result.error || "Failed to calculate indices for manual entry.");
          return;
        }

        const result = await response.json();

        localStorage.setItem(
          "hmpiResults",
          JSON.stringify([
            { ...sanitizedInputs, ...result },
          ])
        );

        setError("");
        window.location.href = "/result";
      } else if (inputMode === "file") {
        if (!fileName) {
          setError("Please select a CSV file to upload.");
          return;
        }
        if (!parsedData || parsedData.length === 0) {
          setError("No data found in the uploaded file.");
          return;
        }

        const records = parsedData.map((row) => ({
          sampleNo: row.sampleno || row.sampleNo || "",
          state: row.state || "",
          location: row.location || "",
          latitude: row.latitude ?? null,
          longitude: row.longitude ?? null,
          arsenic: row.arsenic ?? null,
          lead: row.lead ?? null,
          cadmium: row.cadmium ?? null,
          chromium: row.chromium ?? null,
          mercury: row.mercury ?? null,
          nickel: row.nickel ?? null,
          iron: row.iron ?? null,
          copper: row.copper ?? null,
          zinc: row.zinc ?? null,
          manganese: row.manganese ?? null,
        }));

        const response = await fetch(
          "http://127.0.0.1:8000/api/hmpi/calculate-batch",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ records }),
          }
        );

        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          setError(result.error || "Failed to calculate indices for uploaded CSV.");
          return;
        }

        const data = await response.json();

        if (!data.results || !Array.isArray(data.results)) {
          setError("Unexpected response from server.");
          return;
        }

        localStorage.setItem("hmpiResults", JSON.stringify(data.results));
        setError("");
        window.location.href = "/result";
      }
    } catch (err) {
      setError(err.message || "Unexpected error occurred.");
    }
  };

  return (
    <div className="dashboard-bg">
      <div className="dashboard-layout">
        <div className="dashboard-card calculator-card" style={{ maxWidth: "900px" }}>
          <h2 className="dashboard-title">Groundwater Quality Calculator</h2>

          <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="radio"
                name="inputMode"
                value="manual"
                checked={inputMode === "manual"}
                onChange={() => setInputMode("manual")}
              />
              Manual Entry
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="radio"
                name="inputMode"
                value="file"
                checked={inputMode === "file"}
                onChange={() => setInputMode("file")}
              />
              Upload CSV
            </label>
          </div>

          {inputMode === "manual" && (
            <form className="dashboard-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <div className="dashboard-inputs" style={{ display: "flex", flexWrap: "wrap", gap: "1.2rem 1.5rem" }}>
                {inputFields.map((field) => (
                  <div className="dashboard-input-group" key={field.name}>
                    <label className="dashboard-label">
                      {field.icon}
                      <span>{field.label}</span>
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={inputs[field.name]}
                      onChange={handleChange}
                      className="dashboard-input"
                    />
                  </div>
                ))}
              </div>
              {error && <div style={{ color: "#e53935", fontWeight: 500, marginBottom: 8 }}>{error}</div>}
              <button type="submit" className="dashboard-btn">
                Calculate Indices
              </button>
            </form>
          )}

          {inputMode === "file" && (
            <form style={{ marginTop: "2rem" }} onSubmit={handleSubmit}>
              <label style={{ fontWeight: 600, marginBottom: 8, display: "block" }}>
                Upload CSV File:
              </label>
              <input type="file" accept=".csv" onChange={handleFileChange} />
              {fileName && <div style={{ marginTop: 8, color: "#1976d2" }}>Selected: {fileName}</div>}
              {error && <div style={{ color: "#e53935", fontWeight: 500, marginBottom: 8 }}>{error}</div>}
              <button type="submit" className="dashboard-btn" style={{ marginTop: 12 }}>
                Calculate Indices for CSV
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calculator;
