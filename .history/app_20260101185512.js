// app.js
import { GraphResolver } from './src/Graph/Core/Resolver.mjs';

async function boot() {
    // 1. QUERY: Get the SSOT (Definitions)
    const response = await fetch('./data/Store/Registry/definitions.json');
    const ssot = await response.json();

    // 2. FILTER: Find all bakeable products
    const products = Object.entries(ssot.inventory)
        .filter(([id, item]) => item.type === 'BRANCH');

    const listContainer = document.getElementById('product-list');
    listContainer.innerHTML = '';

    // 3. RENDER FILTER: Display results
    products.forEach(([id, item]) => {
        const div = document.createElement('div');
        div.className = 'recipe-card';
        div.innerText = id;
        div.onclick = () => showProcess(id, ssot);
        listContainer.appendChild(div);
    });
}

async function showProcess(id, ssot) {
    const output = document.getElementById('output');
    output.innerText = `Resolving ${id}...`;

    try {
        // 4. QUERY PROCESS: In the browser, we use the Resolver
        // NOTE: We will need a slightly modified Resolver for fetch()
        const resolver = new GraphResolver(ssot);
        const result = await resolver.resolve(id, 1000); 

        output.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
    } catch (err) {
        output.innerText = `Error: ${err.message}`;
    }
}

boot();