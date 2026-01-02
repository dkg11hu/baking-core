import { MapSelection } from './Map.mjs';

export const Gallery = {
    render(ssot, locale) {
        const selector = document.getElementById('graphical-selector');
        selector.innerHTML = MapSelection.render();
        
        // Initial load of all items
        this.filterByTerritory('ALL', ssot, locale);
    },

    filterByTerritory(territory, ssot, locale) {
        const grid = document.getElementById('tile-grid');
        const label = document.getElementById('active-territory-label');
        
        // Visual Feedback for Map Regions
        document.querySelectorAll('.map-region').forEach(reg => {
            reg.classList.toggle('active', reg.id === territory);
        });
        
        label.innerText = territory === 'ALL' ? 'WORLDWIDE SELECTION' : territory;

        // Filter registry items that match the territory
        const products = Object.entries(ssot.registry).filter(([id, data]) => {
            if (data.type !== 'BRANCH') return false;
            return territory === 'ALL' || data.classification?.territory === territory;
        });

        this.renderTiles(products, locale);
    },

    renderTiles(products, locale) {
        const grid = document.getElementById('tile-grid');
grid.innerHTML = products.map(([id, data]) => {
    // 1. Initial check using MediaHelper
    const imgUrl = MediaHelper.safeImage(data.ui_features?.tile_photo, id);
    const fallback = MediaHelper.getFallbackSVG(id);

    return `
        <div class="tile" onclick="window.startWorkflow('${id}')">
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