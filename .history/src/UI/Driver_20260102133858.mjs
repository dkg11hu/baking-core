import { State } from './src/UI/State.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { Driver } from './src/UI/Driver.mjs';

async function boot() {
    const data = await State.init();
    
    // Initial Render
    Gallery.render(data.ssot, data.locale);
    
    // Global Event Listeners for Stepwise Control
    window.filterByTag = (tag) => Gallery.filter(tag, data.ssot, data.locale);
    window.startWorkflow = (id) => Driver.start(id, data.ssot, data.locale);
    window.changeStep = (delta) => Driver.move(delta, data.ssot, data.locale);
}

boot();