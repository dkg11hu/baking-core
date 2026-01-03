export const Gallery = {
    selectedId: null,

    render(ssot, locale) {
        const grid = document.getElementById('tile-grid');
        if (!grid) return;
        this.filterByTerritory('ALL', ssot, locale);
    },

    filterByTerritory(territory, ssot, locale) {
        const products = Object.entries(ssot.registry).filter(([id, data]) => {
            const isBranch = data.type === 'BRANCH';
            const matchesMap = (territory === 'ALL' || data.classification?.territory === territory);
            return isBranch && matchesMap;
        });

        this.renderTiles(products, locale);
    },

    renderTiles(products, locale) {
        const grid = document.getElementById('tile-grid');
        if (!grid) return;
        
        const emptyState = `data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%230a0a0a'/><path d='M30 70 L50 30 L70 70' stroke='%23222' stroke-width='2' fill='none'/></svg>`;

        grid.innerHTML = products.map(([id, data]) => {
            const name = locale[id] || id.replace('PROD_', '').replace(/_/g, ' ');
            const imgSrc = data.ui_features?.tile_photo || '';
            const isActive = this.selectedId === id ? 'active' : '';

            // Use window.Gallery to ensure the global bridge works
            return `
                <div class="tile ${isActive}" data-id="${id}" onclick="window.Gallery.selectProduct('${id}')">
                    <div class="tile-img-box">
                        <img src="${imgSrc}" onerror="this.onerror=null; this.src='${emptyState}';">
                    </div>
                    <div class="tile-label">
                        <strong>${name}</strong>
                    </div>
                </div>`;
        }).join('');
    },

    selectProduct(id) {
        this.selectedId = id;
        
        // Update UI state
        document.querySelectorAll('.tile').forEach(t => {
            t.classList.toggle('active', t.dataset.id === id);
        });

        // Enable NEXT button
        const nextBtn = document.querySelector('.btn-nav.primary');
        if (nextBtn) nextBtn.disabled = false;
        
        console.log(`Gallery: Selected ${id}`);
    }
};