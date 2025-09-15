from flask import Flask, request, jsonify
from flask_cors import CORS
from hmpi_calculator import calculate_indices

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.get('/api/health')
def health():
    return jsonify({"status": "ok"}), 200

@app.route('/api/hmpi/calculate', methods=['POST'])
def calculate_hmpi():
    data = request.get_json(silent=True) or {}
    heavy_metal_concentrations = data.get('heavyMetalConcentrations')

    if not heavy_metal_concentrations or not isinstance(heavy_metal_concentrations, dict):
        return jsonify({'error': 'Invalid input: heavyMetalConcentrations is required and should be an object with metal concentrations.'}), 400

    try:
        # ensure numeric values only
        parsed = {k: float(v) for k, v in heavy_metal_concentrations.items() if isinstance(v, (int, float, str)) and str(v).strip() != ''}
    except Exception:
        return jsonify({'error': 'Invalid numeric values in heavyMetalConcentrations.'}), 400

    if len(parsed) == 0:
        return jsonify({'error': 'Please provide at least one numeric metal concentration.'}), 400

    try:
        indices_result = calculate_indices(parsed)
        return jsonify(indices_result), 200
    except Exception as e:
        return jsonify({'error': f'Internal server error while calculating indices: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(port=3001, debug=True)
