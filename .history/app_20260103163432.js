import { State } from './src/UI/State.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { MapSelection } from './src/UI/MapSelection.mjs';
import { FlavorWheel } from './src/UI/FlavorWheel.mjs';
import { WorkflowDiscovery } from './src/UI/WorkflowDiscovery.mjs';
import { WorkflowExecution } from './src/UI/WorkflowExecution.mjs';

// --- EXPOSE TO GLOBAL SCOPE ---
window.Gallery = Gallery;

// --- GLOBAL BRIDGES ---

window.lockAndStart = () => {
    const manifest = WorkflowDiscovery.getLockedManifest();
    document.getElementById('discovery-root').classList.add('hidden');
    document.getElementById('execution-root').classList.remove('hidden');
    WorkflowExecution.start(manifest, State.ssot, State.locale);
};

window.changeStep = (delta) => {
    const isBrowser = !document.getElementById('browser-view').classList.contains('hidden');
    const isExecution = WorkflowExecution.steps.length > 0;

    if (isBrowser) {
        if (delta === 1 && Gallery.selectedId) {
            document.getElementById('browser-view').classList.add('hidden');
            document.getElementById('workflow-view').classList.remove('hidden');
            WorkflowDiscovery.init(Gallery.selectedId, State.ssot, State.locale);
        } else if (delta === -1) {
            Gallery.filterByTerritory('ALL', State.ssot, State.locale);
        }
    } else if (isExecution) {
        WorkflowExecution.navigate(delta, State.locale);
    } else {
        if (delta === 1) window.lockAndStart();
        if (delta === -1) location.reload();
    }
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

async function boot() {
    try {
        await State.init();
        
        // Sanitize Initial View
        document.getElementById('browser-view').classList.remove('hidden');
        document.getElementById('workflow-view').classList.add('hidden');

        Gallery.render(State.ssot, State.locale);

        const mapContainer = document.getElementById('view-map');
        if (mapContainer) mapContainer.innerHTML = MapSelection.render();

        const flavorContainer = document.getElementById('view-flavor');
        if (flavorContainer) {
            flavorContainer.innerHTML = FlavorWheel.render();
            requestAnimationFrame(() => FlavorWheel.plotProducts(State.ssot, State.locale));
        }

        console.log("iPhone Driver: Dual-Track System Online.");
    } catch (err) { 
        console.error("Boot failed:", err); 
    }
}

boot();