import { State } from './src/UI/State.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { Driver } from './src/UI/Driver.mjs';
import { FlavorWheel } from './src/UI/FlavorWheel.mjs'; // Standardized to Singular

// --- HOVER HELPER LOGIC ---
window.showHelper = (e, label) => {
    const tooltip = document.getElementById('ui-tooltip');
    if (!tooltip) return;

    tooltip.innerText = label;
    tooltip.style.display = 'block';

    const frame = document.querySelector('.iphone-xs').getBoundingClientRect();
    tooltip.style.left = `${e.clientX - frame.left + 15}px`;
    tooltip.style.top = `${e.clientY - frame.top - 30}px`;
};

window.hideHelper = () => {
    const tooltip = document.getElementById('ui-tooltip');
    if (tooltip) tooltip.style.display = 'none';
};

// --- TAB SWITCHER LOGIC ---
window.switchSelector = (viewId) => {
    // Toggle active state on buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    // Toggle visibility of the views
    const mapView = document.getElementById('view-map');
    const flavorView = document.getElementById('view-flavor');

    if (viewId === 'map') {
        mapView.style.display = 'block';
        flavorView.style.display = 'none';
    } else {
        mapView.style.display = 'none';
        flavorView.style.display = 'block';
    }
};

// --- GLOBALS ---
window.filterByTerritory = (territory) => {
    Gallery.filterByTerritory(territory, State.ssot, State.locale);
};

window.startWorkflow = (id) => {
    Driver.start(id, State.ssot, State.locale);
};

window.changeStep = (delta) => {
    Driver.move(delta, State.locale);
};

async function boot() {
    try {
        await State.init();
        
        // 1. Initial Gallery Render
        Gallery.render(State.ssot, State.locale);
        
        // 2. Inject the Wheel HTML into the selector
        const selector = document.getElementById('graphical-selector');
        // We append the Wheel HTML to whatever the Gallery already put there (like the Map)
        selector.innerHTML += FlavorWheel.render(); 

        // 3. CRITICAL: Wait a millisecond for the browser to "paint" the new HTML
        // then plot the dots
        setTimeout(async () => {
            await FlavorWheel.plotProducts(State.ssot, State.locale);
        }, 50);

        console.log("iPhone XS Driver: Fully Rendered");
    } catch (err) {
        console.error("Boot sequence interrupted:", err);
    }
}

boot();