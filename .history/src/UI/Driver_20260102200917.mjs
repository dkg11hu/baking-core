import { GraphResolver } from '../Graph/Core/Resolver.mjs';
import { State } from './State.mjs';

export const Driver = {
    currentIndex: 0,
    steps: [],

    start(id, ssot, locale) {
        // Logic-Blind: Fieldnames come strictly from the database
        const entity = ssot.registry[id];
        
        // Safety Check: Ensure steps exist and are an array
        if (!entity || !entity.steps || entity.steps.length === 0) {
            console.error(`[Driver] No steps defined for entity: ${id}`);
            alert(`Recipe data for ${locale[id] || id} is currently being updated.`);
            return;
        }

        this.steps = entity.steps;
        this.currentIndex = 0;
        this.render(locale);
    },

    move(delta, locale) {
        const targetIndex = this.currentIndex + delta;
        if (targetIndex >= 0 && targetIndex < this.steps.length) {
            this.currentIndex = targetIndex;
            this.render(locale);
        } else if (targetIndex >= this.steps.length) {
            // Workflow complete logic
            location.reload(); 
        }
    },

    render(locale) {
        const step = this.steps[this.currentIndex];
        
        // Final Safety Guard: If for some reason step is null
        if (!step) return;

        const screen = document.querySelector('.screen-content');
        
        // Prepare the technique ID for the filesystem
        const techId = step.technique_id || 'UNKNOWN';
        const videoPath = `./assets/vid/tech/${techId.toLowerCase()}.mp4`;

        screen.innerHTML = `
            <div class="media-container">
                <video src="${videoPath}" autoplay loop muted playsinline
                       onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                </video>
                <div class="fallback-ui" style="display:none; height:200px; background:#111; justify-content:center; align-items:center; color:#555; flex-direction:column; gap:10px;">
                    <div class="artisan-loader"></div>
                    <span>Visualizing: ${techId}</span>
                </div>
            </div>
            <div class="content-stage">
                <h2>${locale[techId] || techId}</h2>
                <p>${step.instructions || 'Follow the technique shown above.'}</p>
            </div>
            <div class="stepper-controls">
                <button class="btn-nav" onclick="window.changeStep(-1)">BACK</button>
                <button class="btn-nav primary" onclick="window.changeStep(1)">
                    ${this.currentIndex === this.steps.length - 1 ? 'FINISH' : 'NEXT'}
                </button>
            </div>
        `;
    }
};