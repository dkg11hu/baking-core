export const FlavorWheel = {
    render() {
        const container = document.getElementById('view-flavor');
        if (!container) return;

        container.innerHTML = `
            <div class="flavor-grid-layout">
                <div class="axis-ticks y-ticks">
                    <span>3%</span>
                    <span>2%</span>
                    <span>1%</span>
                    <span>0%</span>
                </div>

                <div id="flavor-plot" class="flavor-plot">
                    <div class="quad q-tl"><span>SAVORY</span></div>
                    <div class="quad q-tr"><span>RICH</span></div>
                    <div class="quad q-bl"><span>LEAN</span></div>
                    <div class="quad q-br"><span>SWEET</span></div>

                    <div class="grid-line horizontal" style="top: 33.33%"></div>
                    <div class="grid-line horizontal" style="top: 66.66%"></div>
                    <div class="grid-line vertical" style="left: 33.33%"></div>
                    <div class="grid-line vertical" style="left: 66.66%"></div>
                    
                    <div class="axis-x"></div>
                    <div class="axis-y"></div>
                </div>

                <div></div>

                <div class="axis-ticks x-ticks">
                    <span>0%</span>
                    <span>5%</span>
                    <span>10%</span>
                    <span>15%</span>
                </div>

                <div class="info-footer">
                    <div class="matrix-labels">
                        <span>Y: SALINITY (SALT %)</span>
                        <span>X: SWEETNESS (SUGAR %)</span>
                    </div>
                     <div class="matrix-legend">
                        <div class="legend-item"><span class="dot-sample"></span> Tap node for details</div>
                        <div class="legend-explanation">
                            Plotting chemical composition: Sodium Chloride vs. Sucrose content relative to total flour weight.
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

            // Optional fetch for missing formula data
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
            dot.style.left = `calc(${coords.x}% - 2.5%)`;
            dot.style.bottom = `calc(${coords.y}% - 2.5%)`;

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
        // 1. JITTER ENGINE (Fallback for missing data)
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

        if (salt === 0 && sugar === 0) return this.generatePseudoRandomCoords(id);

        // 3. SCALING
        // X: Sugar 0-15% -> 0-1 range
        const rawX = Math.min(sugar / 0.15, 1);
        // Y: Salt 0-3% -> 0-1 range
        const rawY = Math.min(salt / 0.03, 1);

        return { 
            x: 5 + (rawX * 90), 
            y: 5 + (rawY * 90) 
        };
    },

    generatePseudoRandomCoords(id) {
        const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const x = 15 + (hash * 37 % 70); 
        const y = 15 + (hash * 19 % 70);
        return { x, y };
    }
};