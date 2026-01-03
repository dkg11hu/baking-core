import { State } from './src/UI/State.mjs';
import { StageManager } from './src/UI/StageManager.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { MapSelection } from './src/UI/MapSelection.mjs';
import { FlavorWheel } from './src/UI/FlavorWheel.mjs';


// --- ATTACH TO WINDOW IMMEDIATELY ---
window.showStage = (id) => StageManager.show(id);

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

// Bridge for the Map SVG click
window.filterByTerritory = (territory) => {
    StageManager.show('browser-view');
    Gallery.filterByTerritory(territory, State.ssot, State.locale);
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