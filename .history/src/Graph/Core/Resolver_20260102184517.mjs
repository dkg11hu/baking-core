export const GraphResolver = {
    async resolve(id, ssot) {
        const product = ssot.registry[id];
        // Dynamic pathing from orchestration.paths.entities
        const res = await fetch(`./data/Store/${ssot.orchestration.paths.entities}/${id}.json`);
        const entity = await res.json();

        // COMPOSITION LOGIC: Map multiple technologies into a single sequence
        const techStack = Array.isArray(product.technology_ref) 
            ? product.technology_ref 
            : [product.technology_ref];

        const workflow = techStack.flatMap(tId => {
            const tech = ssot.technologies[tId];
            return Object.entries(tech.steps).map(([stepId, globalData]) => ({
                stepId,
                ...globalData,
                // Apply instance overrides (time, temp, tools) from the entity JSON
                ...(entity.parameters?.[stepId] || {})
            }));
        });

        return { id, workflow, classification: product.classification, formula: entity.formula };
    }
};