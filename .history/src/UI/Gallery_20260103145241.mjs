import { MediaHelper } from './MediaHelper.mjs';
import { MapSelection } from './Map.mjs';

export const Gallery = {
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
        const products = Object.entries(ssot.registry).filter(([id, data]) => {
            return data.type === 'BRANCH' && (territory === 'ALL' || data.classification?.territory === territory);
        });
        this.renderTiles(products, locale);
    },

    renderTiles(products, locale) {
        const grid = document.getElementById('tile-grid');
        grid.innerHTML = products.map(([id, data]) => {
            const name = locale[id] || id;
            return `
                <div class="tile" onclick="window.startWorkflow('${id}')" 
                     onmousemove="window.showHelper(event, '${name}')" onmouseleave="window.hideHelper()">
                    <img src="${MediaHelper.safeImage(data.ui_features?.tile_photo, id)}" onerror="this.src='${MediaHelper.getFallbackSVG(id)}'">
                    <div class="tile-label"><strong>${name}</strong></div>
                </div>`;
        }).join('');
    },

selectProduct(id) {
        this.selectedId = id;
        
        // Visual feedback: highlight the tile
        document.querySelectorAll('.tile').forEach(t => t.classList.remove('selected'));
        document.querySelector(`[data-id="${id}"]`)?.classList.add('selected');
        
        this.updateButtonStates();
    },

    updateButtonStates() {
        const nextBtn = document.querySelector('.btn-nav.primary');
        const backBtn = document.querySelector('.btn-nav:not(.primary)');

        // NEXT is only lit if a product is selected
        if (nextBtn) {
            nextBtn.disabled = !this.selectedId;
        }

        // BACK is only lit if we are deep in a category (not on the International root)
        if (backBtn) {
            // Logic: if current territory is 'ALL', back is disabled
            backBtn.disabled = this.currentTerritory === 'ALL';
        }
    }

};