export class Calculator {
    static applyRounding(value, threshold = 5) {
        if (value === 0) return 0;
        const rounded = Math.round(value);
        const deviation = Math.abs((rounded - value) / value) * 100;
        return (deviation > threshold) ? Number(value.toFixed(1)) : rounded;
    }

    static sanitizeMiseEnPlace(rawResults, ssot) {
        const sanitized = {};
        const registry = ssot.registry;
        const physics = ssot.physics_categories;

        for (const [id, mass] of Object.entries(rawResults)) {
            const entry = registry[id];
            const categoryId = entry ? entry.category_id : 'OTHER';
            const rules = physics[categoryId] || { ROUNDING_THRESHOLD_PCT: 5 };
            sanitized[id] = this.applyRounding(mass, rules.ROUNDING_THRESHOLD_PCT);
        }
        return sanitized;
    }

    static calculateHydration(resolvedMaterials, ssot) {
        let dry = 0, wet = 0;
        for (const [id, mass] of Object.entries(resolvedMaterials)) {
            const role = ssot.physics_categories[ssot.registry[id]?.category_id]?.hydration_role;
            if (role === 'base') dry += mass;
            if (role === 'fluid') wet += mass;
        }
        return dry > 0 ? Math.round((wet / dry) * 100) : 0;
    }
}