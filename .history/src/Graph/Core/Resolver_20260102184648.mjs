export const GraphResolver = {
    async resolve(id, ssot) {
        const product = ssot.registry[id];
        // Ensure path matches the definitions orchestration
        const path = ssot.orchestration.paths.entities;
        const res = await fetch(`./data/Store/${path}/${id}.json`);
        const entity = await res.json();

        // COMPOSITION: Stitching the tech array (e.g., ["TECH_SCALD", "TECH_LEAVENED"])
        const techStack = Array.isArray(product.technology_ref) 
            ? product.technology_ref 
            : [product.technology_ref];

        const workflow = techStack.flatMap(tId => {
            const tech = ssot.technologies[tId];
            if (!tech) return [];
            return Object.entries(tech.steps).map(([stepId, globalData]) => ({
                stepId,
                ...globalData,
                // Instance-level overrides (temp/time/tools)
                ...(entity.parameters?.[stepId] || {})
            }));
        });

        return { id, workflow, formula: entity.formula, classification: product.classification };
    }
};