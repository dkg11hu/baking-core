// app.js
import { GraphResolver } from './src/Graph/Core/Resolver.mjs';
import { Calculator } from './src/Graph/Logic/Calculator.mjs'; // FIXED: Crucial import

let ssot, locale;

async function boot() {
    try {
        const [ssotRes, localeRes] = await Promise.all([
            fetch('./data/Store/Registry/definitions.json'),
            fetch('./data/Store/Locale/en.json')
        ]);

        if (!ssotRes.ok || !localeRes.ok) throw new Error("Database files not found.");

        ssot = await ssotRes.json();
        locale = await localeRes.json();

        const db = ssot.registry || ssot.inventory;
        const products = Object.entries(db).filter(([_, item]) => item.type === 'BRANCH');

        const listContainer = document.getElementById('product-list');
        listContainer.innerHTML = products.map(([id]) => `
            <div class="recipe-card" onclick="runProcess('${id}')">
                <strong>${locale[id] || id}</strong><br>
                <small>${id}</small>
            </div>
        `).join('');

        console.log("Database initialized successfully.");
    } catch (err) {
        console.error("Boot failed:", err);
    }
}

function renderHierarchy(node, locale) {
    const name = locale[node.id] || node.id;
    const isBranch = node.type === 'BRANCH';
    
    let html = `<li>
        <div class="node-item ${node.type.toLowerCase()}">
            <span class="name">${name}</span>
            <span class="mass">${node.mass.toFixed(1)}g</span>
        </div>`;

    if (isBranch && node.children) {
        html += `<ul>`;
        for (const child of node.children) {
            html += renderHierarchy(child, locale);
        }
        html += `</ul>`;
    }
    
    html += `</li>`;
    return html;
}

window.runProcess = async (id) => {
    const output = document.getElementById('output');
    output.innerHTML = "<em>Calculating and Scaling...</em>";

    try {
        const resolver = new GraphResolver(ssot);
        
        // 1. Execute queries
        const [hierarchy, rawFlatTotals] = await Promise.all([
            resolver.resolveHierarchy(id, 1000),
            resolver.resolve(id, 1000)
        ]);

        // 2. USE CALCULATOR: Apply rounding rules from definitions.json
        // Ensure Calculator.mjs uses 'export class Calculator'
        const sanitizedTotals = Calculator.sanitizeMiseEnPlace(rawFlatTotals, ssot);
        const finalTotals = Calculator.reconcileTotal(sanitizedTotals, 1000);

        // 3. RENDER UI
        let html = `<h3>Production Process: ${locale[id] || id}</h3>`;
        html += `<div class="hierarchy-container">
                    <ul class="tree-root">${renderHierarchy(hierarchy, locale)}</ul>
                 </div>`;

        html += `<div class="cumulative-summary">
                    <h3>Total Requisition (Mise en Place)</h3>
                    <table>
                        <thead><tr><th>Material</th><th>Total Mass</th></tr></thead>
                        <tbody>`;

        for (const [mid, mass] of Object.entries(finalTotals)) {
            html += `<tr>
                        <td>${locale[mid] || mid}</td>
                        <td class="mass">${mass}g</td>
                     </tr>`;
        }

        html += `</tbody></table></div>`;
        output.innerHTML = html;

    } catch (err) {
        console.error("Resolution Error:", err);
        output.innerHTML = `<div style="color:#ff6666">Error: ${err.message}</div>`;
    }
};

boot();