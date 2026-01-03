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
    const isExecution = !document.getElementById('execution-view').classList.contains('hidden');

    if (isExecution) {
        WorkflowExecution.navigate(delta, State.locale);
    } else if (delta === -1) {
        // Handle Back logic for Workflow #1
        const current = ['gateway-view', 'browser-view', 'params-view']
            .find(id => !document.getElementById(id).classList.contains('hidden'));
        
        if (current === 'params-view') window.showStage('browser-view');
        else if (current === 'browser-view') window.showStage('gateway-view');
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