export const GraphResolver = {
    async resolve(id, ssot) {
        const registryItem = ssot.registry[id];
        const res = await fetch(`${ssot.orchestration.paths.entities}/${id}.json`);
        const entity = await res.json();

        // Stitching multiple Technologies into a linear workflow
        const techStack = Array.isArray(registryItem.technology_ref) 
            ? registryItem.technology_ref 
            : [registryItem.technology_ref];

        const workflow = techStack.flatMap(tId => {
            const tech = ssot.technologies[tId];
            return Object.entries(tech.steps).map(([stepId, globalData]) => ({
                stepId,
                ...globalData,
                // Merging instance parameters (time/temp/tools) from the entity
                ...(entity.parameters?.[stepId] || {})
            }));
        });

        return { id, workflow, classification: registryItem.classification };
    }
};