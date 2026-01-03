export const FlavorWheel = {
    render() {
        const container = document.getElementById('view-flavor');
        if (!container) return;

        // DB Fieldnames
        const DB_FIELD_X = "SWEETNESS (SUGAR %)";
        const DB_FIELD_Y = "ACIDITY (pH LEVEL)";

        container.innerHTML = `
            <div class="flavor-grid-layout">
                <div class="y-axis-title">${DB_FIELD_Y}</div>

                <div class="axis-ticks y-ticks">
                    <span>3.0</span>
                    <span>4.0</span>
                    <span>5.0</span>
                    <span>6.0</span>
                </div>

                <div id="flavor-plot" class="flavor-plot">
                    <div class="quad q-tl"><span>SOUR & LEAN</span></div>
                    <div class="quad q-tr"><span>SOUR & SWEET</span></div>
                    <div class="quad q-bl"><span>NEUTRAL</span></div>
                    <div class="quad q-br"><span>SWEET</span></div>

                    <div class="grid-line horizontal" style="top: 33.33%"></div>
                    <div class="grid-line horizontal" style="top: 66.66%"></div>
                    <div class="grid-line vertical" style="left: 33.33%"></div>
                    <div class="grid-line vertical" style="left: 66.66%"></div>
                    
                    <div class="axis-x"></div>
                    <div class="axis-y"></div>
                </div>

                <div></div> 
                <div></div>

                <div class="axis-ticks x-ticks">
                    <span>0%</span>
                    <span>5%</span>
                    <span>10%</span>
                    <span>15%</span>
                </div>

                <div></div>
                <div></div>
                <div class="x-axis-title">${DB_FIELD_X}</div>

                <div class="info-footer">
                    <div class="matrix-legend">
                        <div class="legend-item"><span class="dot-sample"></span> Tap node for details</div>
                        <div class="legend-explanation">
                            Plotting estimated pH (Acidity) vs. Sucrose content. Lower pH = Higher Acidity.
                        </div>
                    </div>
                </div>
            </div>`;
    },

    async plotProducts(ssot, locale) {
        const plot = document.getElementById('flavor-plot');
        if (!plot || !ssot || !ssot.registry) return;

        const oldDots = plot.querySelectorAll('.flavor-dot');
        oldDots.forEach(d => d.remove());

        const products = Object.entries(ssot.registry).filter(([_, item]) => item.type === 'BRANCH');

        for (const [id, data] of products) {
            let formula = data.formula || null;
            if (!formula || formula.length === 0) {
                try {
                    const res = await fetch(`./data/Store/Entities/${id.toLowerCase()}.json`);
                    if (res.ok) {
                        const entity = await res.json();
                        formula = entity.formula;
                    }
                } catch (e) { /* silent fail */ }
            }

            const coords = this.getCoords(id, formula, ssot);
            const dot = document.createElement('div');
            dot.className = 'flavor-dot';
            dot.style.left = `calc(${coords.x}% - 10px)`;
            dot.style.bottom = `calc(${coords.y}% - 10px)`;
            dot.onclick = (e) => {
                e.stopPropagation();
                window.showStage('browser-view');
                window.Gallery.selectProduct(id);
            };
            dot.title = locale[id] || id;
            plot.appendChild(dot);
        }
    },

    getCoords(id, formula, ssot) {
        if (!formula || formula.length === 0) return this.generatePseudoRandomCoords(id);
        let acidity = 0, sugar = 0;
        formula.forEach(ing => {
            const mClass = ssot.registry[ing.id]?.material_class;
            if (mClass === 'PREFERMENTS') acidity += ing.pct;
            if (mClass === 'ACIDITY_REGULATORS') acidity += (ing.pct * 5); 
            if (mClass === 'SWEETENERS') sugar += ing.pct;
        });
        const rawX = Math.min(sugar / 0.15, 1);
        const estimatedPH = 6.0 - (Math.min(acidity, 0.5) * 5); 
        const rawY = Math.max(0, Math.min((6.0 - estimatedPH) / 3.0, 1));
        return { x: 5 + (rawX * 90), y: 5 + (rawY * 90) };
    },

    generatePseudoRandomCoords(id) {
        const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return { x: 15 + (hash * 37 % 70), y: 15 + (hash * 19 % 70) };
    }
};