export const GraphResolver = {
    async resolve(id, ssot) {
        const product = ssot.registry[id];
        if (!product) throw new Error(`ID ${id} not found in registry`);

        // Get path from orchestration: e.g., "Entities"
        const path = ssot.orchestration.paths.entities;

        /** * FIX: Case-Sensitivity Mapping
         * Registry ID (Uppercase: PROD_YUDANE) -> Filename (Lowercase: prod_yudane.json)
         */
        const fileName = id.toLowerCase();
        const res = await fetch(`./data/Store/${path}/${fileName}.json`);
        
        // Handle potential fetch errors (404, 500)
        if (!res.ok) {
            throw new Error(`Failed to load entity file: ./data/Store/${path}/${fileName}.json`);
        }

        const entity = await res.json();

        // COMPOSITION: Stitching the tech array (e.g., ["TECH_SCALD", "TECH_LEAVENED_BASE"])
        const techStack = Array.isArray(product.technology_ref) 
            ? product.technology_ref 
            : [product.technology_ref];

        const workflow = techStack.flatMap(tId => {
            const tech = ssot.technologies[tId];
            if (!tech) {
                console.warn(`Technology ${tId} defined in registry but missing in technologies library.`);
                return [];
            }
            
            return Object.entries(tech.steps).map(([stepId, globalData]) => ({
                stepId,
                ...globalData,
                // Apply instance-level overrides from the entity JSON (target_temp, duration_min)
                ...(entity.parameters?.[stepId] || {})
            }));
        });

        return { 
            id, 
            workflow, 
            formula: entity.formula, 
            classification: product.classification 
        };
    }
};