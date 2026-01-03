export const Gallery = {
    selectedId: null,

    filterByTerritory(territory, ssot, locale) {
        const grid = document.getElementById('tile-grid');
        if (!grid || !ssot?.registry) return;

        const products = Object.entries(ssot.registry).filter(([id, data]) => {
            const dbTerritory = data.classification?.territory;
            const isProduct = data.type === 'BRANCH';
            return isProduct && (territory === 'ALL' || dbTerritory === territory);
        });

        this.renderTiles(products, locale);
    },

    renderTiles(products, locale) {
        const grid = document.getElementById('tile-grid');
        grid.innerHTML = products.map(([id, data]) => {
            const name = locale[id] || id.replace('PROD_', '');
            const imgSrc = data.ui_features?.tile_photo || '';
            
            return `
                <div class="tile" onclick="window.Gallery.selectProduct('${id}')">
                    <div class="tile-img-box">
                        <img src="${imgSrc}" loading="lazy" onerror="this.style.opacity='0'">
                    </div>
                    <div class="tile-label"><strong>${name}</strong></div>
                </div>`;
        }).join('');
    },

    selectProduct(id) {
        this.selectedId = id;
        window.WorkflowDiscovery.renderGateway(id, window.State.locale);
        window.showStage('params-view');
    }
};