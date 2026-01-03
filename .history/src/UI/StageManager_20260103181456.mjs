/**
 * StageManager.mjs
 * Responsibilities: Screen isolation and scroll resetting.
 */
export const StageManager = {
    stages: ['gateway-view', 'selector-view', 'browser-view', 'params-view', 'execution-view'],
    show(stageId) {
        this.stages.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.classList.toggle('hidden', id !== stageId);
            if (id === stageId) el.scrollTop = 0;
        });
    }
};