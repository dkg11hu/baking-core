// app.js
import { GraphResolver } from './src/Graph/Core/Resolver.mjs';

async function onProductSelected(productId, mass) {
    // Pass the already-fetched SSOT to avoid redundant queries
    const resolver = new GraphResolver(ssot); 
    
    // Trigger the recursive series of JS queries
    const results = await resolver.resolve(productId, mass);
    
    console.log("Process Resolved:", results);
    renderTable(results);
}