import { MapSelection } from './Map.mjs';

export const Gallery = {
    render(ssot, locale) {
        const header = document.querySelector('.sticky-header');
        // Inject the Map into the sticky header
        header.innerHTML += MapSelection.render();
        
        // Initial render of all products
        this.filterByTerritory('ALL', ssot, locale);
    },

    filterByTerritory(territory, ssot, locale) {
        const grid = document.getElementById('tile-grid');
        const label = document.getElementById('active-territory-label');
        
        // Update visual feedback on the Map
        document.querySelectorAll('.map-region').forEach(reg => {
            reg.classList.toggle('active', reg.id === territory);
        });
        label.innerText = territory === 'ALL' ? 'WORLDWIDE SELECTION' : territory;

        const items = Object.entries(ssot.registry).filter(([_, data]) => {
            if (data.type !== 'BRANCH') return false;
            return territory === 'ALL' || data.classification?.territory === territory;
        });

        this.renderTiles(items, locale);
    }
};