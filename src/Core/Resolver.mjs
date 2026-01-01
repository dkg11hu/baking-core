import fs from 'fs';
import path from 'path';
import { Calculator } from '../Logic/Calculator.mjs';

export class GraphResolver {
    constructor() {
        this.root = process.env.BAKING_PATH || process.cwd();
        const schemaPath = path.join(this.root, 'data/Store/Registry/definitions.json');
        
        // Ensure the schema is loaded correctly
        const rawSchema = fs.readFileSync(schemaPath, 'utf-8');
        this.schema = JSON.parse(rawSchema);

        if (!this.schema.inventory) {
            throw new Error("Registry Error: 'inventory' key missing in definitions.json");
        }
    }

    resolve(nodeId, targetValue) {
        const item = this.schema.inventory[nodeId];
        if (!item) throw new Error(`ID ${nodeId} NOT IN REGISTRY`);

        const behavior = this.schema.logic_behaviors[item.type];

        // BASE CASE: Raw Material (LEAF)
        // Note: Return high-precision float for intermediate steps
        if (!behavior.recursive) {
            return { [nodeId]: targetValue };
        }

        // RECURSIVE CASE: Process (BRANCH)
        const entityPath = path.join(this.root, 'data/Store/Entities', `${nodeId.toLowerCase()}.json`);
        
        if (!fs.existsSync(entityPath)) {
            throw new Error(`File Missing: ${entityPath}`);
        }

        const entity = JSON.parse(fs.readFileSync(entityPath, 'utf-8'));
        const fKey = this.schema.field_mapping.RELATIONAL_DATA;

        // Use the Logic Namespace for the math
        const factor = Calculator.getScaleFactor(targetValue, entity[fKey]);

        let results = {};
        entity[fKey].forEach(part => {
            const subMass = part.pct * factor;
            // Recursive call
            const subRes = this.resolve(part.id, subMass);

            for (const [id, mass] of Object.entries(subRes)) {
                results[id] = (results[id] || 0) + mass;
            }
        });

        return results;
    }
}