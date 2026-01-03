export const FlavorWheel = {
    render() {
        const container = document.getElementById('view-flavor');
        if (!container) return;

        // Note: Added explicit height style to container div to prevent collapse
        container.innerHTML = `
            <div class="flavor-matrix-container">
                <div class="matrix-labels">
                    <span class="label-y-axis">ACIDITY (pH)</span>
                    <span class="label-x-axis">SWEETNESS (Brix)</span>
                </div>
                <div id="flavor-plot" class="flavor-plot">
                    <div class="axis-x"></div>
                    <div class="axis-y"></div>
                    <div class="grid-line horizontal" style="top: 33%"></div>
                    <div class="grid-line horizontal" style="top: 66%"></div>
                    <div class="grid-line vertical" style="left: 33%"></div>
                    <div class="grid-line vertical" style="left: 66%"></div>
                </div>
                <div class="matrix-legend">
                    <div class="legend-item"><span class="dot-sample"></span> Tap a node to view details</div>
                </div>
            </div>`;
    },

    async plotProducts(ssot, locale) {
        const plot = document.getElementById('flavor-plot');
        if (!plot || !ssot || !ssot.registry) return;

        // Clear old dots, keep grid structure (indices 0-5)
        // Safer approach: Remove only elements with class 'flavor-dot'
        const oldDots = plot.querySelectorAll('.flavor-dot');
        oldDots.forEach(d => d.remove());

        const products = Object.entries(ssot.registry).filter(([_, item]) => item.type === 'BRANCH');

        for (const [id, data] of products) {
            let formula = data.formula || null;

            // Optional: Fetch entity if formula is missing
            if (!formula || formula.length === 0) {
                try {
                    const res = await fetch(`./data/Store/Entities/${id.toLowerCase()}.json`);
                    if (res.ok) {
                        const entity = await res.json();
                        formula = entity.formula;
                    }
                } catch (e) { /* silent fail */ }
            }

            // Calculate Coordinates with Scatter Fallback
            const coords = this.getCoords(id, formula, ssot);

            const dot = document.createElement('div');
            dot.className = 'flavor-dot';
            dot.style.left = `${coords.x}%`;
            dot.style.bottom = `${coords.y}%`;

            // Interaction
            dot.onclick = (e) => {
                e.stopPropagation(); 
                window.showStage('browser-view');
                window.Gallery.selectProduct(id);
            };

            // Debug Tooltip
            dot.title = locale[id] || id;

            plot.appendChild(dot);
        }
    },

    getCoords(id, formula, ssot) {
        // 1. SCATTER ENGINE
        // If no formula, or formula is empty, generate a unique position based on the ID string.
        // This ensures they don't stack on top of each other.
        if (!formula || formula.length === 0) {
            return this.generatePseudoRandomCoords(id);
        }

        // 2. REAL CALCULATION
        let salt = 0, sugar = 0;
        formula.forEach(ing => {
            const mClass = ssot.registry[ing.id]?.material_class;
            if (mClass === 'SALTS') salt += ing.pct;
            if (mClass === 'SWEETENERS') sugar += ing.pct;
        });

        // If result is 0,0 (e.g. flour+water only), still scatter it so it's visible
        if (salt === 0 && sugar === 0) {
            return this.generatePseudoRandomCoords(id);
        }

        // 3. SAFE CLAMPING (5% to 95%)
        // Sugar: 0% to 15% maps to 0-1 range
        const rawX = Math.min(sugar / 0.15, 1);
        // Salt: 0% to 3% maps to 0-1 range
        const rawY = Math.min(salt / 0.03, 1);

        return { 
            x: 5 + (rawX * 90), 
            y: 5 + (rawY * 90) 
        };
    },

    generatePseudoRandomCoords(id) {
        // Create a numeric hash from the Product ID string
        const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        // Use hash to place dot between 15% and 85% (Center-ish)
        // Multipliers 37 and 19 create variance between X and Y
        const x = 15 + (hash * 37 % 70); 
        const y = 15 + (hash * 19 % 70);
        return { x, y };
    }
};