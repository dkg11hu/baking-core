import { Calculator } from '../Logic/Calculator.mjs';

export const GraphResolver = {
    async resolve(id, ssot, targetWeight = 1000) {
        const registry = ssot.registry[id];
        const recipe = await this.loadEntity(id, ssot.orchestration.paths.entities);
        
        // 1. Resolve recursive formula for weights
        const mplace = this.calculateMplace(recipe, ssot, targetWeight);
        
        // 2. Compose Workflow steps from technology_ref array
        const workflow = this.composeWorkflow(registry, ssot, recipe.parameters);

        return { id, mplace, workflow, classification: registry.classification };
    },

    async loadEntity(id, path) {
        const res = await fetch(`./data/Store/${path}/${id}.json`);
        return res.json();
    },

    calculateMplace(recipe, ssot, total) {
        // Recursive math logic for ingredient scaling
        return recipe.formula.map(ing => ({
            ...ing,
            scaled_mass: (ing.pct * total).toFixed(ssot.physics_categories[ssot.registry[ing.id]?.material_class]?.PRECISION_DECIMALS || 1)
        }));
    },

    composeWorkflow(registry, ssot, parameters = {}) {
        const techRefs = Array.isArray(registry.technology_ref) 
            ? registry.technology_ref 
            : [registry.technology_ref];

        return techRefs.flatMap(tId => {
            const tech = ssot.technologies[tId];
            return Object.entries(tech.steps).map(([stepId, globalData]) => ({
                id: stepId,
                ...globalData,
                // Merge instance-specific overrides (time, temp, tools)
                ...(parameters[stepId] || {})
            }));
        });
    }
};