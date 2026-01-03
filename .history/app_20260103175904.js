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
 * This is what the Map and Flavor wheel must call.
 */
window.applyFilterAndAdvance = (filterValue) => {
    // 1. Advance from Selector Screen (1) to Browser Screen (2)
    window.showStage('browser-view');
    
    // 2. Filter the tiles
    // Note: Fieldnames come from the database (classification.territory)
    window.Gallery.filterByTerritory(filterValue, window.State.ssot, window.State.locale);
};

// For backward compatibility with your SVG if you don't want to edit the SVG file:
window.filterByTerritory = window.applyFilterAndAdvance;

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

    // 1. Update Tab UI Active State
    tabs.forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewId));

    // 2. Toggle internal visibility
    if (viewId === 'map') {
        map.classList.remove('hidden');
        flavor.classList.add('hidden');
    } else {
        map.classList.add('hidden');
        flavor.classList.remove('hidden');
        
        // 3. Re-plot Flavor nodes as they require a visible container for coordinates
        if (window.FlavorWheel) {
            window.FlavorWheel.plotProducts(window.State.ssot, window.State.locale);
        }
    }
};
// app.js
async function boot() {
    // 1. Force the UI to show the first stage immediately
    window.showStage('gateway-view');

    try {
        // 2. Load the data (from the deep paths we found)
        await State.init();
        
        if (State.isInitialized) {
            console.log("✅ Baking Core: SSoT and Locale Synced.");
        }
    } catch (err) {
        console.error("❌ Data Sync Failed:", err.message);
    }
}
boot();