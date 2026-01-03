export const WorkflowDiscovery = {
    activeId: null,
    state: 'GATEWAY', // 'GATEWAY' or 'PARAMS'

    renderGateway(id, locale) {
        this.activeId = id;
        this.state = 'GATEWAY';
        const root = document.getElementById('discovery-root');
        root.classList.remove('hidden');
        
        const name = locale[id] || id;

        root.innerHTML = `
            <div class="gateway-screen">
                <span class="breadcrumb">GLOBAL SELECTION</span>
                <h1 class="step-title">${name}</h1>
                
                <div class="choice-container">
                    <button class="choice-card" onclick="console.log('Load Favorites')">
                        <div class="icon">★</div>
                        <div>
                            <strong>FAVORITES / HISTORY</strong>
                            <span>Sorted by frequency & timestamp</span>
                        </div>
                    </button>

                    <button class="choice-card highlight" onclick="window.changeStep(1)">
                        <div class="icon">➔</div>
                        <div>
                            <strong>START NEW BAKE</strong>
                            <span>Workflow Track 1: Configure Params</span>
                        </div>
                    </button>
                </div>
            </div>`;
    },

    init(id, ssot, locale) {
        this.state = 'PARAMS';
        const root = document.getElementById('discovery-root');
        const entity = ssot.registry[id];
        const fields = entity.physics_categories || ['PHYS_MASS_TOTAL'];

        root.innerHTML = `
            <div class="discovery-wrapper">
                <header class="discovery-header">
                    <span class="breadcrumb">TRACK 1: PARAMETRIZATION</span>
                    <h2 class="params-title">${locale[id] || id}</h2>
                </header>
                <div class="params-grid">
                    ${fields.map(key => `
                        <div class="param-row">
                            <label>${locale[key] || key}</label>
                            <input type="number" data-physics="${key}" value="1000">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
};