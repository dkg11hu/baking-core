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

// Navigates from Gateway (Level 0) to Catalog (Level 1)
window.openBrowser = () => {
    document.getElementById('gateway-view').classList.add('hidden');
    document.getElementById('browser-view').classList.remove('hidden');
    // Ensure the Gallery renders into the now-visible container
    Gallery.render(State.ssot, State.locale);
};

window.changeStep = (delta) => {
    const isBrowser = !document.getElementById('browser-view').classList.contains('hidden');
    const discoveryRoot = document.getElementById('discovery-root');
    const executionRoot = document.getElementById('execution-root');

    if (isBrowser) {
        if (delta === 1 && Gallery.selectedId) {
            // TRANSITION TO WORKFLOW VIEW
            document.getElementById('browser-view').classList.add('hidden');
            document.getElementById('workflow-view').classList.remove('hidden');
            
            // Start Step -1 (Gateway)
            discoveryRoot.classList.remove('hidden');
            executionRoot.classList.add('hidden');
            WorkflowDiscovery.renderGateway(Gallery.selectedId, State.locale);
        }
    } else if (!executionRoot.classList.contains('hidden')) {
        // TRACK 2: Production Navigation
        WorkflowExecution.navigate(delta, State.locale);
    } else {
        // TRACK 1: Gateway and Params Navigation
        if (delta === 1) {
            if (WorkflowDiscovery.state === 'GATEWAY') {
                // Move from Choice to Params
                WorkflowDiscovery.init(Gallery.selectedId, State.ssot, State.locale);
            } else {
                // Move from Params to Production (LOCK)
                window.lockAndStart();
            }
        } else if (delta === -1) {
            // BACK from Gateway/Params returns to Browser
            location.reload(); 
        }
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