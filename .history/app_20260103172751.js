// 1. Unified Stage Manager (Expanded to 5 Screens)
window.showStage = (stageId) => {
    const stages = ['gateway-view', 'selector-view', 'browser-view', 'params-view', 'execution-view'];
    stages.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (id === stageId) {
            el.classList.remove('hidden');
            el.scrollTop = 0;
        } else {
            el.classList.add('hidden');
        }
    });
};

// 2. Gateway -> Selector Stage
window.openBrowser = () => {
    window.showStage('selector-view');
    
    // Inject components if they haven't been rendered yet
    const mapContainer = document.getElementById('view-map');
    if (mapContainer && !mapContainer.innerHTML) {
        mapContainer.innerHTML = MapSelection.render();
    }
    
    const flavorContainer = document.getElementById('view-flavor');
    if (flavorContainer && !flavorContainer.innerHTML) {
        flavorContainer.innerHTML = FlavorWheel.render();
    }
};

/**
 * THE AUTO-ADVANCE BRIDGE
 * Called by Map/Flavor click events. 
 * Transition: Selector Screen -> Results Screen
 */
window.applyFilterAndAdvance = (filterValue) => {
    // Stage 1: Advance the Screen
    window.showStage('browser-view');
    
    // Stage 2: Filter the results based on DB field 'classification'
    Gallery.filterByTerritory(filterValue, State.ssot, State.locale);
};

// 3. Universal Navigation Handler (Updated for 5 screens)
window.changeStep = (delta) => {
    const activeStage = ['gateway-view', 'selector-view', 'browser-view', 'params-view', 'execution-view']
        .find(id => !document.getElementById(id).classList.contains('hidden'));

    if (delta === -1) {
        const routes = {
            'execution-view': () => WorkflowExecution.navigate(-1, State.locale),
            'params-view':    () => window.showStage('browser-view'),
            'browser-view':   () => window.showStage('selector-view'),
            'selector-view':  () => window.showStage('gateway-view')
        };
        if (routes[activeStage]) routes[activeStage]();
    } else {
        if (activeStage === 'params-view') window.lockAndStart();
        if (activeStage === 'execution-view') WorkflowExecution.navigate(1, State.locale);
    }
};