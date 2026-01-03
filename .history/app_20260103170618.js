import { State } from './src/UI/State.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { MapSelection } from './src/UI/MapSelection.mjs';
import { FlavorWheel } from './src/UI/FlavorWheel.mjs';
import { WorkflowDiscovery } from './src/UI/WorkflowDiscovery.mjs';
import { WorkflowExecution } from './src/UI/WorkflowExecution.mjs';

window.Gallery = Gallery;

/**
 * Stage Manager: Unifies window isolation for Workflow #1 and #2.
 * Ensures the target view is visible, others are killed, and scroll is reset.
 */
const showStage = (stageId) => {
    const stages = ['gateway-view', 'browser-view', 'workflow-view'];
    stages.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (id === stageId) {
            el.classList.remove('hidden');
            el.scrollTop = 0; // Kills the "advance" glitch
        } else {
            el.classList.add('hidden');
        }
    });
};

window.lockAndStart = () => {
    const manifest = WorkflowDiscovery.getLockedManifest();
    
    // Internal Toggle within workflow-view
    document.getElementById('discovery-root').classList.add('hidden');
    const executionRoot = document.getElementById('execution-root');
    executionRoot.classList.remove('hidden');
    executionRoot.scrollTop = 0;

    WorkflowExecution.start(manifest, State.ssot, State.locale);
};

window.openBrowser = () => {
    showStage('browser-view');
    Gallery.render(State.ssot, State.locale);
};

window.changeStep = (delta) => {
    const isBrowser = !document.getElementById('browser-view').classList.contains('hidden');
    const isWorkflow = !document.getElementById('workflow-view').classList.contains('hidden');
    const discoveryRoot = document.getElementById('discovery-root');
    const executionRoot = document.getElementById('execution-root');

    if (isBrowser) {
        if (delta === 1 && Gallery.selectedId) {
            showStage('workflow-view');
            discoveryRoot.classList.remove('hidden');
            executionRoot.classList.add('hidden');
            WorkflowDiscovery.renderGateway(Gallery.selectedId, State.locale);
        } else if (delta === -1) {
            // BACK from Browser -> Gateway
            showStage('gateway-view');
        }
    } else if (isWorkflow) {
        if (!executionRoot.classList.contains('hidden')) {
            // TRACK 2: Execution
            WorkflowExecution.navigate(delta, State.locale);
        } else {
            // TRACK 1: Discovery
            if (delta === 1) {
                if (WorkflowDiscovery.state === 'GATEWAY') {
                    WorkflowDiscovery.init(Gallery.selectedId, State.ssot, State.locale);
                    discoveryRoot.scrollTop = 0;
                } else {
                    window.lockAndStart();
                }
            } else if (delta === -1) {
                // BACK from Workflow -> Browser
                showStage('browser-view');
            }
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
        showStage('gateway-view'); // Park at Level 0

        // Pre-render logic in background
        Gallery.render(State.ssot, State.locale);

        const mapContainer = document.getElementById('view-map');
        if (mapContainer) mapContainer.innerHTML = MapSelection.render();

        const flavorContainer = document.getElementById('view-flavor');
        if (flavorContainer) {
            flavorContainer.innerHTML = FlavorWheel.render();
            requestAnimationFrame(() => FlavorWheel.plotProducts(State.ssot, State.locale));
        }

        console.log("iPhone Driver: Parked at Gateway. System Isolated.");
    } catch (err) { 
        console.error("Boot failed:", err); 
    }
}
boot();