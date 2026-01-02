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
                <div class="matrix-legend">Tap a zone to filter by taste</div>
            </div>
        `;
    },

    async plotProducts(ssot, locale) {
        const plot = document.getElementById('flavor-plot');
        const products = Object.entries(ssot.registry).filter(([_, item]) => item.type === 'BRANCH');

        plot.innerHTML = '<div class="axis-x"></div><div class="axis-y"></div>';

        for (const [id, data] of products) {
            // We resolve a standard 1000g batch to get the flavor ratio
            const res = await fetch(`${ssot.orchestration.paths.entities}/${id}.json`);
            const entity = await res.json();
            
            // Use the pure math logic from your Calculator
            const coords = this.calculateCoordinates(entity.formula, ssot);
            
            const dot = document.createElement('div');
            dot.className = 'flavor-dot';
            dot.style.left = `${coords.x * 100}%`;
            dot.style.bottom = `${coords.y * 100}%`;
            dot.setAttribute('data-id', id);
            dot.onclick = () => window.startWorkflow(id);
            
            // Small tooltip with the locale name
            dot.innerHTML = `<span class="dot-tip">${locale[id] || id}</span>`;
            plot.appendChild(dot);
        }
    },

    calculateCoordinates(formula, ssot) {
        let total = 0, salt = 0, sugar = 0;
        formula.forEach(ing => {
            const cat = ssot.registry[ing.id]?.material_class;
            if (cat === 'SALTS') salt += ing.pct;
            if (cat === 'SWEETENERS') sugar += ing.pct;
            total += ing.pct;
        });

        // Normalized 0.0 to 1.0 for CSS percentages
        return {
            x: Math.min(sugar / 0.15, 1), // Max sweet 15%
            y: Math.min(salt / 0.03, 1)    // Max salt 3%
        };
    }
};