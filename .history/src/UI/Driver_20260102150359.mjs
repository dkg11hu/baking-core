import { GraphResolver } from '../Graph/Core/Resolver.mjs';
import { State } from './State.mjs';

export const Driver = {
    async start(id, ssot, locale) {
        // Resolve the compositional graph
        const bundle = await GraphResolver.resolve(id, ssot);
        State.currentProcess = bundle;
        State.currentStepIdx = 0;
        
        document.getElementById('browser-view').classList.add('hidden');
        document.getElementById('workflow-view').classList.remove('hidden');
        this.updateUI(locale);
    },

    updateUI(locale) {
        const step = State.currentProcess.workflow[State.currentStepIdx];
        const mediaStage = document.getElementById('media-stage');

        // Render instruction with instance-specific overrides (Time/Temp/Tools)
        mediaStage.innerHTML = `
            <video src="${step.video}" autoplay loop muted controls></video>
            <div class="param-overlay">
                ${step.target_temp ? `<span>🌡️ ${step.target_temp}°C</span>` : ''}
                ${step.duration_min ? `<span>⏱️ ${step.duration_min}m</span>` : ''}
            </div>
        `;

        document.getElementById('step-description').innerHTML = `
            <h2>${locale[step.id] || step.id}</h2>
            <div class="tool-list">
                ${step.tools?.map(t => `<span class="tool-tag">${t}</span>`).join('')}
            </div>
        `;
    }
};