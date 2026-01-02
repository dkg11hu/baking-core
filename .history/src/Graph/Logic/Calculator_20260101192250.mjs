/**
 * PURE ENGLISH MATH LOGIC
 * Domain-agnostic mathematical operations for the Graph.
 */
export class Calculator {
    /**
     * Calculates the scale factor for a formula
     */
    static getScaleFactor(targetTotal, formula) {
        const sumParts = formula.reduce((sum, item) => sum + (item.pct || 0), 0);
        return sumParts > 0 ? targetTotal / sumParts : 0;
    }

    /**
     * Professional Rounding (5% Rule)
     */
    static applyRounding(value, threshold = 5) {
        if (value === 0) return 0;
        const rounded = Math.round(value);
        const deviation = Math.abs((rounded - value) / value) * 100;
        return (deviation > threshold) ? Number(value.toFixed(1)) : rounded;
    }

    /**
     * Processes raw weights into a rounded mise-en-place map
     */


    /**
     * Final Parity Check: Adjusts largest mass to match targetTotal exactly.
     */
    static reconcileTotal(sanitizedMaterials, targetTotal) {
        const entries = Object.entries(sanitizedMaterials);
        const currentSum = entries.reduce((sum, [_, mass]) => sum + mass, 0);
        const diff = targetTotal - currentSum;

        if (Math.abs(diff) < 0.01) return sanitizedMaterials;

        // Find the ID with the largest mass to absorb the correction
        const largestId = entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
        sanitizedMaterials[largestId] = Number((sanitizedMaterials[largestId] + diff).toFixed(1));

        return sanitizedMaterials;
    }

    /**
     * Relational Hydration Calculation
     */
    static calculateHydration(resolvedMaterials, schema) {
        let dryWeight = 0;
        let liquidWeight = 0;

        // Fieldnames from database: use inventory or registry
        const db = schema.inventory || schema.registry;

        for (const [id, mass] of Object.entries(resolvedMaterials)) {
            const item = db[id];
            if (!item) continue;

            const categoryId = item.category_id;
            const role = schema.physics_categories[categoryId]?.hydration_role;

            if (role === 'base') dryWeight += mass;
            if (role === 'fluid') liquidWeight += mass;
        }
        return dryWeight > 0 ? Math.round((liquidWeight / dryWeight) * 100) : 0;
    }
}