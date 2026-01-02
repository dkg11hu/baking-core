import { State } from './src/UI/State.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { Driver } from './src/UI/Driver.mjs';
import { FlavorWheel } from './src/UI/FlavorWheel.mjs';

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
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.view === viewId));
    document.getElementById('view-map').style.display = viewId === 'map' ? 'block' : 'none';
    document.getElementById('view-flavor').style.display = viewId === 'flavor' ? 'block' : 'none';
};

window.filterByTerritory = (territory) => Gallery.filterByTerritory(territory, State.ssot, State.locale);
window.startWorkflow = (id) => { window.hideHelper(); Driver.start(id, State.ssot, State.locale); };

async function boot() {
    try {
        await State.init();
        const screen = document.querySelector('.screen-content');
        const tooltip = document.createElement('div');
        tooltip.id = 'ui-tooltip'; tooltip.className = 'ui-tooltip';
        screen.appendChild(tooltip);

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