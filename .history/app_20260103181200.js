import { State } from './src/UI/State.mjs';
import { Bridge } from './src/UI/Bridge.mjs';
import { StageManager } from './src/UI/StageManager.mjs';
import { MapSelection } from './src/UI/MapSelection.mjs';
import { FlavorWheel } from './src/UI/FlavorWheel.mjs';

// Initialize Global Bridges
Bridge.init();



// Gateway -> Selector Transition
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

async function boot() {
    // Show Gateway immediately
    StageManager.show('gateway-view');

    try {
        await State.init();
        console.log("✅ Core System: Ready");
    } catch (err) {
        console.error("❌ Core System: Load Failure", err);
    }
}

boot();