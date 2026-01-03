export const Gallery = {
    selectedId: null,

    render(ssot, locale) {
        const grid = document.getElementById('tile-grid');
        if (!grid) return;
        this.filterByTerritory('ALL', ssot, locale);
    },

    filterByTerritory(territory, ssot, locale) {
        const products = Object.entries(ssot.registry).filter(([id, data]) => {
            return data.type === 'BRANCH' && 
                   (territory === 'ALL' || data.classification?.territory === territory);
        });
        this.renderTiles(products, locale);
    },

    renderTiles(products, locale) {
        const grid = document.getElementById('tile-grid');
        grid.innerHTML = products.map(([id, data]) => {
            const name = locale[id] || id.replace('PROD_', '').replace(/_/g, ' ');
            const imgSrc = data.ui_features?.tile_photo || '';
            return `
                <div class="tile" onclick="window.Gallery.selectProduct('${id}')">
                    <div class="tile-img-box">
                        <img src="${imgSrc}" onerror="this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='">
                    </div>
                    <div class="tile-label"><strong>${name}</strong></div>
                </div>`;
        }).join('');
    },

    selectProduct(id) {
        this.selectedId = id;
        
        // 1. ADVANCE TO SCREEN 2
        if (window.showStage) {
            window.showStage('params-view');
        } else {
            console.error("Navigation Error: showStage not found on window.");
        }
        
        // 2. INITIALIZE TRACK 1 (Discovery)
        if (window.WorkflowDiscovery) {
            window.WorkflowDiscovery.init(id, window.State.ssot, window.State.locale);
        }
    }
};