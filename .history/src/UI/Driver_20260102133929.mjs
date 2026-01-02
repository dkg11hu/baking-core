import { State } from './State.mjs';

export const Driver = {
    async start(id, ssot, locale) {
        State.currentId = id;
        State.currentStepIdx = 0;
        document.getElementById('browser-view').classList.add('hidden');
        document.getElementById('workflow-view').classList.remove('hidden');
        this.updateUI(ssot, locale);
    },

    move(delta, ssot, locale) {
        const seq = ssot.registry[State.currentId].ui_features.workflow_sequence;
        const next = State.currentStepIdx + delta;

        if (next >= 0 && next < seq.length) {
            State.currentStepIdx = next;
            this.updateUI(ssot, locale);
        } else if (next < 0) {
            document.getElementById('browser-view').classList.remove('hidden');
            document.getElementById('workflow-view').classList.add('hidden');
        }
    },

    updateUI(ssot, locale) {
        const product = ssot.registry[State.currentId];
        const stepKey = product.ui_features.workflow_sequence[State.currentStepIdx];
        
        document.getElementById('media-stage').innerHTML = product.ui_features.video_ref 
            ? `<video src="${product.ui_features.video_ref}" controls autoplay loop muted></video>`
            : `<img src="${product.ui_features.tile_photo}">`;

        document.getElementById('step-description').innerHTML = `
            <h2>${locale[stepKey] || stepKey}</h2>
            <p>Stage ${State.currentStepIdx + 1} of ${product.ui_features.workflow_sequence.length}</p>
        `;
    }
};