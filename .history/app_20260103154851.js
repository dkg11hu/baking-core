import { State } from './src/UI/State.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { Driver } from './src/UI/Driver.mjs';
import { FlavorWheel } from './src/UI/FlavorWheel.mjs';
import { MapSelection } from './src/UI/MapSelection.mjs'; // Added missing import
import { WorkflowDiscovery } from './src/UI/WorkflowDiscovery.mjs';
import { WorkflowExecution } from './src/UI/WorkflowExecution.mjs';

// --- GLOBAL BRIDGES ---
window.showHelper = (e, label) => {
    const tooltip = document.getElementById('ui-tooltip');
    if (!tooltip) return;
    tooltip.innerText = label;
    tooltip.style.display = 'block';
    const frame = document.querySelector('.iphone-xs').getBoundingClientRect();
    tooltip.style.left = `${e.clientX - frame.left + 15}px`;
    tooltip.style.top = `${e.clientY - frame.top - 30}px`;
};

window.hideHelper = () => {
    const t = document.getElementById('ui-tooltip');
    if (t) t.style.display = 'none';
};

window.switchSelector = (viewId) => {
    const map = document.getElementById('view-map');
    const flavor = document.getElementById('view-flavor');
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewId);
    });
    if (map) map.style.display = viewId === 'map' ? 'block' : 'none';
    if (flavor) flavor.style.display = viewId === 'flavor' ? 'block' : 'none';
};

window.filterByTerritory = (territory) => Gallery.filterByTerritory(territory, State.ssot, State.locale);

window.changeStep = (delta) => {
    const isBrowser = !document.getElementById('browser-view').classList.contains('hidden');
    if (isBrowser) {
        if (delta === 1 && Gallery.selectedId) {
            Driver.start(Gallery.selectedId, State.ssot, State.locale);
            document.getElementById('browser-view').classList.add('hidden');
            document.getElementById('workflow-view').classList.remove('hidden');
        } else if (delta === -1) {
            Gallery.filterByTerritory('ALL', State.ssot, State.locale);
        }
    } else {
        Driver.move(delta, State.locale);
    }
};

window.Gallery = Gallery;

async function boot() {
    try {
        await State.init();
        
        const screen = document.querySelector('.screen-content');
        
        // 1. Initial Render
        Gallery.render(State.ssot, State.locale);

        // 2. Map Injection (Safe Check)
        const mapContainer = document.getElementById('view-map');
        if (mapContainer && typeof MapSelection !== 'undefined') {
            mapContainer.innerHTML = MapSelection.render();
        }

        // 3. Flavor Wheel Injection
        const flavorContainer = document.getElementById('view-flavor');
        if (flavorContainer) {
            flavorContainer.innerHTML = FlavorWheel.render();
            setTimeout(() => FlavorWheel.plotProducts(State.ssot, State.locale), 50);
        }

        // 4. Tooltip
        const tooltip = document.createElement('div');
        tooltip.id = 'ui-tooltip'; tooltip.className = 'ui-tooltip';
        screen.appendChild(tooltip);

        console.log("iPhone Driver: Systems Online.");
    } catch (err) { 
        console.error("Boot failed:", err); 
    }
}

boot();