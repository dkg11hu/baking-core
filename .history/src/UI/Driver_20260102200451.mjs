import { GraphResolver } from '../Graph/Core/Resolver.mjs';
import { State } from './State.mjs';

export const Driver = {
    renderStep(stepData) {
        const stage = document.getElementById('media-stage');
        const videoPath = `./assets/vid/tech/${stepData.technique_id.toLowerCase()}.mp4`;

        // We use a video element with a 'poster' attribute as a first-line fallback
        stage.innerHTML = `
            <div class="media-container">
                <video 
                    src="${videoPath}" 
                    autoplay loop muted playsinline
                    poster="./assets/img/placeholders/tech_placeholder.jpg"
                    onerror="this.style.display='none'; document.getElementById('vid-fallback').style.display='flex';">
                </video>
                <div id="vid-fallback" class="fallback-ui" style="display:none;">
                    <div class="artisan-loader"></div>
                    <span>Visualizing Technique: ${stepData.technique_id}</span>
                </div>
            </div>
        `;
    }
};