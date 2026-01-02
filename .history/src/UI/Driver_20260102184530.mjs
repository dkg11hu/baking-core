import { GraphResolver } from '../Graph/Core/Resolver.mjs';
import { State } from './State.mjs';

export const Driver = {
    async start(id, ssot, locale) {
        State.currentProcess = await GraphResolver.resolve(id, ssot);
        State.currentStepIdx = 0;
        document.getElementById('browser-view').classList.add('hidden');
        document.getElementById('workflow-view').classList.remove('hidden');
        this.updateUI(locale);
    },

    move(delta, locale) {
        const next = State.currentStepIdx + delta;
        if (next >= 0 && next < State.currentProcess.workflow.length) {
            State.currentStepIdx = next;
            this.updateUI(locale);
        } else if (next < 0) {
            document.getElementById('browser-view').classList.remove('hidden');
            document.getElementById('workflow-view').classList.add('hidden');
        }
    },

    updateUI(locale) {
        const step = State.currentProcess.workflow[State.currentStepIdx];
        const media = document.getElementById('media-stage');
        
        media.innerHTML = `<video src="${step.video}" autoplay loop muted></video>`;
        
        document.getElementById('step-metadata').innerHTML = `
            <div style="display:flex; gap:12px; margin-bottom:10px;">
                ${step.target_temp ? `<span class="badge">🌡️ ${step.target_temp}°C</span>` : ''}
                ${step.duration_min ? `<span class="badge">⏱️ ${step.duration_min}m</span>` : ''}
            </div>
        `;

        document.getElementById('step-description').innerHTML = `
            <h2>${locale[step.stepId] || step.stepId}</h2>
            <div class="tool-tags">
                ${step.tools?.map(t => `<span class="tag">${t}</span>`).join('') || ''}
            </div>
        `;
    }
};