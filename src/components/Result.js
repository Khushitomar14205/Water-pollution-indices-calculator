import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import jsPDF from "jspdf";
import "jspdf-autotable";


// Fix Leaflet default icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Result = () => {
  const records = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('hmpiResults') || '[]');
    } catch {
      return [];
    }
  }, []);
  
const handleDownloadPdf = () => {
  if (!records.length || !window.jspdf) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('l', 'pt', 'a4');

  doc.setFontSize(16);
  doc.text('HMPI Calculation Results - SafeSip', 40, 40);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 60);

  const headers = [
    'Sample No.', 'State', 'Location', 'Latitude', 'Longitude',
    'HPI', 'HEI', 'MI', 'Cd', 'Nemerow', 'Classification'
  ];

  const rows = records.map((rec) => [
    rec.SampleNo ?? rec.sampleNo ?? '-',
    rec.State ?? rec.state ?? '-',
    rec.Location ?? rec.location ?? '-',
    rec.Latitude ?? rec.latitude ?? '-',
    rec.Longitude ?? rec.longitude ?? '-',
    rec.HPI ?? rec.outputs?.HPI ?? '-',
    rec.HEI ?? rec.outputs?.HEI ?? '-',
    rec.MI ?? rec.outputs?.MI ?? '-',
    rec.Cd ?? rec.outputs?.Cd ?? '-',
    rec.Nemerow ?? rec.outputs?.Nemerow ?? '-',
    rec.Classification ?? rec.classification ?? rec.outputs?.classification ?? '-'
  ]);

  // 🔥 AutoTable takes care of spacing, wrapping, and pages
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 90,
    styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
    headStyles: { fillColor: [22, 160, 133] }, // teal headers
    columnStyles: {
      2: { cellWidth: 120 }, // wider for Location
      10: { cellWidth: 100 } // wider for Classification
    }
  });

  doc.save('safesip_results.pdf');
};

  const handleDownloadCsv = () => {
    if (!records.length) return;
    const headers = [
      'Sample No.','State','Location','Latitude','Longitude','HPI','HEI','MI','Cd','Nemerow','Classification'
    ];

    const csvRows = [headers.join(',')];
    records.forEach(rec => {
      const row = [
        rec.SampleNo ?? rec.sampleNo ?? '-',
        rec.State ?? rec.state ?? '-',
        rec.Location ?? rec.location ?? '-',
        rec.Latitude ?? rec.latitude ?? '-',
        rec.Longitude ?? rec.longitude ?? '-',
        rec.HPI ?? rec.outputs?.HPI ?? '-',
        rec.HEI ?? rec.outputs?.HEI ?? '-',
        rec.MI ?? rec.outputs?.MI ?? '-',
        rec.Cd ?? rec.outputs?.Cd ?? '-',
        rec.Nemerow ?? rec.outputs?.Nemerow ?? '-',
        rec.Classification ?? rec.classification ?? rec.outputs?.classification ?? '-'
      ];
      csvRows.push(row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    });

    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'safesip_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getBadgeClass = (classification) => {
    const cls = (classification || '').toLowerCase();
    if (cls === 'caution') return 'badge-caution';
    if (cls === 'unsafe') return 'badge-unsafe';
    return 'badge-safe';
  };

  if (!records.length) {
    return (
      <div className="result-bg">
        <div className="result-card">
          <h2 className="result-title">Calculation Results</h2>
          <p>No results found. Please run a calculation or upload a file.</p>
          <Link to="/calculator" className="dashboard-btn" style={{marginTop: '1.2rem'}}>Go to Calculator</Link>
        </div>
      </div>
    );
  }

  // Default map center
  const defaultPosition = [20, 78];

  return (
    <div className="result-bg">
      <div className="result-card" style={{maxWidth: 1200, minWidth: 700, width: '100%'}}>
        <h2 className="result-title">Calculation Results</h2>

        {/* Map */}
        <MapContainer center={defaultPosition} zoom={5} style={{ height: '400px', width: '100%', marginBottom: '2rem' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {records.map((rec, idx) => {
            const lat = parseFloat(rec.latitude ?? rec.Latitude);
            const lng = parseFloat(rec.longitude ?? rec.Longitude);
            if (isNaN(lat) || isNaN(lng)) return null;

            return (
              <Marker key={idx} position={[lat, lng]}>
                <Popup>
                  <b>{rec.sampleNo ?? rec.SampleNo}</b><br/>
                  {rec.location ?? rec.Location}<br/>
                  HPI: {rec.HPI?.toFixed(2) ?? rec.outputs?.HPI?.toFixed(2)} 
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Table */}
        <table style={{width: '100%', fontSize: '1.1rem', borderCollapse: 'collapse', margin: '1.5rem 0', background: 'rgba(255,255,255,0.95)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 16px rgba(33,150,243,0.10)'}}>
          <thead>
            <tr style={{background: '#e3f2fd'}}>
              <th style={{padding: '0.7rem'}}>Sample No</th>
              <th style={{padding: '0.7rem'}}>State</th>
              <th style={{padding: '0.7rem'}}>Location</th>
              <th style={{padding: '0.7rem'}}>Latitude</th>
              <th style={{padding: '0.7rem'}}>Longitude</th>
              <th style={{padding: '0.7rem'}}>HPI</th>
              <th style={{padding: '0.7rem'}}>HEI</th>
              <th style={{padding: '0.7rem'}}>MI</th>
              <th style={{padding: '0.7rem'}}>Cd</th>
              <th style={{padding: '0.7rem'}}>Nemerow</th>
              <th style={{padding: '0.7rem'}}>Classification</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, idx) => {
              const classification = rec.Classification ?? rec.classification ?? rec.outputs?.classification ?? '-';
              return (
                <tr key={idx}>
                  <td style={{textAlign: 'center'}}>{rec.sampleNo ?? rec.SampleNo ?? '—'}</td>
                  <td style={{textAlign: 'center'}}>{rec.state ?? rec.State ?? '—'}</td>
                  <td style={{textAlign: 'center'}}>{rec.location ?? rec.Location ?? '—'}</td>
                  <td style={{textAlign: 'center'}}>{rec.latitude ?? rec.Latitude ?? '—'}</td>
                  <td style={{textAlign: 'center'}}>{rec.longitude ?? rec.Longitude ?? '—'}</td>
                  <td style={{textAlign: 'center'}}>{rec.HPI != null ? Number(rec.HPI).toFixed(2) : rec.outputs?.HPI != null ? Number(rec.outputs.HPI).toFixed(2) : '—'}</td>
                  <td style={{textAlign: 'center'}}>{rec.HEI != null ? Number(rec.HEI).toFixed(2) : rec.outputs?.HEI != null ? Number(rec.outputs.HEI).toFixed(2) : '—'}</td>
                  <td style={{textAlign: 'center'}}>{rec.MI != null ? Number(rec.MI).toFixed(2) : rec.outputs?.MI != null ? Number(rec.outputs.MI).toFixed(2) : '—'}</td>
                  <td style={{textAlign: 'center'}}>{rec.Cd != null ? Number(rec.Cd).toFixed(2) : rec.outputs?.Cd != null ? Number(rec.outputs.Cd).toFixed(2) : '—'}</td>
                  <td style={{textAlign: 'center'}}>{rec.Nemerow != null ? Number(rec.Nemerow).toFixed(2) : rec.outputs?.Nemerow != null ? Number(rec.outputs.Nemerow).toFixed(2) : '—'}</td>
                  <td style={{textAlign: 'center'}}>
                    <span className={`result-badge ${getBadgeClass(classification)}`}>{classification}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center' }}>
          <div style={{display: 'flex', flexDirection: 'row', gap: '1.2rem', width: '100%', justifyContent: 'center'}}>
            <button onClick={handleDownloadPdf} className="export-btn"><FaFilePdf style={{marginRight:16}}/>PDF</button>
            <button onClick={handleDownloadCsv} className="export-btn"><FaFileExcel style={{marginRight:6}}/>Excel</button>
          </div>
          <Link to="/calculator" className="dashboard-btn" style={{width: '60%', textAlign: 'center'}}>New Calculation</Link>
        </div>
      </div>
    </div>
  );
};

export default Result;
