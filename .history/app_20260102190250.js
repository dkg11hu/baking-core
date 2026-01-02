import { State } from './src/UI/State.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { Driver } from './src/UI/Driver.mjs';

// EXPOSE TO GLOBAL SCOPE (Required for SVG/HTML onclick)
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
        await State.init(); // Loads definitions.json and locale
        Gallery.render(State.ssot, State.locale);
        console.log("iPhone XS Driver: Online");
    } catch (err) {
        console.error("Boot sequence interrupted:", err);
    }
}

boot();