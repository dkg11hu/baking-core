import { MediaHelper } from './MediaHelper.mjs';
import { MapSelection } from './Map.mjs';
import { FlavorWheel } from './FlavorWheel.mjs'; // Unified to singular

export const Gallery = {
    render(ssot, locale) {
        const selector = document.getElementById('graphical-selector');
        if (selector) {
            // Render the Tab Switcher + Map + Flavor Wheel
            selector.innerHTML = `
                <div class="selector-tabs">
                    <button class="tab-btn active" data-view="map" onclick="window.switchSelector('map')">MAP</button>
                    <button class="tab-btn" data-view="flavor" onclick="window.switchSelector('flavor')">FLAVOR</button>
                </div>
                ${MapSelection.render()}
                <div id="view-flavor" class="selector-view">${FlavorWheel.render()}</div>
            `;
        }
        
        // Initial load of all items
        this.filterByTerritory('ALL', ssot, locale);
        
        // Plot the dots on the sensory matrix
        FlavorWheel.plotProducts(ssot, locale);
    },

    filterByTerritory(territory, ssot, locale) {
        // Visual feedback for Map
        document.querySelectorAll('.map-region').forEach(reg => {
            reg.classList.toggle('active', reg.id === territory);
        });

        const products = Object.entries(ssot.registry).filter(([id, data]) => {
            if (data.type !== 'BRANCH') return false;
            // Logic-Blind: Matching database fieldname
            return territory === 'ALL' || data.classification?.territory === territory;
        });

        this.renderTiles(products, locale);
    },

    renderTiles(products, locale) {
        const grid = document.getElementById('tile-grid');
        if (!grid) return;

        grid.innerHTML = products.map(([id, data]) => {
            const imgUrl = MediaHelper.safeImage(data.ui_features?.tile_photo, id);
            const fallback = MediaHelper.getFallbackSVG(id);

            return `
                <div class="tile" 
                     onclick="window.startWorkflow('${id}')"
                     onmousemove="window.showHelper(event, '${locale[id] || id}')"
                     onmouseleave="window.hideHelper()">
                    <img src="${imgUrl}" 
                         alt="${id}"
                         onerror="this.onerror=null; this.src='${fallback}';">
                    <div class="tile-label">
                        <strong>${locale[id] || id}</strong>
                    </div>
                </div>
            `;
        }).join('');
    }
};