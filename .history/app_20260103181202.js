import { State } from './src/UI/State.mjs';
import { Bridge } from './src/UI/Bridge.mjs';
import { StageManager } from './src/UI/StageManager.mjs';
import { MapSelection } from './src/UI/MapSelection.mjs';
import { FlavorWheel } from './src/UI/FlavorWheel.mjs';

// Initialize Global Bridges
Bridge.init();

// app.js

// ... imports ...

/**
 * THE SWITCHER BRIDGE
 * This MUST be attached to window to satisfy onclick in index.html
 */
window.switchSelector = (viewId) => {
    const map = document.getElementById('view-map');
    const flavor = document.getElementById('view-flavor');
    const tabs = document.querySelectorAll('.tab-btn');

    // 1. Update Tab Visuals
    tabs.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    // 2. Toggle Visibility
    if (viewId === 'map') {
        map.classList.remove('hidden');
        flavor.classList.add('hidden');
    } else {
        map.classList.add('hidden');
        flavor.classList.remove('hidden');
        
        // 3. Re-plot dots if switching to flavor
        if (window.State.ssot) {
            window.FlavorWheel.plotProducts(window.State.ssot, window.State.locale);
        }
    }
};

// Ensure other globals are set too
window.openSelectors = openSelectors;

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