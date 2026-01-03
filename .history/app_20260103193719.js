import { State } from './src/UI/State.mjs';
import { StageManager } from './src/UI/StageManager.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { MapSelection } from './src/UI/MapSelection.mjs';
import { FlavorWheel } from './src/UI/FlavorWheel.mjs';
import { WorkflowDiscovery } from './src/UI/WorkflowDiscovery.mjs';
import { WorkflowExecution } from './src/UI/WorkflowExecution.mjs';

// --- EXPLICIT GLOBAL BRIDGES (THE FIX) ---
window.State = State;
window.Gallery = Gallery;
window.MapSelection = MapSelection;     // <--- ADD THIS
window.FlavorWheel = FlavorWheel;       // <--- ADD THIS
window.WorkflowDiscovery = WorkflowDiscovery;
window.WorkflowExecution = WorkflowExecution;
window.showStage = (id) => StageManager.show(id);

// --- NAVIGATION LOGIC ---

window.openSelectors = () => {
    window.showStage('selector-view');
    const map = document.getElementById('view-map');
    const flavor = document.getElementById('view-flavor');
    
    // Now these will work because window.MapSelection is defined
    if (map && !map.innerHTML) window.MapSelection.render();
    if (flavor && !flavor.innerHTML) {
        window.FlavorWheel.render();
        if (window.State.ssot) window.FlavorWheel.plotProducts(window.State.ssot, window.State.locale);
    }
};

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
        if (window.State.ssot) window.FlavorWheel.plotProducts(window.State.ssot, window.State.locale);
    }
};

window.filterByTerritory = (territory) => {
    window.showStage('browser-view');
    window.Gallery.filterByTerritory(territory, window.State.ssot, window.State.locale);
};

window.viewHistory = () => console.log("📜 History feature coming soon.");

window.changeStep = (delta) => {
    const isExecutionVisible = !document.getElementById('execution-view').classList.contains('hidden');
    if (isExecutionVisible) {
        const engine = window.WorkflowExecution;
        if (engine.currentStepIndex === 0 && delta === -1) {
            window.showStage('params-view');
            return;
        }
        const nextIndex = engine.currentStepIndex + delta;
        if (nextIndex >= 0 && nextIndex < engine.steps.length) {
            engine.navigate(delta, window.State.locale);
        }
    } else {
        if (window.WorkflowDiscovery.state === 'GATEWAY' && delta === 1) {
            window.WorkflowDiscovery.init(window.WorkflowDiscovery.activeId, window.State.ssot, window.State.locale);
        }
    }
};

window.restartApp = () => {
    window.showStage('gateway-view');
    window.WorkflowExecution.currentStepIndex = 0;
};

window.lockAndStart = () => {
    const manifest = window.WorkflowDiscovery.getLockedManifest();
    window.showStage('execution-view');
    window.WorkflowExecution.start(manifest, window.State.ssot, window.State.locale);
};

// --- BOOT ---
async function boot() {
    window.showStage('gateway-view');
    try {
        await window.State.init();
        console.log("✅ Baking Core: Ready");
    } catch (err) {
        console.error("❌ Init Failed:", err.message);
    }
}
boot();