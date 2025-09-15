from typing import Dict, Any
import math

def calculate_indices(heavy_metal_concentrations: Dict[str, float]) -> Dict[str, Any]:
    standard_values: Dict[str, float] = {
        'arsenic': 0.01,
        'lead': 0.01,
        'cadmium': 0.003,
        'chromium': 0.05,
        'mercury': 0.006,
        'nickel': 0.07,
        'copper': 2.0,
        'zinc': 3.0,
        'iron': 0.3,
        'manganese': 0.4,
    }

    metals = [m for m in heavy_metal_concentrations.keys() if m in standard_values]

    # HPI calculation
    sum_wi_qi = 0.0
    sum_wi = 0.0
    for metal in metals:
        mi = heavy_metal_concentrations[metal]
        si = standard_values[metal]
        ideal = 0.0  # for toxic metals
        qi = ((mi - ideal) / (si - ideal)) * 100
        wi = 1 / si  # unit weight
        sum_wi_qi += wi * qi
        sum_wi += wi
    hpi = sum_wi_qi / sum_wi if sum_wi > 0 else 0.0

    # HEI calculation
    hei = 0.0
    for metal in metals:
        mi = heavy_metal_concentrations[metal]
        si = standard_values[metal]
        hei += mi / si

    # MI calculation (Metal Index)
    mi = hei  # often same as HEI

    # Cd (Degree of Contamination)
    cd = 0.0
    for metal in metals:
        mi_val = heavy_metal_concentrations[metal]
        si = standard_values[metal]
        cd += (mi_val / si) - 1

    # Nemerow Index (guard empty metals)
    if len(metals) == 0:
        nemerow = 0.0
    else:
        single_factors = [heavy_metal_concentrations[m] / standard_values[m] for m in metals]
        max_pi = max(single_factors)
        avg_pi = sum(single_factors) / len(single_factors)
        nemerow = math.sqrt((max_pi ** 2 + avg_pi ** 2) / 2)

    # Classification based on HPI
    classification = "Safe" if hpi <= 100 else "Unsafe"

    return {
        'HPI': hpi,
        'HEI': hei,
        'MI': mi,
        'Cd': cd,
        'Nemerow': nemerow,
        'classification': classification
    }

def calculate_hmpi(heavy_metal_concentrations: Dict[str, float]) -> float:
    return calculate_indices(heavy_metal_concentrations)['HPI']

def classify_hmpi(hmpi: float) -> str:
    return "Safe" if hmpi < 100 else "Unsafe"
    
