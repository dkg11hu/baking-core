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
            
            if (id === stageId) {
                el.classList.remove('hidden');
                el.scrollTop = 0;
            } else {
                el.classList.add('hidden');
            }
        });
        console.log(`Stage Transition: -> ${stageId}`);
    }
};