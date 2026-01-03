export const FlavorWheel = {
    render() {
        const container = document.getElementById('view-flavor');
        if (!container) return;

        container.innerHTML = `
            <div class="flavor-matrix-container">
                <div class="matrix-labels">
                    <span class="label-y-axis">ACIDITY (pH)</span>
                    <span class="label-x-axis">SWEETNESS (Brix)</span>
                </div>
                <div id="flavor-plot" class="flavor-plot">
                    <div class="axis-x"></div>
                    <div class="axis-y"></div>
                    <div class="grid-line" style="top: 25%"></div>
                    <div class="grid-line" style="top: 75%"></div>
                    <div class="grid-line" style="left: 25%"></div>
                    <div class="grid-line" style="left: 75%"></div>
                </div>
                <div class="matrix-legend">
                    <div class="legend-item"><span class="dot-sample"></span> Product Node</div>
                </div>
            </div>`;
    },

    async plotProducts(ssot, locale) {
        const plot = document.getElementById('flavor-plot');
        if (!plot || !ssot || !ssot.registry) return;

        // Keep the grid lines, remove old dots
        const oldDots = plot.querySelectorAll('.flavor-dot');
        oldDots.forEach(d => d.remove());

        const products = Object.entries(ssot.registry).filter(([_, item]) => item.type === 'BRANCH');

        for (const [id, data] of products) {
            let formula = data.formula || null;

            // Fetch entity if formula is missing in registry
            if (!formula) {
                try {
                    const res = await fetch(`./data/Store/Entities/${id.toLowerCase()}.json`);
                    if (res.ok) {
                        const entity = await res.json();
                        formula = entity.formula;
                    }
                } catch (e) { /* silent fail */ }
            }

            // Calculate Coordinates with Safety Padding
            const coords = this.getCoords(id, formula, ssot);

            const dot = document.createElement('div');
            dot.className = 'flavor-dot';
            dot.style.left = `${coords.x}%`;   // Using % for responsive layout
            dot.style.bottom = `${coords.y}%`; // Bottom-up for Y axis

            // Interaction
            dot.onclick = (e) => {
                e.stopPropagation(); // Prevent clicking the background
                window.showStage('browser-view');
                window.Gallery.selectProduct(id);
            };

            // Tooltip for debugging
            dot.title = `${locale[id] || id} (x:${Math.round(coords.x)}, y:${Math.round(coords.y)})`;

            plot.appendChild(dot);
        }
    },

    getCoords(id, formula, ssot) {
        // 1. SCATTER FALLBACK: If no data, use the ID to generate a stable random position
        // This prevents all products from stacking on one dot.
        if (!formula) {
            const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const pseudoRandomX = (hash * 13 % 100) / 100;
            const pseudoRandomY = (hash * 7 % 100) / 100;
            
            // Map to "Safe Zone" (10% to 90%)
            return { 
                x: 10 + (pseudoRandomX * 80), 
                y: 10 + (pseudoRandomY * 80) 
            };
        }

        // 2. REAL CALCULATION
        let salt = 0, sugar = 0;
        formula.forEach(ing => {
            const mClass = ssot.registry[ing.id]?.material_class;
            if (mClass === 'SALTS') salt += ing.pct;
            if (mClass === 'SWEETENERS') sugar += ing.pct;
        });

        // 3. SAFE CLAMPING
        // We scale the values but clamp them between 5% and 95% 
        // so the dots never touch the absolute edge of the box.
        
        // Sugar: 0% to 15% maps to 0-1 range
        const rawX = Math.min(sugar / 0.15, 1);
        // Salt: 0% to 3% maps to 0-1 range
        const rawY = Math.min(salt / 0.03, 1);

        return { 
            x: 5 + (rawX * 90), // Maps 0->1 to 5%->95%
            y: 5 + (rawY * 90) 
        };
    }
};