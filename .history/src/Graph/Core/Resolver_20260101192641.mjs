import { Calculator } from '../Logic/Calculator.mjs';

export class GraphResolver {
    constructor(preLoadedSchema = null) {
        this.schema = preLoadedSchema;
        this.isBrowser = typeof window !== 'undefined';
        
        if (!this.isBrowser) {
            this.initNode();
        }
    }

    initNode() {
        this.root = process.env.BAKING_PATH || process.cwd();
    }

    async resolve(nodeId, targetValue) {
        if (!this.schema) {
            this.schema = await this.loadJson('data/Store/Registry/definitions.json');
        }

        // DATABASE ALIGNMENT: Use 'registry' as found in your definitions.json
        // Falling back to 'inventory' for backward compatibility if needed
        const db = this.schema.registry || this.schema.inventory;
        
        const item = db[nodeId];
        if (!item) throw new Error(`ID ${nodeId} NOT IN DATABASE REGISTRY`);

        const behavior = this.schema.logic_behaviors[item.type];

        // BASE CASE: Raw Material (LEAF)
        if (!behavior.recursive) {
            return { [nodeId]: targetValue };
        }

        // RECURSIVE CASE: Process (BRANCH)
        const entityPath = `data/Store/Entities/${nodeId.toLowerCase()}.json`;
        const entity = await this.loadJson(entityPath);
        
        const fKey = this.schema.field_mapping.RELATIONAL_DATA;
        const factor = Calculator.getScaleFactor(targetValue, entity[fKey]);

        let results = {};
        
        for (const part of entity[fKey]) {
            const subMass = part.pct * factor;
            const subRes = await this.resolve(part.id, subMass);

            for (const [id, mass] of Object.entries(subRes)) {
                results[id] = (results[id] || 0) + mass;
            }
        }

        return results;
    }

    async loadJson(relativeUrl) {
        if (this.isBrowser) {
            const response = await fetch(`./${relativeUrl}`);
            return await response.json();
        } else {
            const fs = await import('fs');
            const path = await import('path');
            const absolutePath = path.join(this.root, relativeUrl);
            return JSON.parse(fs.readFileSync(absolutePath, 'utf-8'));
        }
    }
};

// src/Graph/Core/Resolver.mjs

async resolveHierarchy(nodeId, targetValue) {
    const item = this.schema.registry[nodeId] || this.schema.inventory[nodeId];
    const behavior = this.schema.logic_behaviors[item.type];

    // BASE CASE: Just the material
    if (!behavior.recursive) {
        return { id: nodeId, mass: targetValue, type: 'LEAF' };
    }

    // RECURSIVE CASE: The Process
    const entityPath = `data/Store/Entities/${nodeId.toLowerCase()}.json`;
    const entity = await this.loadJson(entityPath);
    const fKey = this.schema.field_mapping.RELATIONAL_DATA;
    const factor = Calculator.getScaleFactor(targetValue, entity[fKey]);

    return {
        id: nodeId,
        mass: targetValue,
        type: 'BRANCH',
        // This is the "Series of Queries" branching out
        children: await Promise.all(entity[fKey].map(async part => {
            return await this.resolveHierarchy(part.id, part.pct * factor);
        }))
    };
}