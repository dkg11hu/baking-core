import { State } from './src/UI/State.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { Driver } from './src/UI/Driver.mjs';
import { FlavorWheel } from './src/UI/FlavorWheel.mjs';

// --- GLOBAL BRIDGES ---
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
    const t = document.getElementById('ui-tooltip');
    if (t) t.style.display = 'none';
};

window.switchSelector = (viewId) => {
    const map = document.getElementById('view-map');
    const flavor = document.getElementById('view-flavor');
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewId));
    if (map) map.style.display = viewId === 'map' ? 'block' : 'none';
    if (flavor) flavor.style.display = viewId === 'flavor' ? 'block' : 'none';
};

window.filterByTerritory = (territory) => Gallery.filterByTerritory(territory, State.ssot, State.locale);
window.startWorkflow = (id) => { window.hideHelper(); Driver.start(id, State.ssot, State.locale); };
window.changeStep = (delta) => Driver.move(delta, State.locale);

async function boot() {
    try {
        await State.init();
        const screen = document.querySelector('.screen-content');
        
        // Setup Tooltip
        const tooltip = document.createElement('div');
        tooltip.id = 'ui-tooltip'; tooltip.className = 'ui-tooltip';
        screen.appendChild(tooltip);

        // Render Selector (Map + Wheel Container)
        Gallery.render(State.ssot, State.locale);
        
        // Inject Flavor Wheel into the container Gallery created
        const flavorContainer = document.getElementById('view-flavor');
        if (flavorContainer) {
            flavorContainer.innerHTML = FlavorWheel.render();
            requestAnimationFrame(() => FlavorWheel.plotProducts(State.ssot, State.locale));
        }

        console.log("iPhone XS Driver: Online | Logic-Blind Engine Ready");
    } catch (err) { console.error("Boot failed:", err); }
}

boot();