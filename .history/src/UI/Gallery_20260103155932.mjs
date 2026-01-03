import { MediaHelper } from './MediaHelper.mjs';
import { MapSelection } from './Map.mjs';

export const Gallery = {
    render(ssot, locale) {
        const grid = document.getElementById('tile-grid');
        if (!grid) return;

        // Force a territory filter to start
        this.filterByTerritory('ALL', ssot, locale);
    },

    filterByTerritory(territory, ssot, locale) {
        const grid = document.getElementById('tile-grid');
        
        // Logic-blind filter: All products where type matches DB field 'BRANCH'
        const products = Object.entries(ssot.registry).filter(([id, data]) => {
            const isProduct = data.type === 'BRANCH';
            const matchesTerritory = (territory === 'ALL' || data.classification?.territory === territory);
            return isProduct && matchesTerritory;
        });

        if (products.length === 0) {
            grid.innerHTML = `<div class="empty-state">No products found in database for [${territory}]</div>`;
            return;
        }

        this.renderTiles(products, locale);
    }
};