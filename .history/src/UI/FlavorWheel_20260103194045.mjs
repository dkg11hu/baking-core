export const FlavorWheel = {
    render() {
        const container = document.getElementById('view-flavor');
        if (!container) return;

        // OLED OPTIMIZED LAYOUT
        container.innerHTML = `
            <div class="flavor-matrix-container">
                <div class="matrix-labels">
                    <span style="color: #666; font-size: 8px;">ACIDITY</span>
                    <span style="color: #666; font-size: 8px;">SWEETNESS</span>
                </div>
                <div id="flavor-plot" class="flavor-plot">
                    <div class="axis-x"></div>
                    <div class="axis-y"></div>
                </div>
                <div class="matrix-legend">Tap a gold node to view product</div>
            </div>`;
    },

    async plotProducts(ssot, locale) {
        const plot = document.getElementById('flavor-plot');
        if (!plot || !ssot || !ssot.registry) {
            console.warn("FlavorWheel: DOM or Data missing.");
            return;
        }

        // Clear previous dots, keep axis
        plot.innerHTML = '<div class="axis-x"></div><div class="axis-y"></div>';

        const products = Object.entries(ssot.registry).filter(([_, item]) => item.type === 'BRANCH');

        for (const [id, data] of products) {
            let formula = null;

            // STRATEGY: Try SSoT Registry first, then fetch Entity, then Fallback
            if (data.formula) {
                formula = data.formula;
            } else {
                try {
                    // Try to fetch individual file if SSoT doesn't have formula
                    const res = await fetch(`./data/Store/Entities/${id.toLowerCase()}.json`);
                    if (res.ok) {
                        const entity = await res.json();
                        formula = entity.formula;
                    }
                } catch (e) { /* Ignore fetch error */ }
            }

            // Calculate Coordinates (Default to center if no formula found)
            const coords = this.getCoords(formula, ssot);

            // Create OLED Dot
            const dot = document.createElement('div');
            dot.className = 'flavor-dot';
            dot.style.left = `${coords.x * 100}%`;
            dot.style.bottom = `${coords.y * 100}%`;
            
            // NAVIGATION BRIDGE: Go to Product Details
            dot.onclick = () => {
                // Switch to Browser View
                window.showStage('browser-view');
                // Select the product
                window.Gallery.selectProduct(id);
            };

            // Optional: Add label tooltip
            dot.title = locale[id] || id;

            plot.appendChild(dot);
        }
    },

    getCoords(formula, ssot) {
        if (!formula) {
            // Random scatter for visual demo if data is missing
            return { x: 0.2 + Math.random() * 0.6, y: 0.2 + Math.random() * 0.6 };
        }

        let salt = 0, sugar = 0;
        formula.forEach(ing => {
            // SSoT Lookup for material class
            const mClass = ssot.registry[ing.id]?.material_class;
            if (mClass === 'SALTS') salt += ing.pct;
            if (mClass === 'SWEETENERS') sugar += ing.pct;
        });

        // Normalize: X = Sugar (0-15%), Y = Salt (0-3%)
        return { 
            x: Math.max(0, Math.min(sugar / 0.15, 0.95)), 
            y: Math.max(0, Math.min(salt / 0.03, 0.95)) 
        };
    }
};