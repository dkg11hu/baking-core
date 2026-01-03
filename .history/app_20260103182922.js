import { State } from './src/UI/State.mjs';
import { StageManager } from './src/UI/StageManager.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { MapSelection } from './src/UI/MapSelection.mjs';
import { FlavorWheel } from './src/UI/FlavorWheel.mjs';
import { WorkflowDiscovery } from './src/UI/WorkflowDiscovery.mjs';
import { WorkflowExecution } from './src/UI/WorkflowExecution.mjs';

// --- EXPLICIT GLOBAL BRIDGES ---
window.State = State;
window.Gallery = Gallery;
window.WorkflowDiscovery = WorkflowDiscovery;
window.WorkflowExecution = WorkflowExecution;
window.showStage = (id) => StageManager.show(id);

// Switcher: Map vs Flavor Wheel
window.switchSelector = (viewId) => {
    const map = document.getElementById('view-map');
    const flavor = document.getElementById('view-flavor');
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewId));

    if (viewId === 'map') {
        map?.classList.remove('hidden');
        flavor?.classList.add('hidden');
    } else {
        map?.classList.add('hidden');
        flavor?.classList.remove('hidden');
        if (State.ssot) FlavorWheel.plotProducts(State.ssot, State.locale);
    }
};

// Gateway -> Selector
window.openSelectors = () => {
    StageManager.show('selector-view');
    const map = document.getElementById('view-map');
    const flavor = document.getElementById('view-flavor');

    if (map && !map.innerHTML) map.innerHTML = MapSelection.render();
    if (flavor && !flavor.innerHTML) {
        flavor.innerHTML = FlavorWheel.render();
        if (State.ssot) FlavorWheel.plotProducts(State.ssot, State.locale);
    }
};

// Map SVG Bridge
window.filterByTerritory = (territory) => {
    StageManager.show('browser-view');
    Gallery.filterByTerritory(territory, State.ssot, State.locale);
};

// Track 1 Progressions
window.changeStep = (dir) => {
    if (WorkflowDiscovery.state === 'GATEWAY') {
        WorkflowDiscovery.init(WorkflowDiscovery.activeId, State.ssot, State.locale);
    }
};

window.lockAndStart = () => {
    const manifest = WorkflowDiscovery.getLockedManifest();
    StageManager.show('execution-view');
    WorkflowExecution.start(manifest, State.ssot, State.locale);
};

// --- BOOT SEQUENCE ---
async function boot() {
    StageManager.show('gateway-view');
    try {
        await State.init();
        console.log("✅ Baking Core: Ready");
    } catch (err) {
        console.error("❌ Data Init Failed:", err.message);
    }
}
boot();