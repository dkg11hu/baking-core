import { Calculator } from '../Graph/Logic/Calculator.mjs';

export const FlavorWheel = {
    render() {
        return `
            <div class="flavor-matrix-container">
                <div class="matrix-labels">
                    <span class="label-y">SALTY</span>
                    <span class="label-x">SWEET</span>
                </div>
                <div id="flavor-plot" class="flavor-plot">
                    <div class="axis-x"></div>
                    <div class="axis-y"></div>
                </div>
                <div class="matrix-legend">Hover to identify, Tap to start</div>
            </div>
        `;
    },

    async plotProducts(ssot, locale) {
        const plot = document.getElementById('flavor-plot');
        const products = Object.entries(ssot.registry).filter(([_, item]) => item.type === 'BRANCH');

        // Reset the plot area but keep axes
        plot.innerHTML = '<div class="axis-x"></div><div class="axis-y"></div>';

        for (const [id, data] of products) {
            try {
                // NORMALIZATION: Map Uppercase ID to Lowercase filename
                const fileName = id.toLowerCase();
                const path = ssot.orchestration.paths.entities;
                const res = await fetch(`./data/Store/${path}/${fileName}.json`);
                
                if (!res.ok) continue;
                const entity = await res.json();
                
                const coords = this.calculateCoordinates(entity.formula, ssot);
                
                const dot = document.createElement('div');
                dot.className = 'flavor-dot';
                dot.style.left = `${coords.x * 100}%`;
                dot.style.bottom = `${coords.y * 100}%`;
                
                // HOVER HELPER INTEGRATION
                const displayName = locale[id] || id;
                dot.onmousemove = (e) => window.showHelper(e, displayName);
                dot.onmouseleave = () => window.hideHelper();
                
                // ACTION
                dot.onclick = () => {
                    window.hideHelper(); // Clean up tooltip on click
                    window.startWorkflow(id);
                };
                
                plot.appendChild(dot);
            } catch (err) {
                console.warn(`Could not plot product ${id}:`, err);
            }
        }
    },

    calculateCoordinates(formula, ssot) {
        let salt = 0, sugar = 0;
        formula.forEach(ing => {
            const cat = ssot.registry[ing.id]?.material_class;
            if (cat === 'SALTS') salt += ing.pct;
            if (cat === 'SWEETENERS') sugar += ing.pct;
        });

        // Normalized 0.0 to 1.0 for CSS percentages
        // Scaling: 15% sugar is "Max Sweet", 3% salt is "Max Salty"
        return {
            x: Math.min(sugar / 0.15, 1),
            y: Math.min(salt / 0.03, 1)
        };
    }
};