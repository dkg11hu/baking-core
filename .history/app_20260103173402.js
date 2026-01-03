import { State } from './src/UI/State.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { MapSelection } from './src/UI/MapSelection.mjs';
import { FlavorWheel } from './src/UI/FlavorWheel.mjs';
import { WorkflowDiscovery } from './src/UI/WorkflowDiscovery.mjs';
import { WorkflowExecution } from './src/UI/WorkflowExecution.mjs';

// --- GLOBAL BRIDGE EXPORTS ---
window.State = State;
window.Gallery = Gallery;
window.WorkflowDiscovery = WorkflowDiscovery;
window.WorkflowExecution = WorkflowExecution;

/**
 * Unified Stage Manager
 * Strictly isolates each of the 5 screen sections.
 */
window.showStage = (stageId) => {
    const stages = ['gateway-view', 'selector-view', 'browser-view', 'params-view', 'execution-view'];
    stages.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (id === stageId) {
            el.classList.remove('hidden');
            el.scrollTop = 0;
        } else {
            el.classList.add('hidden');
        }
    });
};

// Transition: Gateway -> Selector (Map/Flavor)
window.openSelectors = () => {
    // 1. Immediate UI switch to the isolated stage
    window.showStage('selector-view');
    
    // 2. Data Guard: Ensure registry and locale are actually populated
    if (!State.ssot || !State.locale) {
        console.warn("Selectors: Data not ready, waiting...");
        return; 
    }

    // 3. Render into the visible container
    requestAnimationFrame(() => {
        const map = document.getElementById('view-map');
        const flavor = document.getElementById('view-flavor');

        // Map Injection
        if (map && !map.innerHTML) {
            map.innerHTML = MapSelection.render();
        }
        
        // Flavor Injection & Initial Plot
        if (flavor && !flavor.innerHTML) {
            flavor.innerHTML = FlavorWheel.render();
            // Plotting requires the container height/width to be > 0
            FlavorWheel.plotProducts(State.ssot, State.locale);
        }
    });
};
/**
 * THE AUTO-ADVANCE BRIDGE
 * Triggered by clicks on Map regions or Flavor nodes.
 * Advances from Screen 1 (Selectors) to Screen 2 (Tiles).
 */
window.applyFilterAndAdvance = (filterValue) => {
    window.showStage('browser-view');
    Gallery.filterByTerritory(filterValue, State.ssot, State.locale);
};

window.lockAndStart = () => {
    const manifest = WorkflowDiscovery.getLockedManifest();
    window.showStage('execution-view');
    WorkflowExecution.start(manifest, State.ssot, State.locale);
};

window.changeStep = (delta) => {
    const isExecution = !document.getElementById('execution-view').classList.contains('hidden');
    if (isExecution) {
        WorkflowExecution.navigate(delta, State.locale);
    }
};

window.switchSelector = (viewId) => {
    const map = document.getElementById('view-map');
    const flavor = document.getElementById('view-flavor');
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewId));

    if (viewId === 'map') {
        map.classList.remove('hidden');
        flavor.classList.add('hidden');
    } else {
        map.classList.add('hidden');
        flavor.classList.remove('hidden');
        FlavorWheel.plotProducts(State.ssot, State.locale);
    }
};

async function boot() {
    try {
        await State.init();
        window.showStage('gateway-view');
        console.log("iPhone Driver: 5-Stage Isolation Online.");
    } catch (err) {
        console.error("Boot failed:", err);
    }
}
boot();