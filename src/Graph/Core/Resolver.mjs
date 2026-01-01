// src/Graph/Core/Resolver.mjs
import fs from 'fs';
import path from 'path';

export class GraphResolver {
    constructor() {
        this.root = process.env.BAKING_PATH || process.cwd();
        const schemaPath = path.join(this.root, 'data/Store/Registry/definitions.json');
        this.schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
    }

    resolve(nodeId, targetValue) {
        const itemDefinition = this.schema.registry[nodeId];
        const behavior = this.schema.logic_behaviors[itemDefinition.type];

        // BASE CASE: Leaf node (e.g., MAT_001)
        if (!behavior.recursive) {
            return { [nodeId]: targetValue };
        }

        // RECURSIVE CASE: Branch node
        const dataPath = path.join(this.root, 'data/Store/Entities', `${nodeId.toLowerCase()}.json`);
        const entity = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

        // 1. DYNAMIC FIELD MAPPING
        const formulaKey = this.schema.field_mapping.RELATIONAL_DATA;
        const prereqKey = this.schema.field_mapping.DEPENDENCY_LINK;

        // 2. VALIDATION: Check if prerequisites exist in the SSOT
        if (entity[prereqKey]) {
            entity[prereqKey].forEach(pId => {
                if (!this.schema.registry[pId]) {
                    throw new Error(`CRITICAL: Prerequisite ${pId} not found in SSOT.`);
                }
            });
        }

        // 3. MATH: Standard Reverse-Scaling
        const sumParts = entity[formulaKey].reduce((sum, item) => sum + item.pct, 0);
        const factor = targetValue / sumParts;

        let aggregatedResult = {};
        entity[formulaKey].forEach(item => {
            const calculatedValue = item.pct * factor;
            const subResults = this.resolve(item.id, calculatedValue);

            for (const [id, val] of Object.entries(subResults)) {
                aggregatedResult[id] = (aggregatedResult[id] || 0) + val;
            }
        });

        return aggregatedResult;
    }
}