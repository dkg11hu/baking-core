export const FlavorWheel = {
    render() {
        return `
            <div class="flavor-matrix-container">
                <div class="matrix-labels"><span>SALTY</span><span>SWEET</span></div>
                <div id="flavor-plot" class="flavor-plot">
                    <div class="axis-x"></div><div class="axis-y"></div>
                </div>
                <div class="matrix-legend">Select a profile to filter catalog</div>
            </div>`;
    },

    async plotProducts(ssot, locale) {
        // 1. CRITICAL NULL GUARD
        if (!ssot || !ssot.registry) {
            console.error("FlavorWheel: State not ready.");
            return;
        }

        const plot = document.getElementById('flavor-plot');
        if (!plot) return;
        plot.innerHTML = '<div class="axis-x"></div><div class="axis-y"></div>'; // Clear previous dots

        const products = Object.entries(ssot.registry).filter(([_, item]) => item.type === 'BRANCH');

        for (const [id, data] of products) {
            try {
                // Ensure the path is correct: usually root/data/Store/...
                const res = await fetch(`./data/Store/Entities/${id.toLowerCase()}.json`);
                if (!res.ok) continue;
                
                const entity = await res.json();
                const coords = this.getCoords(entity.formula, ssot);
                
                const dot = document.createElement('div');
                dot.className = 'flavor-dot';
                dot.style.left = `${coords.x * 100}%`;
                dot.style.bottom = `${coords.y * 100}%`;
                
                // Use the bridge to advance to the Browser Results (Screen 2)
                dot.onclick = () => window.applyFilterAndAdvance(id);
                
                // Label for identification
                dot.title = locale[id] || id; 
                
                plot.appendChild(dot);
            } catch (e) { 
                console.warn(`Plot error for ${id}:`, e); 
            }
        }
    },

    getCoords(formula, ssot) {
        if (!formula) return { x: 0.5, y: 0.5 };
        let salt = 0, sugar = 0;
        formula.forEach(ing => {
            const mClass = ssot.registry[ing.id]?.material_class;
            if (mClass === 'SALTS') salt += ing.pct;
            if (mClass === 'SWEETENERS') sugar += ing.pct;
        });
        // Normalize: X = Sugar (up to 15%), Y = Salt (up to 3%)
        return { 
            x: Math.max(0, Math.min(sugar / 0.15, 0.95)), 
            y: Math.max(0, Math.min(salt / 0.03, 0.95)) 
        };
    }
};