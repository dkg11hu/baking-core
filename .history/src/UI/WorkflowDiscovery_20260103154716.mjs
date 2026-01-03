import { Params } from './Params.mjs';

export const WorkflowDiscovery = {
    activeId: null,

    // Workflow #1 Entry Point
    init(id, ssot, locale) {
        this.activeId = id;
        const stage = document.getElementById('workflow-view');
        
        // Clear previous state and render the Configuration UI
        stage.innerHTML = `
            <div class="discovery-screen">
                <div id="params-injection-point"></div>
                <div class="discovery-controls">
                    <button class="btn-nav primary" onclick="window.lockAndStart()">
                        LOCK & START BAKE
                    </button>
                </div>
            </div>
        `;
        
        Params.render(id, ssot, locale, 'params-injection-point');
    },

    // Bridge: Captures the "Variable" state and freezes it
    getLockedManifest() {
        return {
            id: this.activeId,
            timestamp: Date.now(),
            parameters: Params.getManifest() // Pulls fieldnames from DB
        };
    }
};