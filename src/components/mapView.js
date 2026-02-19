import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Create custom colored icons using SVG
const createCustomIcon = (color) => {
  return new L.DivIcon({
    html: `
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 1C6.7 1 2 5.7 2 11.5c0 7.5 10.5 28 10.5 28s10.5-20.5 10.5-28C23 5.7 18.3 1 12.5 1z"/>
        <circle cx="12.5" cy="11.5" r="3.5" fill="#fff"/>
      </svg>
    `,
    className: "custom-marker",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

const greenIcon = createCustomIcon("#4CAF50"); // Green
const redIcon = createCustomIcon("#F44336");   // Red


const MapView = () => {
  const records = JSON.parse(localStorage.getItem("hmpiResults") || "[]");
  const defaultPosition = [20.5937, 78.9629]; // Center of India

  // Filter records with valid coordinates
  const validRecords = records.filter(rec => {
    const lat = parseFloat(rec.latitude);
    const lng = parseFloat(rec.longitude);
    return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  });

  if (validRecords.length === 0) {
    return (
      <div style={{ 
        height: "500px", 
        width: "100%", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        border: "1px solid #ddd"
      }}>
        <div style={{ textAlign: "center", color: "#666" }}>
          <h3>No location data available</h3>
          <p>Upload data with latitude and longitude coordinates to see the map.</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={defaultPosition}
      zoom={5}
      style={{ height: "500px", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />

      {validRecords.map((rec, idx) => {
        const lat = parseFloat(rec.latitude);
        const lng = parseFloat(rec.longitude);
        
        // Get HPI value from different possible field names
        const hpi = rec.HPI ?? rec.hpi ?? rec.outputs?.HPI ?? rec.result?.HPI ?? 0;
        const classification = hpi > 100 ? "Unsafe" : "Safe";
        
        // Choose icon based on classification
        let icon;
        if (classification === "Unsafe") {
          icon = redIcon;
        } else if (classification === "Safe" && hpi > 0) {
          icon = greenIcon;
        } else {
          icon = blueIcon; // For unknown/zero values
        }

        return (
          <Marker key={idx} position={[lat, lng]} icon={icon}>
            <Popup>
              <div style={{ minWidth: "200px" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>
                  Sample: {rec.sampleNo || rec.SampleNo || "N/A"}
                </h4>
                <div style={{ marginBottom: "5px" }}>
                  <strong>Location:</strong> {rec.location || rec.Location || "Unknown"}
                </div>
                <div style={{ marginBottom: "5px" }}>
                  <strong>State:</strong> {rec.state || rec.State || "Unknown"}
                </div>
                <div style={{ marginBottom: "5px" }}>
                  <strong>HPI:</strong> {typeof hpi === 'number' ? hpi.toFixed(2) : hpi}
                </div>
                <div style={{ marginBottom: "5px" }}>
                  <strong>HEI:</strong> {rec.HEI?.toFixed(2) || rec.hei?.toFixed(2) || "N/A"}
                </div>
                <div style={{ 
                  padding: "5px", 
                  backgroundColor: classification === "Unsafe" ? "#ffebee" : "#e8f5e8",
                  border: `1px solid ${classification === "Unsafe" ? "#f44336" : "#4caf50"}`,
                  borderRadius: "3px",
                  textAlign: "center",
                  fontWeight: "bold",
                  color: classification === "Unsafe" ? "#d32f2f" : "#2e7d32"
                }}>
                  {classification}
                </div>
                {rec.error && (
                  <div style={{ 
                    marginTop: "5px", 
                    padding: "5px", 
                    backgroundColor: "#fff3e0",
                    border: "1px solid #ff9800",
                    borderRadius: "3px",
                    color: "#e65100",
                    fontSize: "12px"
                  }}>
                    Error: {rec.error}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;