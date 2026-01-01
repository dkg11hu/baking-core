#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { GraphResolver } from './src/Graph/Core/Resolver.mjs';
import { Calculator } from './src/Graph/Logic/Calculator.mjs';

const root = process.env.BAKING_PATH || process.cwd();
const ssotPath = path.join(root, 'data/Store/Registry/definitions.json');

try {
    const ssot = JSON.parse(fs.readFileSync(ssotPath, 'utf-8'));
    const orch = ssot.orchestration;
    const resolver = new GraphResolver(ssot);

    // DYNAMIC INPUTS: node main.mjs [ID] [MASS]
    // Example: bake PROD_002 1500
    const targetId = process.argv[2] ? process.argv[2].toUpperCase() : 'PROD_002';
    const targetMass = parseInt(process.argv[3]) || 1000;

    const rawResults = resolver.resolve(targetId, targetMass);
    const hydration = Calculator.calculateHydration(rawResults, ssot);
    const sanitized = Calculator.sanitizeMiseEnPlace(rawResults, ssot);
    const finalMise = Calculator.reconcileTotal(sanitized, targetMass);

    const localePath = path.join(root, orch.paths.locale, 'en.json');
    const locale = JSON.parse(fs.readFileSync(localePath, 'utf-8'));

    const finalTable = Object.entries(finalMise).map(([id, mass]) => ({
        [orch.output_mapping.name_column]: locale[id] || id,
        [orch.output_mapping.value_column]: `${mass}g`,
        [orch.output_mapping.id_column]: id
    }));

    console.log(`\n--- PRODUCTION SHEET: ${locale[targetId] || targetId} ---`);
    console.log(`Target: ${targetMass}g | Hydration: ${hydration}%`);
    console.table(finalTable);

} catch (error) {
    console.error(`\n[ORCHESTRATION ERROR]: ${error.message}`);
    console.log(`Usage: bake <RecipeID> <Mass> (e.g., bake PROD_002 1200)\n`);
}