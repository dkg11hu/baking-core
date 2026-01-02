import { MapSelection } from './Map.mjs';
import { FlavorWheel } from './FlavorWheel.mjs';

export const Gallery = {
    async render(ssot, locale) {
        const header = document.querySelector('.sticky-header');
        
        // Toggle between Map and Flavor Wheel
        header.innerHTML = `
            <div class="ui-toggle">
                <button onclick="Gallery.view('MAP')">MAP</button>
                <button onclick="Gallery.view('FLAVOR')">TASTE</button>
            </div>
            <div id="graphical-selector"></div>
        `;

        this.view('MAP', ssot, locale);
    },

    async view(mode, ssot, locale) {
        const container = document.getElementById('graphical-selector');
        if (mode === 'MAP') {
            container.innerHTML = MapSelection.render();
            this.filter('ALL', ssot, locale);
        } else {
            container.innerHTML = FlavorWheel.render();
            await FlavorWheel.plotProducts(ssot, locale);
        }
    }
};