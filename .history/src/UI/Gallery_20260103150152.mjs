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
    grid.innerHTML = products.map(([id, data]) => {
        // Look up the human-readable name
        const name = locale[id] || data.label || id.replace('PROD_', '').replace(/_/g, ' ');
        
        return `
            <div class="tile" data-id="${id}" onclick="window.Gallery.selectProduct('${id}')">
                <div class="tile-img-box">
                    <img src="assets/img/${id.toLowerCase()}.jpg" onerror="this.src='assets/placeholder.jpg'">
                </div>
                <div class="tile-label">
                    <strong>${name}</strong> </div>
            </div>`;
    }).join('');
},
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