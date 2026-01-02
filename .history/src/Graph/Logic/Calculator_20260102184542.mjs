export class Calculator {
    static sanitizeMiseEnPlace(rawResults, ssot) {
        const sanitized = {};
        const physics = ssot.physics_categories;

        for (const [id, mass] of Object.entries(rawResults)) {
            const entry = ssot.registry[id];
            const catId = entry ? entry.category_id : 'OTHER';
            const rules = physics[catId] || { ROUNDING_THRESHOLD_PCT: 0.05 };
            
            sanitized[id] = this.applyRounding(mass, rules.ROUNDING_THRESHOLD_PCT);
        }
        return sanitized;
    }

    static applyRounding(value, threshold) {
        if (value === 0) return 0;
        const rounded = Math.round(value);
        const deviation = Math.abs((rounded - value) / value);
        return (deviation > threshold) ? Number(value.toFixed(1)) : rounded;
    }
}