import { MediaHelper } from './MediaHelper.mjs';
import { MapSelection } from './Map.mjs';

eexport const Gallery = {
    selectedId: null,
    currentTerritory: 'ALL',

    render(ssot, locale) {
        const selector = document.getElementById('graphical-selector');
        if (selector) {
            selector.innerHTML = `
                <div class="selector-tabs">
                    <button class="tab-btn active" data-view="map" onclick="window.switchSelector('map')">MAP</button>
                    <button class="tab-btn" data-view="flavor" onclick="window.switchSelector('flavor')">FLAVOR</button>
                </div>
                <div id="view-map">${MapSelection.render()}</div>
            `;
        }
        this.filterByTerritory('ALL', ssot, locale);
    },

    filterByTerritory(territory, ssot, locale) {
        this.currentTerritory = territory; // Set state for Back button logic
        this.selectedId = null; // Reset selection on filter change
        
        const products = Object.entries(ssot.registry).filter(([id, data]) => {
            return data.type === 'BRANCH' && (territory === 'ALL' || data.classification?.territory === territory);
        });
        this.renderTiles(products, locale);
        this.updateButtonStates();
    },

    renderTiles(products, locale) {
        const grid = document.getElementById('tile-grid');
        grid.innerHTML = products.map(([id, data]) => {
            const name = locale[id] || id;
            // FIX: Changed startWorkflow to selectProduct to enable the "Lit" button logic
            return `
                <div class="tile" data-id="${id}" onclick="Gallery.selectProduct('${id}')" 
                     onmousemove="window.showHelper(event, '${name}')" onmouseleave="window.hideHelper()">
                    <img src="${MediaHelper.safeImage(data.ui_features?.tile_photo, id)}" onerror="this.src='${MediaHelper.getFallbackSVG(id)}'">
                    <div class="tile-label"><strong>${name}</strong></div>
                </div>`;
        }).join('');
    },

    selectProduct(id) {
        this.selectedId = id;
        
        // Visual feedback
        document.querySelectorAll('.tile').forEach(t => t.classList.remove('selected'));
        const el = document.querySelector(`[data-id="${id}"]`);
        if (el) el.classList.add('selected');
        
        this.updateButtonStates();
    },

    updateButtonStates() {
        const nextBtn = document.querySelector('.btn-nav.primary');
        const backBtn = document.querySelector('.btn-nav:not(.primary)');

        if (nextBtn) {
            nextBtn.disabled = !this.selectedId;
        }

        if (backBtn) {
            // Back is unlit if we are at the top-level International view
            backBtn.disabled = this.currentTerritory === 'ALL';
        }
    }
};