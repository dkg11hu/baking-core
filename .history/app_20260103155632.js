import { State } from './src/UI/State.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { MapSelection } from './src/UI/MapSelection.mjs';
import { FlavorWheel } from './src/UI/FlavorWheel.mjs';
import { WorkflowDiscovery } from './src/UI/WorkflowDiscovery.mjs';
import { WorkflowExecution } from './src/UI/WorkflowExecution.mjs';

// --- GLOBAL BRIDGES ---

// Bridge for Workflow #1 to Workflow #2 Handoff
window.lockAndStart = () => {
    const manifest = WorkflowDiscovery.getLockedManifest();
    
    // UI Handoff: Ensure Discovery UI is cleared/hidden for Execution
    const discoveryRoot = document.getElementById('discovery-root');
    const executionRoot = document.getElementById('execution-root');
    if (discoveryRoot) discoveryRoot.classList.add('hidden');
    if (executionRoot) executionRoot.classList.remove('hidden');

    // Workflow #2: Start Locked Track
    WorkflowExecution.start(manifest, State.ssot, State.locale);
};

    window.changeStep = (delta) => {
        const isBrowser = !document.getElementById('browser-view').classList.contains('hidden');
        const discoveryRoot = document.getElementById('discovery-root');
        const executionRoot = document.getElementById('execution-root');

        if (isBrowser) {
            if (delta === 1 && Gallery.selectedId) {
                // TRANSITION TO TRACK 1
                document.getElementById('browser-view').classList.add('hidden');
                document.getElementById('workflow-view').classList.remove('hidden');
                
                // Ensure Discovery is visible and Execution is hidden
                discoveryRoot.classList.remove('hidden');
                executionRoot.classList.add('hidden');
                
                WorkflowDiscovery.init(Gallery.selectedId, State.ssot, State.locale);
            }
        } else if (!executionRoot.classList.contains('hidden')) {
            // TRACK 2: We are already executing
            WorkflowExecution.navigate(delta, State.locale);
        } else {
            // TRACK 1: We are in discovery, NEXT triggers the lock
            if (delta === 1) window.lockAndStart();
            if (delta === -1) location.reload(); 
        }
    };

// ... keep existing showHelper, hideHelper, switchSelector, filterByTerritory ...

async function boot() {
    try {
        await State.init();
        const screen = document.querySelector('.screen-content');
        
        Gallery.render(State.ssot, State.locale);

        const mapContainer = document.getElementById('view-map');
        if (mapContainer && typeof MapSelection !== 'undefined') {
            mapContainer.innerHTML = MapSelection.render();
        }

        const flavorContainer = document.getElementById('view-flavor');
        if (flavorContainer) {
            flavorContainer.innerHTML = FlavorWheel.render();
            setTimeout(() => FlavorWheel.plotProducts(State.ssot, State.locale), 50);
        }

        const tooltip = document.createElement('div');
        tooltip.id = 'ui-tooltip'; tooltip.className = 'ui-tooltip';
        screen.appendChild(tooltip);

        console.log("iPhone Driver: Dual-Track System Online.");
    } catch (err) { 
        console.error("Boot failed:", err); 
    }
}

boot();