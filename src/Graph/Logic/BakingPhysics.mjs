/**
 * PURE LOGIC MODULE
 * No FileSystem access, no environment variables.
 * Only pure math functions.
 */

export const BakingPhysics = {
    /**
     * THE 5% RULE
     * Rounds to whole grams unless the change exceeds 5%.
     */
    applyTechnicalRounding(rawValue, threshold = 5) {
        if (rawValue === 0) return 0;
        const rounded = Math.round(rawValue);
        const deviation = Math.abs((rounded - rawValue) / rawValue) * 100;

        return (deviation > threshold) ? Number(rawValue.toFixed(1)) : rounded;
    },

    /**
     * HYDRATION CALCULATOR
     * Purely relational math based on Physics Groups.
     */
    calculateHydration(components, schema) {
        let base = 0;
        let fluid = 0;

        components.forEach(c => {
            const role = schema.physics_rules[c.category_id];
            if (role.is_base) base += c.mass;
            if (role.is_fluid) fluid += c.mass;
        });

        return base > 0 ? (fluid / base) * 100 : 0;
    }
};