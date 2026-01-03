import { MediaHelper } from './MediaHelper.mjs';
import { MapSelection } from './Map.mjs';

export const Gallery = {
    selectedId: null,
    currentTerritory: 'ALL',

    render(ssot, locale) {
        const selector = document.getElementById('graphical-selector');
        if (selector) {
            selector.innerHTML = `
                <div class="selector-tabs">
                    <button class="tab-btn active" onclick="window.switchSelector('map')">MAP</button>
                    <button class="tab-btn" onclick="window.switchSelector('flavor')">FLAVOR</button>
                </div>
                <div id="view-map">${MapSelection.render()}</div>
            `;
        }
        this.filterByTerritory('ALL', ssot, locale);
    },

    filterByTerritory(territory, ssot, locale) {
        this.currentTerritory = territory;
        this.selectedId = null; // Reset selection on new filter
        const products = Object.entries(ssot.registry).filter(([id, data]) => {
            return data.type === 'BRANCH' && (territory === 'ALL' || data.classification?.territory === territory);
        });
        this.renderTiles(products, locale);
        this.updateButtonStates();
    },

renderTiles(products, locale) {
    const grid = document.getElementById('tile-grid');
    
    // An inline SVG so we never trigger a 404 network request
    const inlineFallback = `data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23111'/><path d='M30 70 L50 30 L70 70' stroke='%23333' stroke-width='2' fill='none'/></svg>`;

    grid.innerHTML = products.map(([id, data]) => {
        const name = locale[id] || id.replace('PROD_', '').replace(/_/g, ' ');
        // Logic-blind path from db
        const imgSrc = data.ui_features?.tile_photo || '';

        return `
            <div class="tile" data-id="${id}" onclick="Gallery.selectProduct('${id}')">
                <div class="tile-img-box">
                    <img src="${imgSrc}" 
                         onerror="this.onerror=null; this.src='${inlineFallback}';">
                </div>
                <div class="tile-label">
                    <strong>${name}</strong>
                </div>
            </div>`;
    }).join('');
}

    selectProduct(id) {
        this.selectedId = id;
        document.querySelectorAll('.tile').forEach(t => t.classList.toggle('selected', t.dataset.id === id));
        this.updateButtonStates();
    },

    updateButtonStates() {
        const nextBtn = document.querySelector('.btn-nav.primary');
        const backBtn = document.querySelector('.btn-nav:not(.primary)');

        if (nextBtn) nextBtn.disabled = !this.selectedId;
        if (backBtn) backBtn.disabled = (this.currentTerritory === 'ALL');
    }
};