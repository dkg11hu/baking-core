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

// Bridge for the Choice Cards in Screen 3
window.viewHistory = () => {
    console.log("📜 Loading History from Database...");
    // Future: Implement history list rendering here
};

// --- SSoT NAVIGATION & RESTART ---

window.restartApp = () => {
    // Stage 0: Absolute Reset to Page 1
    window.showStage('gateway-view');
    window.WorkflowExecution.currentStepIndex = 0;
    console.log("🔄 System Restarted: SSoT State Cleared");
};

// --- WORKFLOW NAVIGATION BRIDGE ---

// --- WORKFLOW NAVIGATION ---

window.changeStep = (delta) => {
    const isExecutionVisible = !document.getElementById('execution-view').classList.contains('hidden');
    
    if (isExecutionVisible) {
        const engine = window.WorkflowExecution;

        // RULE: Return to Weight Adjustment (Stage 3) from Step 1
        if (engine.currentStepIndex === 0 && delta === -1) {
            window.showStage('params-view');
            return;
        }

        // RULE: Proceed regardless of video status
        const nextIndex = engine.currentStepIndex + delta;
        if (nextIndex >= 0 && nextIndex < engine.steps.length) {
            engine.navigate(delta, window.State.locale);
        }
    }
};

window.lockAndStart = () => {
    const manifest = WorkflowDiscovery.getLockedManifest();
    StageManager.show('execution-view');
    WorkflowExecution.start(manifest, State.ssot, State.locale);
};

// --- SELECTOR NAVIGATION ---
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

window.filterByTerritory = (territory) => {
    StageManager.show('browser-view');
    Gallery.filterByTerritory(territory, State.ssot, State.locale);
};

// --- BOOT ---
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