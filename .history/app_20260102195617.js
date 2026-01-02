import { State } from './src/UI/State.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { Driver } from './src/UI/Driver.mjs';
import { FlavorWheel } from './src/UI/FlavorWheels.mjs'; // Standardized to Singular

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
        
        const screen = document.querySelector('.screen-content');
        const tooltip = document.createElement('div');
        tooltip.id = 'ui-tooltip';
        tooltip.className = 'ui-tooltip';
        screen.appendChild(tooltip);

        // Render the Gallery (which now handles the Map + Wheel container)
        Gallery.render(State.ssot, State.locale);
        
        // Initial Plotting for the Flavor Wheel
        await FlavorWheel.plotProducts(State.ssot, State.locale);

        console.log("iPhone XS Driver: Online | Systems Synchronized");
    } catch (err) {
        console.error("Boot sequence interrupted:", err);
    }
}

boot();