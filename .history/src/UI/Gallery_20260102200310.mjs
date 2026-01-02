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
    }
};