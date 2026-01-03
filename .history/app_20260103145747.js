import { State } from './src/UI/State.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { Driver } from './src/UI/Driver.mjs';
import { FlavorWheel } from './src/UI/FlavorWheel.mjs';

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
    tabs.forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewId));
    if (map) map.style.display = viewId === 'map' ? 'block' : 'none';
    if (flavor) flavor.style.display = viewId === 'flavor' ? 'block' : 'none';
};

window.filterByTerritory = (territory) => Gallery.filterByTerritory(territory, State.ssot, State.locale);
window.startWorkflow = (id) => { window.hideHelper(); Driver.start(id, State.ssot, State.locale); };

window.changeStep = (delta) => {
    // If we are on the browser view
    if (document.getElementById('workflow-view').classList.contains('hidden')) {
        if (delta === 1 && Gallery.selectedId) {
            // Selection is made, start the Gateway (Step 0)
            Driver.start(Gallery.selectedId, State.ssot, State.locale);
        } else if (delta === -1) {
            // Reset to International if they hit back from a territory
            Gallery.filterByTerritory('ALL', State.ssot, State.locale);
        }
    } else {
        // We are already inside the Workflow/Driver
        Driver.move(delta, State.locale);
    }
};

// Make Gallery globally accessible for the onclick events
window.Gallery = Gallery;

async function boot() {
    try {
        await State.init();
        
        // 1. Render Map Container first
        const screen = document.querySelector('.screen-content');
        Gallery.render(State.ssot, State.locale);

        // 2. Force Map Injection
        const mapContainer = document.getElementById('view-map');
        if (mapContainer) {
            mapContainer.innerHTML = MapSelection.render(); // Explicitly call Map render
        }

        // 3. Initialize Tooltip
        const tooltip = document.createElement('div');
        tooltip.id = 'ui-tooltip'; tooltip.className = 'ui-tooltip';
        screen.appendChild(tooltip);

        console.log("iPhone Driver: Map and Locale synchronized.");
    } catch (err) { console.error("Boot failed:", err); }
}

boot();