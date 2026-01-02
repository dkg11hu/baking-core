import { Calculator } from '../Graph/Logic/Calculator.mjs';

export const FlavorWheel = {
    render() {
        return `
            <div class="flavor-matrix-container" id="view-flavor">
                <div class="matrix-labels">
                    <span class="label-y">SALTY</span>
                    <span class="label-x">SWEET</span>
                </div>
                <div id="flavor-plot" class="flavor-plot">
                    <div class="axis-x"></div>
                    <div class="axis-y"></div>
                </div>
                <div class="matrix-legend">Hover to identify • Tap to start</div>
            </div>
        `;
    },

    async plotProducts(ssot, locale) {
        const plot = document.getElementById('flavor-plot');
        if (!plot) return;

        const products = Object.entries(ssot.registry).filter(([_, item]) => item.type === 'BRANCH');

        // Reset the plot area while keeping the axis lines
        plot.innerHTML = '<div class="axis-x"></div><div class="axis-y"></div>';

        for (const [id, data] of products) {
            try {
                /** * NORMALIZATION: 
                 * Database ID (PROD_YUDANE) -> lower-case filename (prod_yudane.json)
                 */
                const fileName = id.toLowerCase();
                const path = ssot.orchestration.paths.entities;
                const res = await fetch(`./data/Store/${path}/${fileName}.json`);
                
                if (!res.ok) continue;
                const entity = await res.json();
                
                const coords = this.calculateCoordinates(entity.formula, ssot);
                const displayName = locale[id] || id;

                const dot = document.createElement('div');
                dot.className = 'flavor-dot';
                dot.style.left = `${coords.x * 100}%`;
                dot.style.bottom = `${coords.y * 100}%`;
                
                // HOVER HELPER INTEGRATION
                dot.onmousemove = (e) => window.showHelper(e, displayName);
                dot.onmouseleave = () => window.hideHelper();
                
                // SELECTION ACTION
                dot.onclick = () => {
                    window.hideHelper(); // Clear tooltip on transition
                    window.startWorkflow(id);
                };
                
                plot.appendChild(dot);
            } catch (err) {
                console.warn(`[Sensory Mapping] Failed to plot ${id}:`, err);
            }
        }
    },

    calculateCoordinates(formula, ssot) {
        let salt = 0, sugar = 0;

        formula.forEach(ing => {
            const material = ssot.registry[ing.id];
            // Logic-Blind: checking fieldname from Database
            if (material?.material_class === 'SALTS') salt += ing.pct;
            if (material?.material_class === 'SWEETENERS') sugar += ing.pct;
        });

        // SCALE: Normalizing to UI percentages
        // Max sweet assumed at 15% (0.15), Max salt at 3% (0.03)
        return {
            x: Math.min(sugar / 0.15, 1),
            y: Math.min(salt / 0.03, 1)
        };
    }
};