// app.js - Refined for Registry Key alignment
import { GraphResolver } from './src/Graph/Core/Resolver.mjs';
import { Calculator } from './src/Graph/Logic/Calculator.mjs';

let ssot, locale;

async function boot() {
    try {
        const [ssotRes, localeRes] = await Promise.all([
            fetch('./data/Store/Registry/definitions.json'),
            fetch('./data/Store/Locale/en.json')
        ]);

        if (!ssotRes.ok) throw new Error(`Definitions not found (Status: ${ssotRes.status})`);
        
        ssot = await ssotRes.json();
        locale = await localeRes.json();

        // Standardize the Database Access
        // We prioritize 'registry' as found in your definitions.json
        const db = ssot.registry || ssot.inventory;

        if (!db) {
            console.error("SSOT structure is invalid. Keys found:", Object.keys(ssot));
            throw new Error("Database Error: Neither 'registry' nor 'inventory' found in definitions.json");
        }

        const products = Object.entries(db)
            .filter(([_, item]) => item.type === 'BRANCH');

        const listContainer = document.getElementById('product-list');
        listContainer.innerHTML = products.map(([id]) => `
            <div class="recipe-card" onclick="runProcess('${id}')">
                <strong>${locale[id] || id}</strong><br>
                <small>${id}</small>
            </div>
        `).join('');

        console.log("Browser Dashboard Initialized.");

    } catch (err) {
        console.error("Boot failed:", err);
        document.getElementById('product-list').innerHTML = `<div style="color:#ff6666;"><b>Setup Error:</b> ${err.message}</div>`;
    }
}

window.runProcess = async (id) => {
    const output = document.getElementById('output');
    output.innerHTML = "<em>Querying Database...</em>";

    try {
        const resolver = new GraphResolver(ssot);
        const rawResults = await resolver.resolve(id, 1000);

        const sanitized = Calculator.sanitizeMiseEnPlace(rawResults, ssot);
        const finalMise = Calculator.reconcileTotal(sanitized, 1000);
        const hydration = Calculator.calculateHydration(rawResults, ssot);

        const orch = ssot.orchestration.output_mapping;
        
        let html = `<h2>${locale[id] || id}</h2>`;
        html += `<p><strong>Hydration:</strong> ${hydration}% | <strong>Target:</strong> 1000g</p>`;
        html += `<table style="width:100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr style="background: #333; text-align: left;">
                    <th style="padding: 10px;">${orch.name_column}</th>
                    <th style="padding: 10px;">${orch.value_column}</th>
                    <th style="padding: 10px;">${orch.id_column}</th>
                </tr>
            </thead>
            <tbody>`;

        for (const [mid, mass] of Object.entries(finalMise)) {
            html += `<tr style="border-bottom: 1px solid #444;">
                <td style="padding: 10px;">${locale[mid] || mid}</td>
                <td style="padding: 10px;">${mass}g</td>
                <td style="padding: 10px; color: #888;">${mid}</td>
            </tr>`;
        }

        html += `</tbody></table>`;
        output.innerHTML = html;

    } catch (err) {
        console.error("Resolution Error:", err);
        output.innerHTML = `<div style="color: #ff6666;"><b>Resolution Error:</b> ${err.message}</div>`;
    }
};

boot();