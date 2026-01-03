import { StageManager } from './StageManager.mjs';
import { Gallery } from './Gallery.mjs';
import { State } from './State.mjs';

/**
 * Bridge.mjs
 * Responsibilities: Global window exports and cross-module handoffs.
 */
export const Bridge = {
    init() {
        // SVG Map Click Bridge
        window.filterByTerritory = (territory) => {
            StageManager.show('browser-view');
            Gallery.filterByTerritory(territory, State.ssot, State.locale);
        };

        // Navigation Bridges
        window.showStage = (id) => StageManager.show(id);
        
        window.applyFilterAndAdvance = window.filterByTerritory;
        
        window.lockAndStart = () => {
            const manifest = window.WorkflowDiscovery.getLockedManifest();
            StageManager.show('execution-view');
            window.WorkflowExecution.start(manifest, State.ssot, State.locale);
        };
    }
};