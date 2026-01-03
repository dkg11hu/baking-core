export const Gallery = {
    selectedId: null,

    render(ssot, locale) {
        const grid = document.getElementById('tile-grid');
        if (!grid) return;
        this.filterByTerritory('ALL', ssot, locale);
    },


    selectProduct(id) {
        this.selectedId = id;
        
        // 1. ADVANCE TO SCREEN 2
        if (window.showStage) {
            window.showStage('params-view');
        } else {
            console.error("Navigation Error: showStage not found on window.");
        }
        
        // 2. INITIALIZE TRACK 1 (Discovery)
        if (window.WorkflowDiscovery) {
            window.WorkflowDiscovery.init(id, window.State.ssot, window.State.locale);
        }
    }
};