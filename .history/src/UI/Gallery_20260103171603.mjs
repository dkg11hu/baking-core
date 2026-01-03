export const Gallery = {
    selectedId: null,

    // ... render methods ...

    selectProduct(id) {
        this.selectedId = id;
        
        // 1. Trigger Global Stage Manager
        window.showStage('params-view');
        
        // 2. Initialize Parametrization View
        window.WorkflowDiscovery.init(id, window.State.ssot, window.State.locale);
    }
};