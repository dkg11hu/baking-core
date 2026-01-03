import { State } from './src/UI/State.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { MapSelection } from './src/UI/MapSelection.mjs';
import { FlavorWheel } from './src/UI/FlavorWheel.mjs';
import { WorkflowDiscovery } from './src/UI/WorkflowDiscovery.mjs';
import { WorkflowExecution } from './src/UI/WorkflowExecution.mjs';

// --- GLOBAL BRIDGE EXPORTS ---
// These allow HTML onclick="..." to work
window.State = State;
window.Gallery = Gallery;
window.WorkflowDiscovery = WorkflowDiscovery;
window.WorkflowExecution = WorkflowExecution;

/**
 * Single Source of Truth for Screen Visibility
 * Kills all screens except the one requested.
 */
window.showStage = (stageId) => {
    const stages = ['gateway-view', 'browser-view', 'params-view', 'execution-view'];
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

window.openBrowser = () => {
    window.showStage('browser-view');
    Gallery.render(State.ssot, State.locale);
    
    // Inject graphical selectors if empty
    const map = document.getElementById('view-map');
    if (map && !map.innerHTML) map.innerHTML = MapSelection.render();
    
    const flavor = document.getElementById('view-flavor');
    if (flavor && !flavor.innerHTML) flavor.innerHTML = FlavorWheel.render();
};

window.lockAndStart = () => {
    const manifest = WorkflowDiscovery.getLockedManifest();
    window.showStage('execution-view');
    WorkflowExecution.start(manifest, State.ssot, State.locale);
};

window.changeStep = (delta) => {
    // Determine which screen is currently active
    const activeStage = ['gateway-view', 'browser-view', 'params-view', 'execution-view']
        .find(id => !document.getElementById(id).classList.contains('hidden'));

    if (delta === -1) {
        // LOGIC-BLIND BACK NAVIGATION
        switch(activeStage) {
            case 'execution-view':
                // Track 2 internal back or return to Params
                WorkflowExecution.navigate(-1, State.locale);
                break;
            case 'params-view':
                window.showStage('browser-view');
                break;
            case 'browser-view':
                window.showStage('gateway-view');
                break;
        }
    } else if (delta === 1) {
        // Linear Next is only for Param confirmation or Execution steps
        if (activeStage === 'params-view') window.lockAndStart();
        if (activeStage === 'execution-view') WorkflowExecution.navigate(1, State.locale);
    }
};

window.switchSelector = (viewId) => {
    const map = document.getElementById('view-map');
    const flavor = document.getElementById('view-flavor');
    const tabs = document.querySelectorAll('.tab-btn');

    // 1. Update Tab UI
    tabs.forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewId));

    // 2. Toggle internal visibility
    if (viewId === 'map') {
        map.classList.remove('hidden');
        flavor.classList.add('hidden');
    } else {
        map.classList.add('hidden');
        flavor.classList.remove('hidden');
        // Re-plot the flavor wheel to ensure pins are rendered correctly
        if (window.FlavorWheel) {
            window.FlavorWheel.plotProducts(window.State.ssot, window.State.locale);
        }
    }
};

window.handleBack = () => {
    const activeStage = ['gateway-view', 'browser-view', 'params-view', 'execution-view']
        .find(id => !document.getElementById(id).classList.contains('hidden'));

    switch(activeStage) {
        case 'execution-view':
            // Logic for Track 2 back
            window.WorkflowExecution.navigate(-1, window.State.locale);
            break;
        case 'params-view':
            // Return to Browser
            window.showStage('browser-view');
            break;
        case 'browser-view':
            // Return to Gateway
            window.showStage('gateway-view');
            break;
        default:
            // Already at Gateway, do nothing or refresh
            location.reload();
    }
};

// Initial Boot
async function boot() {
    try {
        await State.init();
        window.showStage('gateway-view');
        console.log("Baking Core: System Online.");
    } catch (err) {
        console.error("Boot failed:", err);
    }
}
boot();