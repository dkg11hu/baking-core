import { Calculator } from '../Logic/Calculator.mjs';

export class GraphResolver {
    constructor(preLoadedSchema = null) {
        // If we have a schema (Browser), use it. Otherwise, load from disk (Node).
        this.schema = preLoadedSchema;
        this.isBrowser = typeof window !== 'undefined';
        
        if (!this.isBrowser) {
            this.initNode();
        }
    }

    initNode() {
        // This only runs in Node.js
        this.fs = import('fs'); 
        this.path = import('path');
        this.root = process.env.BAKING_PATH || process.cwd();
    }

    /**
     * ASYNC RESOLVE
     * Changed to async to support browser fetch()
     */
    async resolve(nodeId, targetValue) {
        if (!this.schema) {
            // Load schema if missing (Node fallback)
            const schemaData = await this.loadJson('data/Store/Registry/definitions.json');
            this.schema = schemaData;
        }

        const item = this.schema.inventory[nodeId];
        if (!item) throw new Error(`ID ${nodeId} NOT IN REGISTRY`);

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
        
        // Use for...of for async recursion
        for (const part of entity[fKey]) {
            const subMass = part.pct * factor;
            const subRes = await this.resolve(part.id, subMass);

            for (const [id, mass] of Object.entries(subRes)) {
                results[id] = (results[id] || 0) + mass;
            }
        }

        return results;
    }

    /**
     * Environment-agnostic JSON Loader
     */
    async loadJson(relativeUrl) {
        if (this.isBrowser) {
            // Browser Query
            const response = await fetch(`./${relativeUrl}`);
            return await response.json();
        } else {
            // Node.js Query (using dynamic import for fs/path)
            const fs = await import('fs');
            const path = await import('path');
            const absolutePath = path.join(this.root, relativeUrl);
            return JSON.parse(fs.readFileSync(absolutePath, 'utf-8'));
        }
    }
}