export const GraphResolver = {
    async resolve(id, ssot) {
        const product = ssot.registry[id];
        const res = await fetch(`${ssot.orchestration.paths.entities}/${id}.json`);
        const entity = await res.json();

        // COMPOSITION: Stack multiple technologies (e.g., Scald + Leavened)
        const techStack = Array.isArray(product.technology_ref) 
            ? product.technology_ref 
            : [product.technology_ref];

        const workflow = techStack.flatMap(tId => {
            const tech = ssot.technologies[tId];
            return Object.entries(tech.steps).map(([stepId, globalData]) => ({
                stepId,
                ...globalData,
                ...(entity.parameters?.[stepId] || {}) // Instance overrides
            }));
        });

        return { id, workflow, classification: product.classification, formula: entity.formula };
    }
};