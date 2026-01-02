import { Gallery } from './src/UI/Gallery.mjs';
import { Driver } from './src/UI/Driver.mjs';
import { State } from './src/UI/State.mjs';

// Attach to window so SVG/HTML onclick can see them
window.filterByTerritory = (territory) => Gallery.filterByTerritory(territory, State.ssot, State.locale);
window.startWorkflow = (id) => Driver.start(id, State.ssot, State.locale);
window.changeStep = (delta) => Driver.move(delta, State.locale);

async function boot() {
    await State.init();
    Gallery.render(State.ssot, State.locale);
    console.log("Mobile Driver Ready.");
}
boot();