import { State } from './src/UI/State.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { Driver } from './src/UI/Driver.mjs';
import { FlavorWheel } from './src/UI/FlavorWheel.mjs';

/** * 1. IMMEDIATE GLOBAL ASSIGNMENT 
 * We do this BEFORE the async boot to prevent "Not a function" errors
 */
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

/** * 2. ASYNC BOOT 
 */
async function boot() {
    try {
        await State.init();
        
        const screen = document.querySelector('.screen-content');
        if (!document.getElementById('ui-tooltip')) {
            const tooltip = document.createElement('div');
            tooltip.id = 'ui-tooltip';
            tooltip.className = 'ui-tooltip';
            screen.appendChild(tooltip);
        }

        Gallery.render(State.ssot, State.locale);
        
        const selector = document.getElementById('graphical-selector');
        selector.innerHTML += FlavorWheel.render();
        
        requestAnimationFrame(() => {
            FlavorWheel.plotProducts(State.ssot, State.locale);
        });
        
        console.log("iPhone XS Driver: Online");
    } catch (err) { console.error("Boot failed:", err); }
}

boot();