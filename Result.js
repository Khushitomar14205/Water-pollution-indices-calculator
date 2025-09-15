import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';

const Result = () => {
  const location = useLocation();

  const record = useMemo(() => {
    if (location.state && location.state.record) return location.state.record;
    try {
      const data = JSON.parse(localStorage.getItem('hmpiResults') || '[]');
      return data[data.length - 1] || null;
    } catch (_) {
      return null;
    }
  }, [location.state]);

  const handleDownloadPdf = () => {
    if (!record || !window.jspdf) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('HMPI Calculation Result - SafeSip', 14, 18);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);

    const inputsArray = Object.entries(record.inputs || {}).map(([k, v]) => `${k}: ${v}`);
    const outputsArray = record.outputs
      ? [
          `HPI: ${record.outputs.HPI?.toFixed?.(2)}`,
          `HEI: ${record.outputs.HEI?.toFixed?.(2)}`,
          `MI: ${record.outputs.MI?.toFixed?.(2)}`,
          `Cd: ${record.outputs.Cd?.toFixed?.(2)}`,
          `Nemerow: ${record.outputs.Nemerow?.toFixed?.(2)}`
        ]
      : [];

    const rows = [
      ['Sample No.', String(record.sampleNo || '-')],
      ['Latitude', record.latitude ?? '-'],
      ['Longitude', record.longitude ?? '-'],
      ['HPI', record.outputs?.HPI != null ? record.outputs.HPI.toFixed(2) : '-'],
      ['HEI', record.outputs?.HEI != null ? record.outputs.HEI.toFixed(2) : '-'],
      ['MI', record.outputs?.MI != null ? record.outputs.MI.toFixed(2) : '-'],
      ['Cd', record.outputs?.Cd != null ? record.outputs.Cd.toFixed(2) : '-'],
      ['Nemerow', record.outputs?.Nemerow != null ? record.outputs.Nemerow.toFixed(2) : '-'],
      ['Classification', record.outputs?.classification || '-']
    ];

    let y = 36;
    rows.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label + ':', 14, y);
      doc.setFont(undefined, 'normal');
      const split = doc.splitTextToSize(String(value), 180);
      doc.text(split, 50, y);
      y += 8 + (split.length - 1) * 6;
    });

    doc.save(`safesip_result_sample_${record.sampleNo || 'latest'}.pdf`);
  };


  const handleDownloadCsv = () => {
    if (!record) return;
    const headers = ['Sample No.','Latitude','Longitude','HPI','HEI','MI','Cd','Nemerow','Classification'];
    const row = [
      record.sampleNo ?? '-',
      record.latitude ?? '-',
      record.longitude ?? '-',
      record.outputs?.HPI != null ? record.outputs.HPI.toFixed(2) : '-',
      record.outputs?.HEI != null ? record.outputs.HEI.toFixed(2) : '-',
      record.outputs?.MI != null ? record.outputs.MI.toFixed(2) : '-',
      record.outputs?.Cd != null ? record.outputs.Cd.toFixed(2) : '-',
      record.outputs?.Nemerow != null ? record.outputs.Nemerow.toFixed(2) : '-',
      record.outputs?.classification ?? '-'
    ];
    const csv = [headers.join(','), row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safesip_result_sample_${record.sampleNo || 'latest'}.csv`; // opens in Excel
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!record) {
    return (
      <div className="page outputs-page">
        <div className="container">
          <h1>Calculation Result</h1>
          <p>No result found. Please run a calculation.</p>
          <Link to="/calculator" className="cta-button">Go to Calculator</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page outputs-page">
      <div className="container">
        <h1>Calculation Result</h1>
        <div className="standards-table-container" style={{ marginTop: '1rem' }}>
          <table className="standards-table">
            <thead>
              <tr>
                <th>Sample No.</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>HPI</th>
                <th>HEI</th>
                <th>MI</th>
                <th>Cd</th>
                <th>Nemerow</th>
                <th>Classification</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{record.sampleNo}</td>
                <td>{record.latitude ?? '—'}</td>
                <td>{record.longitude ?? '—'}</td>
                <td>{record.outputs?.HPI != null ? record.outputs.HPI.toFixed(2) : '—'}</td>
                <td>{record.outputs?.HEI != null ? record.outputs.HEI.toFixed(2) : '—'}</td>
                <td>{record.outputs?.MI != null ? record.outputs.MI.toFixed(2) : '—'}</td>
                <td>{record.outputs?.Cd != null ? record.outputs.Cd.toFixed(2) : '—'}</td>
                <td>{record.outputs?.Nemerow != null ? record.outputs.Nemerow.toFixed(2) : '—'}</td>
                <td>{record.outputs?.classification || '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={handleDownloadPdf} className="calculate-btn">Download PDF</button>
          <button onClick={handleDownloadCsv} className="calculate-btn">Download Excel (CSV)</button>
          <Link to="/calculator" className="reset-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>New Calculation</Link>
        </div>
      </div>
    </div>
  );
};

export default Result;


