// app.js - Full Series of Queries Logic
import { GraphResolver } from './src/Graph/Core/Resolver.mjs';
import { Calculator } from './src/Graph/Logic/Calculator.mjs';

let ssot, locale;

async function boot() {
    try {
        // 1. QUERY: SSOT and Locale
        const [ssotRes, localeRes] = await Promise.all([
            fetch('./data/Store/Registry/definitions.json'),
            fetch('./data/Store/Locale/en.json')
        ]);

        if (!ssotRes.ok) throw new Error(`Definitions not found (Status: ${ssotRes.status})`);
        
        ssot = await ssotRes.json();
        locale = await localeRes.json();

        // DEBUG: Check what the browser actually sees
        console.log("Database Loaded:", ssot);

        if (!ssot || !ssot.inventory) {
            console.error("SSOT structure is invalid. Keys found:", Object.keys(ssot || {}));
            throw new Error("Database Error: 'inventory' key missing in definitions.json");
        }

        const products = Object.entries(ssot.inventory)
            .filter(([_, item]) => item.type === 'BRANCH');

        const listContainer = document.getElementById('product-list');
        listContainer.innerHTML = products.map(([id]) => `
            <div class="recipe-card" onclick="runProcess('${id}')">
                <strong>${locale[id] || id}</strong><br>
                <small>${id}</small>
            </div>
        `).join('');

    } catch (err) {
        console.error("Boot failed:", err);
        document.getElementById('product-list').innerHTML = `<div style="color:#ff6666;"><b>Setup Error:</b> ${err.message}</div>`;
    }
}

window.runProcess = async (id) => {
    const output = document.getElementById('output');
    output.innerHTML = "<em>Querying Database...</em>";

    // 2. RESOLVE: Run the recursive JS series
    const resolver = new GraphResolver(ssot);
    const rawResults = await resolver.resolve(id, 1000);

    // 3. LOGIC: Math & Physics
    const sanitized = Calculator.sanitizeMiseEnPlace(rawResults, ssot);
    const finalMise = Calculator.reconcileTotal(sanitized, 1000);
    const hydration = Calculator.calculateHydration(rawResults, ssot);

    // 4. RENDER: Using database-driven fieldnames
    const orch = ssot.orchestration.output_mapping;
    
    let html = `<h4>${locale[id]}</h4>`;
    html += `<p>Total: 1000g | Hydration: ${hydration}%</p>`;
    html += `<table border="1" style="width:100%; border-collapse:collapse; text-align:left;">
        <thead>
            <tr style="background:#333;">
                <th>${orch.name_column}</th>
                <th>${orch.value_column}</th>
                <th>${orch.id_column}</th>
            </tr>
        </thead>
        <tbody>`;

    Object.entries(finalMise).forEach(([mid, mass]) => {
        html += `<tr>
            <td>${locale[mid] || mid}</td>
            <td>${mass}g</td>
            <td>${mid}</td>
        </tr>`;
    });

    html += `</tbody></table>`;
    output.innerHTML = html;
};

boot();