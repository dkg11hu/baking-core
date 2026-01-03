/**
 * StageManager.mjs
 * Pure state switcher for the 5-screen architecture.
 */
export const StageManager = {
    stages: ['gateway-view', 'selector-view', 'browser-view', 'params-view', 'execution-view'],

    show(stageId) {
        this.stages.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            
            if (id === stageId) {
                el.classList.remove('hidden');
                el.scrollTop = 0; // Reset scroll for new screen
            } else {
                el.classList.add('hidden');
            }
        });
        console.log(`System: Transitioned to ${stageId}`);
    }
};