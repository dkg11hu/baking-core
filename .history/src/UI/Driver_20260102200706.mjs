import { GraphResolver } from '../Graph/Core/Resolver.mjs';
import { State } from './State.mjs';

export const Driver = {
    currentIndex: 0,
    steps: [],

    start(id, ssot, locale) {
        const entity = ssot.registry[id];
        // Note: Fieldnames come from database as per instructions
        this.steps = entity.steps || [];
        this.currentIndex = 0;
        this.render(locale);
    },

    move(delta, locale) {
        const targetIndex = this.currentIndex + delta;
        if (targetIndex >= 0 && targetIndex < this.steps.length) {
            this.currentIndex = targetIndex;
            this.render(locale);
        } else if (targetIndex >= this.steps.length) {
            // End of workflow logic
            alert("Workflow Complete");
            location.reload(); 
        }
    },

    render(locale) {
        const step = this.steps[this.currentIndex];
        const screen = document.querySelector('.screen-content');
        
        // Clear previous view
        screen.innerHTML = '';
        
        const videoPath = `./assets/vid/tech/${step.technique_id.toLowerCase()}.mp4`;

        screen.innerHTML = `
            <div class="media-container">
                <video src="${videoPath}" autoplay loop muted playsinline
                       onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                </video>
                <div class="fallback-ui" style="display:none; height:200px; background:#111; justify-content:center; align-items:center; color:#555;">
                    MISSING TECH: ${step.technique_id}
                </div>
            </div>
            <div class="content-stage">
                <h2>${locale[step.technique_id] || step.technique_id}</h2>
                <p>${step.instructions || 'Proceed to next step.'}</p>
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