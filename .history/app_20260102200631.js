import { State } from './src/UI/State.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { Driver } from './src/UI/Driver.mjs';
import { FlavorWheel } from './src/UI/FlavorWheel.mjs';

/**
 * BRIDGE: GLOBAL SCOPE ATTACHMENT
 * Attach these immediately so HTML onclick events don't throw ReferenceErrors.
 */
window.changeStep = (delta) => {
    // Check if Driver is ready before moving
    if (Driver && typeof Driver.move === 'function') {
        Driver.move(delta, State.locale);
    }
};

window.startWorkflow = (id) => {
    window.hideHelper?.(); // Clean up tooltip
    Driver.start(id, State.ssot, State.locale);
};

window.filterByTerritory = (territory) => {
    Gallery.filterByTerritory(territory, State.ssot, State.locale);
};

window.switchSelector = (viewId) => {
    const map = document.getElementById('view-map');
    const flavor = document.getElementById('view-flavor');
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewId));
    
    if (viewId === 'map') {
        if (map) map.style.display = 'block';
        if (flavor) flavor.style.display = 'none';
    } else {
        if (map) map.style.display = 'none';
        if (flavor) flavor.style.display = 'block';
    }
};

/**
 * BOOT SEQUENCE
 */
async function boot() {
    try {
        // 1. Initial Data Load
        await State.init();
        
        // 2. Setup Tooltip UI
        const screen = document.querySelector('.screen-content');
        if (!document.getElementById('ui-tooltip')) {
            const tooltip = document.createElement('div');
            tooltip.id = 'ui-tooltip';
            tooltip.className = 'ui-tooltip';
            screen.appendChild(tooltip);
        }

        // 3. Render Static UI Components
        Gallery.render(State.ssot, State.locale);
        
        const selector = document.getElementById('graphical-selector');
        if (selector) {
            selector.innerHTML += FlavorWheel.render();
        }
        
        // 4. Async Plotting (Wait for DOM Paint)
        requestAnimationFrame(() => {
            FlavorWheel.plotProducts(State.ssot, State.locale);
        });
        
        console.log("iPhone XS Driver: Online");
    } catch (err) { 
        console.error("Boot sequence interrupted:", err); 
    }
}

boot();