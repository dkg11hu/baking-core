import { State } from './State.mjs';
import { MediaHelper } from './MediaHelper.mjs';

export const Driver = {
    async start(id, ssot, locale) {
        State.currentId = id;
        State.currentStepIdx = 0;
        document.getElementById('browser-view').classList.add('hidden');
        document.getElementById('workflow-view').classList.remove('hidden');
        this.updateUI(ssot, locale);
    },

    move(delta, ssot, locale) {
        const product = ssot.registry[State.currentId];
        const seq = product.ui_features.workflow_sequence;
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
        const ui = product.ui_features;
        const stepKey = ui.workflow_sequence[State.currentStepIdx];
        const mediaStage = document.getElementById('media-stage');
        const fallback = MediaHelper.getFallbackSVG(State.currentId);

        if (ui.video_ref) {
            mediaStage.innerHTML = `<video src="${ui.video_ref}" controls autoplay loop muted 
                onerror="this.parentElement.innerHTML='<img src=\\'${fallback}\\'>'"></video>`;
        } else {
            const imgUrl = MediaHelper.safeImage(ui.tile_photo, State.currentId);
            mediaStage.innerHTML = `<img src="${imgUrl}" onerror="this.src='${fallback}'; this.onerror=null;">`;
        }

        document.getElementById('step-description').innerHTML = `
            <div class="step-meta">
                <span class="badge">${product.category_id}</span>
                <span class="count">Step ${State.currentStepIdx + 1} / ${ui.workflow_sequence.length}</span>
            </div>
            <h2>${locale[stepKey] || stepKey}</h2>
        `;
    }
};