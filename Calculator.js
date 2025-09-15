import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator as CalcIcon, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

const Calculator = () => {
  const [concentrations, setConcentrations] = useState({
    arsenic: '',
    lead: '',
    cadmium: '',
    chromium: '',
    mercury: '',
    nickel: '',
    copper: '',
    zinc: '',
    iron: '',
    manganese: ''
  });

  const [results, setResults] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputMode, setInputMode] = useState('manual'); // 'manual' | 'file'
  const navigate = useNavigate();

  const handleInputChange = (metal, value) => {
    setConcentrations(prev => ({
      ...prev,
      [metal]: value
    }));
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Convert string values to numbers (accept comma as decimal) and filter out empty/invalid values
      const numericConcentrations = {};
      Object.entries(concentrations).forEach(([metal, value]) => {
        if (value !== undefined && value !== null && String(value).trim() !== '') {
          const normalized = String(value).trim().replace(',', '.');
          const num = parseFloat(normalized);
          if (!Number.isNaN(num) && Number.isFinite(num)) {
            numericConcentrations[metal] = num;
          }
        }
      });

      if (Object.keys(numericConcentrations).length === 0) {
        const modeMsg = inputMode === 'file'
          ? 'No metal values found in the uploaded file. Ensure headers match: arsenic, lead, cadmium, chromium, mercury, nickel, copper, zinc, iron, manganese (optional: latitude, longitude), and the first data row has at least one numeric value.'
          : 'Please enter at least one metal concentration value.';
        setError(modeMsg);
        setLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:3001/api/hmpi/calculate', {
        heavyMetalConcentrations: numericConcentrations,
        location: {
          latitude: latitude !== '' ? parseFloat(latitude) : null,
          longitude: longitude !== '' ? parseFloat(longitude) : null
        }
      });

      setResults(response.data);

      // Save latest record and navigate to dedicated result page
      const existing = JSON.parse(localStorage.getItem('hmpiResults') || '[]');
      const sampleNo = existing.length + 1;
      const record = {
        sampleNo,
        latitude: latitude !== '' ? parseFloat(latitude) : null,
        longitude: longitude !== '' ? parseFloat(longitude) : null,
        inputs: numericConcentrations,
        outputs: response.data,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('hmpiResults', JSON.stringify([...existing, record]));
      navigate('/result', { state: { record } });
    } catch (err) {
      const backendMsg = err?.response?.data?.error;
      setError(backendMsg || 'Error calculating HMPI. Please check your input values and try again.');
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConcentrations({
      arsenic: '',
      lead: '',
      cadmium: '',
      chromium: '',
      mercury: '',
      nickel: '',
      copper: '',
      zinc: '',
      iron: '',
      manganese: ''
    });
    setResults(null);
    setError('');
    setLatitude('');
    setLongitude('');
  };

  const handleDownloadTemplate = () => {
    const headers = ['arsenic','lead','cadmium','chromium','mercury','nickel','copper','zinc','iron','manganese','latitude','longitude'];
    const example = ['0.005','0.01','','0.02','','','','','','','28.6139','77.2090'];
    const csv = [headers.join(','), example.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'safesip_sample_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const isExcel = /\.xlsx?$/.test(file.name.toLowerCase());
    const isCsv = /\.csv$/.test(file.name.toLowerCase());

    try {
      if (isExcel) {
        const data = await file.arrayBuffer();
        const workbook = window.XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = window.XLSX.utils.sheet_to_json(sheet, { header: 1 });
        // Expect header row keys matching metal keys optionally plus latitude/longitude
        const [header, ...rows] = json;
        if (!header) return;
        const first = rows.find(r => r && r.length);
        if (!first) return;
        const headerToIndex = Object.fromEntries(header.map((h, i) => [String(h).toLowerCase(), i]));
        const next = { ...concentrations };
        Object.keys(next).forEach(k => {
          const idx = headerToIndex[k];
          if (idx != null && first[idx] !== undefined && first[idx] !== '') {
            next[k] = String(first[idx]);
          }
        });
        const latIdx = headerToIndex['latitude'];
        const lonIdx = headerToIndex['longitude'];
        if (latIdx != null && first[latIdx] !== undefined && first[latIdx] !== '') setLatitude(String(first[latIdx]));
        if (lonIdx != null && first[lonIdx] !== undefined && first[lonIdx] !== '') setLongitude(String(first[lonIdx]));
        setConcentrations(next);
      } else if (isCsv) {
        const text = await file.text();
        const lines = text.split(/\r?\n/).filter(Boolean);
        if (lines.length < 2) return;
        const header = lines[0].split(',').map(s => s.trim().toLowerCase());
        const first = lines[1].split(',').map(s => s.trim());
        const headerToIndex = Object.fromEntries(header.map((h, i) => [h, i]));
        const next = { ...concentrations };
        Object.keys(next).forEach(k => {
          const idx = headerToIndex[k];
          if (idx != null && first[idx] !== undefined && first[idx] !== '') {
            next[k] = String(first[idx]);
          }
        });
        const latIdx = headerToIndex['latitude'];
        const lonIdx = headerToIndex['longitude'];
        if (latIdx != null && first[latIdx] !== undefined && first[latIdx] !== '') setLatitude(String(first[latIdx]));
        if (lonIdx != null && first[lonIdx] !== undefined && first[lonIdx] !== '') setLongitude(String(first[lonIdx]));
        setConcentrations(next);
      }
    } catch (e) {
      console.error('Failed to parse file', e);
      setError('Failed to parse file. Ensure headers match metal keys (e.g., arsenic, lead)');
    } finally {
      // reset input to allow re-uploading same file
      event.target.value = '';
    }
  };

  const metals = [
    { key: 'arsenic', name: 'Arsenic (As)', unit: 'mg/L' },
    { key: 'lead', name: 'Lead (Pb)', unit: 'mg/L' },
    { key: 'cadmium', name: 'Cadmium (Cd)', unit: 'mg/L' },
    { key: 'chromium', name: 'Chromium (Cr)', unit: 'mg/L' },
    { key: 'mercury', name: 'Mercury (Hg)', unit: 'mg/L' },
    { key: 'nickel', name: 'Nickel (Ni)', unit: 'mg/L' },
    { key: 'copper', name: 'Copper (Cu)', unit: 'mg/L' },
    { key: 'zinc', name: 'Zinc (Zn)', unit: 'mg/L' },
    { key: 'iron', name: 'Iron (Fe)', unit: 'mg/L' },
    { key: 'manganese', name: 'Manganese (Mn)', unit: 'mg/L' }
  ];

  return (
    <div className="calculator-page">
      <div className="container">
        <div className="calculator-header">
          <h1>HMPI Calculator</h1>
          <p>Enter heavy metal concentrations to calculate pollution indices</p>
        </div>

        <div className="calculator-content">
          <div className="input-section">
            <h2>Metal Concentrations</h2>
            <div className="input-mode" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 600 }}>Input mode:</span>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input
                  type="radio"
                  name="inputMode"
                  value="manual"
                  checked={inputMode === 'manual'}
                  onChange={() => setInputMode('manual')}
                />
                Manual entry
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <input
                  type="radio"
                  name="inputMode"
                  value="file"
                  checked={inputMode === 'file'}
                  onChange={() => setInputMode('file')}
                />
                Upload CSV/Excel
              </label>
            </div>
            {inputMode === 'file' && (
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="fileUpload" style={{ fontWeight: 600, marginRight: '0.75rem' }}>Choose file:</label>
                <input id="fileUpload" type="file" accept=".csv,.xls,.xlsx" onChange={handleFileUpload} />
                <div style={{ fontSize: '0.9rem', color: '#718096', marginTop: '0.4rem' }}>
                  Expected headers: arsenic, lead, cadmium, chromium, mercury, nickel, copper, zinc, iron, manganese, latitude, longitude
                </div>
              </div>
            )}
            {inputMode === 'manual' && (
              <div className="metals-grid">
                <div className="input-group">
                  <label htmlFor="latitude">Sample Latitude</label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      id="latitude"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="e.g., 28.6139"
                      step="0.0001"
                      min="-90"
                      max="90"
                    />
                    <span className="unit">deg</span>
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor="longitude">Sample Longitude</label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      id="longitude"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="e.g., 77.2090"
                      step="0.0001"
                      min="-180"
                      max="180"
                    />
                    <span className="unit">deg</span>
                  </div>
                </div>
              </div>
            )}
            {inputMode === 'manual' && (
              <div className="metals-grid">
                {metals.map((metal) => (
                  <div key={metal.key} className="input-group">
                    <label htmlFor={metal.key}>{metal.name}</label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        id={metal.key}
                        value={concentrations[metal.key]}
                        onChange={(e) => handleInputChange(metal.key, e.target.value)}
                        placeholder="0.000"
                        step="0.001"
                        min="0"
                      />
                      <span className="unit">{metal.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="calculator-actions">
              <button 
                onClick={handleCalculate} 
                disabled={loading}
                className="calculate-btn"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <CalcIcon className="w-5 h-5" />
                    Calculate HMPI
                  </>
                )}
              </button>
              <button onClick={handleReset} className="reset-btn">
                Reset
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {results && (
            <div className="results-section">
              <h2>Calculation Results</h2>
              {(latitude || longitude) && (
                <div className="result-location" style={{ marginBottom: '1rem', color: '#4a5568', textAlign: 'center' }}>
                  <strong>Sample Location:</strong>
                  <span> {latitude || '—'}, {longitude || '—'}</span>
                </div>
              )}
              <div className="results-grid">
                <div className="result-card primary">
                  <h3>HPI (Heavy Metal Pollution Index)</h3>
                  <div className="result-value">
                    {results.HPI.toFixed(2)}
                  </div>
                  <div className={`result-status ${results.classification.toLowerCase()}`}>
                    <CheckCircle className="w-5 h-5" />
                    <span>{results.classification}</span>
                  </div>
                </div>

                <div className="result-card">
                  <h3>HEI (Heavy Metal Evaluation Index)</h3>
                  <div className="result-value">
                    {results.HEI.toFixed(2)}
                  </div>
                </div>

                <div className="result-card">
                  <h3>MI (Metal Index)</h3>
                  <div className="result-value">
                    {results.MI.toFixed(2)}
                  </div>
                </div>

                <div className="result-card">
                  <h3>Cd (Degree of Contamination)</h3>
                  <div className="result-value">
                    {results.Cd.toFixed(2)}
                  </div>
                </div>

                <div className="result-card">
                  <h3>Nemerow Index</h3>
                  <div className="result-value">
                    {results.Nemerow.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="interpretation">
              <h3>Interpretation</h3>
                <p>
                  The Heavy Metal Pollution Index (HPI) value of <strong>{results.HPI.toFixed(2)}</strong> indicates 
                  that the groundwater quality is <strong>{results.classification.toLowerCase()}</strong> for consumption 
                  and environmental purposes.
                </p>
                <div className="interpretation-details">
                  <p><strong>HPI &le; 100:</strong> Safe for consumption</p>
                  <p><strong>HPI &gt; 100:</strong> Unsafe for consumption</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;

