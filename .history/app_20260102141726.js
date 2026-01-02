import { State } from './src/UI/State.mjs';
import { Gallery } from './src/UI/Gallery.mjs';
import { Driver } from './src/UI/Driver.mjs';

async function boot() {
    try {
        const data = await State.init();
        
        // Initial view
        Gallery.render(data.ssot, data.locale);
        
        // Window hooks for index.html onclick events
        window.filterByTag = (tag) => Gallery.filter(tag, data.ssot, data.locale);
        window.startWorkflow = (id) => Driver.start(id, data.ssot, data.locale);
        window.changeStep = (delta) => Driver.move(delta, data.ssot, data.locale);

        console.log("Mobile Driver Ready.");
    } catch (err) {
        console.error("Boot failed:", err);
    }
}

boot();