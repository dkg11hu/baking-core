import { State } from './src/UI/State.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { Driver } from './src/UI/Driver.mjs';
import { FlavorWheels } from './src/UI/FlavorWheels.mjs';

// --- HOVER HELPER LOGIC ---
window.showHelper = (e, label) => {
    const tooltip = document.getElementById('ui-tooltip');
    if (!tooltip) return;

    tooltip.innerText = label;
    tooltip.style.display = 'block';

    // Get iPhone frame position to calculate relative offset
    const frame = document.querySelector('.iphone-xs').getBoundingClientRect();
    
    // Position tooltip 20px above and 15px to the right of cursor
    tooltip.style.left = `${e.clientX - frame.left + 15}px`;
    tooltip.style.top = `${e.clientY - frame.top - 30}px`;
};

window.hideHelper = () => {
    const tooltip = document.getElementById('ui-tooltip');
    if (tooltip) tooltip.style.display = 'none';
};

// --- PRE-EXISTING GLOBALS ---
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
        
        // Add the tooltip element to the screen once
        const screen = document.querySelector('.screen-content');
        const tooltip = document.createElement('div');
        tooltip.id = 'ui-tooltip';
        tooltip.className = 'ui-tooltip';
        screen.appendChild(tooltip);

        Gallery.render(State.ssot, State.locale);
        
        // If you are using the sensory matrix:
        // await FlavorWheels.plot(State.ssot, State.locale);

        console.log("iPhone XS Driver: Online with Hover Helpers");
    } catch (err) {
        console.error("Boot sequence interrupted:", err);
    }
}

boot();