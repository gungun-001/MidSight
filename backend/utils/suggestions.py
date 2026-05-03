"""
Recommendation Engine
=====================
Returns personalized treatment suggestions based on detected disease and severity.
"""

from typing import List

# ── Suggestion database ───────────────────────────────────────────────────────
SUGGESTIONS: dict[str, dict[str, List[str]]] = {
    "Acne": {
        "Mild": [
            "Wash your face twice daily with a gentle, non-comedogenic cleanser.",
            "Avoid touching or picking at blemishes to prevent scarring.",
            "Use oil-free, non-comedogenic moisturizer and sunscreen.",
            "Consider over-the-counter benzoyl peroxide (2.5%) or salicylic acid products.",
            "Stay hydrated and maintain a balanced diet low in high-glycemic foods.",
        ],
        "Moderate": [
            "Consult a dermatologist for prescription topical retinoids or antibiotics.",
            "Use a gentle foaming cleanser with salicylic acid twice daily.",
            "Avoid heavy makeup; opt for mineral-based, non-comedogenic products.",
            "Apply benzoyl peroxide spot treatment on active breakouts.",
            "Consider dietary changes: reduce dairy and high-sugar foods.",
            "Change pillowcases frequently to reduce bacterial exposure.",
        ],
        "Severe": [
            "Seek immediate dermatologist consultation — prescription treatment is essential.",
            "Oral antibiotics or isotretinoin (Accutane) may be recommended by your doctor.",
            "Do NOT squeeze or pop cysts; this worsens inflammation and scarring.",
            "Use only prescribed topical treatments; avoid harsh OTC products.",
            "Consider professional chemical peels or light therapy under medical supervision.",
            "Document your skin condition with photos to track treatment progress.",
        ],
    },
    "Eczema": {
        "Mild": [
            "Moisturize affected areas at least twice daily with fragrance-free emollient.",
            "Use mild, fragrance-free soap and detergents.",
            "Avoid known triggers: dust mites, pet dander, certain fabrics (wool).",
            "Apply cool, damp compresses to relieve itching.",
            "Wear loose-fitting, breathable cotton clothing.",
        ],
        "Moderate": [
            "Consult a dermatologist for prescription topical corticosteroids.",
            "Apply thick moisturizing cream (e.g., CeraVe, Eucerin) immediately after bathing.",
            "Use a humidifier to maintain indoor humidity between 45–55%.",
            "Identify and eliminate food triggers (common: dairy, eggs, nuts).",
            "Consider antihistamines for nighttime itch relief.",
            "Avoid hot showers; use lukewarm water and pat skin dry gently.",
        ],
        "Severe": [
            "Urgent dermatologist referral required for systemic treatment options.",
            "Biologic medications (dupilumab) or immunosuppressants may be prescribed.",
            "Wet wrap therapy under medical guidance can provide relief.",
            "Avoid all known allergens and irritants strictly.",
            "Monitor for secondary bacterial infections (signs: warmth, oozing, crusting).",
            "Consider allergy testing to identify specific triggers.",
        ],
    },
    "Psoriasis": {
        "Mild": [
            "Apply fragrance-free moisturizer daily to reduce scaling and dryness.",
            "Use over-the-counter coal tar or salicylic acid shampoos for scalp involvement.",
            "Get moderate sun exposure (10–15 min/day) — UV light can reduce plaques.",
            "Avoid skin injuries; even minor cuts can trigger new plaques (Koebner effect).",
            "Manage stress through yoga, meditation, or regular exercise.",
        ],
        "Moderate": [
            "Consult a dermatologist for prescription topical corticosteroids or vitamin D analogs.",
            "Phototherapy (UVB light therapy) is highly effective for moderate psoriasis.",
            "Avoid alcohol and smoking, which are known to worsen psoriasis.",
            "Maintain a healthy weight — obesity is linked to more severe psoriasis.",
            "Consider a Mediterranean diet rich in omega-3 fatty acids.",
            "Join a psoriasis support group for emotional well-being.",
        ],
        "Severe": [
            "Immediate dermatologist consultation for systemic or biologic therapy.",
            "Biologic agents (TNF inhibitors, IL-17/23 inhibitors) are highly effective.",
            "Methotrexate or cyclosporine may be prescribed for rapid control.",
            "Monitor for psoriatic arthritis symptoms (joint pain, stiffness).",
            "Regular blood tests required when on systemic medications.",
            "Avoid NSAIDs and beta-blockers which can trigger flares.",
        ],
    },
    "Normal": {
        "Mild": [
            "Your skin appears healthy — maintain a consistent skincare routine.",
            "Apply broad-spectrum SPF 30+ sunscreen daily to prevent future damage.",
            "Stay hydrated: drink at least 8 glasses of water per day.",
            "Eat a balanced diet rich in antioxidants (berries, leafy greens, nuts).",
            "Get 7–9 hours of sleep for optimal skin regeneration.",
        ],
        "Moderate": [
            "No significant condition detected, but consider a preventive dermatology check-up.",
            "Use a gentle cleanser and non-comedogenic moisturizer daily.",
            "Apply SPF 50+ sunscreen and reapply every 2 hours outdoors.",
            "Avoid excessive alcohol and smoking for long-term skin health.",
            "Consider adding vitamin C serum to your morning routine for antioxidant protection.",
        ],
        "Severe": [
            "No significant condition detected. If you have concerns, consult a dermatologist.",
            "Maintain a consistent skincare routine with cleanser, moisturizer, and SPF.",
            "Schedule annual skin cancer screenings with a board-certified dermatologist.",
            "Monitor any moles or spots for changes in size, shape, or color (ABCDE rule).",
            "Protect skin from UV radiation year-round.",
        ],
    },
}

# Generic fallback suggestions
GENERIC_SUGGESTIONS = [
    "Consult a qualified dermatologist for professional evaluation.",
    "Keep the affected area clean and moisturized.",
    "Avoid scratching or irritating the skin.",
    "Document changes in your skin condition with photos.",
    "Maintain a healthy lifestyle: balanced diet, hydration, and adequate sleep.",
]


def get_suggestions(disease: str, severity: str) -> List[str]:
    """
    Return a list of treatment recommendations for the given disease and severity.

    Falls back to generic suggestions if the combination is not found.
    """
    disease_suggestions = SUGGESTIONS.get(disease, {})
    suggestions = disease_suggestions.get(severity, GENERIC_SUGGESTIONS)
    return suggestions
