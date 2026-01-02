/**
 * PURE ENGLISH MATH LOGIC
 * Domain-agnostic mathematical operations for the Graph.
 */
export class Calculator {
    /**
     * Professional Rounding (Threshold Rule)
     * If rounding exceeds a certain % of deviation, we keep the decimal for precision.
     */
    static applyRounding(value, threshold = 5) {
        if (value === 0) return 0;
        const rounded = Math.round(value);
        const deviation = Math.abs((rounded - value) / value) * 100;
        return (deviation > threshold) ? Number(value.toFixed(1)) : rounded;
    }

    /**
     * Processes raw weights into a rounded mise-en-place map
     * Dynamic lookup based on Database fieldnames (physics_categories)
     */
    static sanitizeMiseEnPlace(rawResults, ssot) {
        const sanitized = {};
        const registry = ssot.registry || ssot.inventory;
        const physics = ssot.physics_categories;

        for (const [id, mass] of Object.entries(rawResults)) {
            const entry = registry[id];
            // Get category from DB; default to OTHER if missing
            const categoryId = entry ? entry.category_id : 'OTHER';
            
            // Map threshold from physics_categories in definitions.json
            const rules = physics[categoryId] || { ROUNDING_THRESHOLD_PCT: 5 };
            
            sanitized[id] = this.applyRounding(mass, rules.ROUNDING_THRESHOLD_PCT);
        }
        return sanitized;
    }

    /**
     * Final Parity Check: Adjusts largest mass to match targetTotal exactly.
     * Prevents "missing grams" after rounding a large list of ingredients.
     */
    static reconcileTotal(sanitizedMaterials, targetTotal) {
        const entries = Object.entries(sanitizedMaterials);
        if (entries.length === 0) return sanitizedMaterials;

        const currentSum = entries.reduce((sum, [_, mass]) => sum + mass, 0);
        const diff = targetTotal - currentSum;

        if (Math.abs(diff) < 0.01) return sanitizedMaterials;

        // Find the ID with the largest mass to absorb the correction (usually the Flour)
        const largestId = entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
        sanitizedMaterials[largestId] = Number((sanitizedMaterials[largestId] + diff).toFixed(1));

        return sanitizedMaterials;
    }

    /**
     * Relational Hydration Calculation
     * Uses DB field 'hydration_role' to determine base vs fluid.
     */
    static calculateHydration(resolvedMaterials, ssot) {
        let dryWeight = 0;
        let liquidWeight = 0;
        const db = ssot.registry || ssot.inventory;

        for (const [id, mass] of Object.entries(resolvedMaterials)) {
            const item = db[id];
            if (!item) continue;

            const categoryId = item.category_id;
            const role = ssot.physics_categories[categoryId]?.hydration_role;

            if (role === 'base') dryWeight += mass;
            if (role === 'fluid') liquidWeight += mass;
        }
        return dryWeight > 0 ? Math.round((liquidWeight / dryWeight) * 100) : 0;
    }
}