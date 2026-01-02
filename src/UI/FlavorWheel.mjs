export const FlavorWheel = {
    render() {
        return `
            <div class="flavor-matrix-container">
                <div class="matrix-labels"><span>SALTY</span><span>SWEET</span></div>
                <div id="flavor-plot" class="flavor-plot">
                    <div class="axis-x"></div><div class="axis-y"></div>
                </div>
                <div class="matrix-legend">Hover to identify • Tap to start</div>
            </div>`;
    },

    async plotProducts(ssot, locale) {
        const plot = document.getElementById('flavor-plot');
        const products = Object.entries(ssot.registry).filter(([_, item]) => item.type === 'BRANCH');

        for (const [id, data] of products) {
            try {
                const res = await fetch(`./data/Store/Entities/${id.toLowerCase()}.json`);
                if (!res.ok) continue;
                const entity = await res.json();
                
                const coords = this.getCoords(entity.formula, ssot);
                const dot = document.createElement('div');
                dot.className = 'flavor-dot';
                dot.style.left = `${coords.x * 100}%`;
                dot.style.bottom = `${coords.y * 100}%`;
                
                dot.onmousemove = (e) => window.showHelper(e, locale[id] || id);
                dot.onmouseleave = window.hideHelper;
                dot.onclick = () => window.startWorkflow(id);
                plot.appendChild(dot);
            } catch (e) { console.warn("Plot error", e); }
        }
    },

    getCoords(formula, ssot) {
        let salt = 0, sugar = 0;
        formula.forEach(ing => {
            const mClass = ssot.registry[ing.id]?.material_class;
            if (mClass === 'SALTS') salt += ing.pct;
            if (mClass === 'SWEETENERS') sugar += ing.pct;
        });
        return { x: Math.min(sugar / 0.15, 1), y: Math.min(salt / 0.03, 1) };
    }
};