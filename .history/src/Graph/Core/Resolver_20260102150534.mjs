import { Calculator } from '../Logic/Calculator.mjs';

export const GraphResolver = {
    async resolve(id, ssot, targetWeight = 1000) {
        const registryItem = ssot.registry[id];
        const recipe = await this.loadEntity(id, ssot.orchestration.paths.entities);
        
        // Resolve recursive weights for the total requisition
        const mplace = this.calculateMplace(recipe, ssot, targetWeight);
        
        // Stack the technologies into a single linear workflow
        const workflow = this.composeWorkflow(registryItem, ssot, recipe.parameters);

        return { id, mplace, workflow, classification: registryItem.classification };
    },

    async loadEntity(id, path) {
        const res = await fetch(`./data/Store/${path}/${id}.json`);
        if (!res.ok) throw new Error(`Entity ${id} not found in ${path}`);
        return res.json();
    },

    calculateMplace(recipe, ssot, total) {
        return recipe.formula.map(ing => {
            const material = ssot.registry[ing.id];
            const physics = ssot.physics_categories[material?.material_class] || {};
            const precision = physics.PRECISION_DECIMALS ?? 1;
            
            return {
                ...ing,
                label: ing.id, // Fieldname from DB
                scaled_mass: (ing.pct * total).toFixed(precision)
            };
        });
    },

    composeWorkflow(registryItem, ssot, parameters = {}) {
        // Ensure technology_ref is an array for composition
        const techRefs = Array.isArray(registryItem.technology_ref) 
            ? registryItem.technology_ref 
            : [registryItem.technology_ref];

        return techRefs.flatMap(tId => {
            const tech = ssot.technologies[tId];
            if (!tech) return [];

            return Object.entries(tech.steps).map(([stepId, globalData]) => ({
                id: stepId,
                ...globalData,
                // Apply instance overrides from the recipe entity
                ...(parameters[stepId] || {})
            }));
        });
    }
};