/**
 * WorkflowDiscovery (Track 1)
 * Manages the transition between choosing a history record and 
 * parametrizing a new bake based on SSoT physics categories.
 */
export const WorkflowDiscovery = {
    activeId: null,
    state: 'GATEWAY', // 'GATEWAY' or 'PARAMS'

    renderGateway(id, locale) {
        this.activeId = id;
        this.state = 'GATEWAY';
        const root = document.getElementById('discovery-root');
        
        // Reset scroll and clear previous view
        root.scrollTop = 0;
        root.classList.remove('hidden');
        
        const name = locale[id] || id;

// Inside renderGateway(id, locale)
        root.innerHTML = `
            <div class="gateway-screen">
                <span class="breadcrumb">GLOBAL SELECTION</span>
                <h1 class="step-title" style="color: #fff;">${name}</h1>
                
                <div class="choice-container">
                    <button class="choice-card" onclick="window.viewHistory()">
                        <div class="icon">★</div>
                        <div class="choice-text">
                            <strong style="color: #fff;">FAVORITES / HISTORY</strong>
                            <span style="color: #888;">Sorted by frequency & timestamp</span>
                        </div>
                    </button>

                    <button class="choice-card highlight" onclick="window.changeStep(1)">
                        <div class="icon">➔</div>
                        <div class="choice-text">
                            <strong style="color: #fff;">START NEW BAKE</strong>
                            <span style="color: #888;">Workflow Track 1: Configure Params</span>
                        </div>
                    </button>
                </div>
            </div>`;
    },

    init(id, ssot, locale) {
        this.state = 'PARAMS';
        const root = document.getElementById('discovery-root');
        const entity = ssot.registry[id];
        
        // Fieldnames are strictly derived from the database
        const fields = entity.physics_categories || ['PHYS_MASS_TOTAL'];

        // Reset scroll before rendering new inputs
        root.scrollTop = 0;

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
                            <input type="number" 
                                   data-physics="${key}" 
                                   value="${key.includes('MASS') ? 1000 : 22}"
                                   inputmode="decimal">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Captures the current state of inputs to lock them for Workflow #2.
     * Logic-blind: maps whatever data-physics keys were generated.
     */
    getLockedManifest() {
        const values = {};
        document.querySelectorAll('[data-physics]').forEach(el => {
            values[el.dataset.physics] = el.value;
        });

        return {
            id: this.activeId,
            values: values,
            timestamp: Date.now()
        };
    }
};