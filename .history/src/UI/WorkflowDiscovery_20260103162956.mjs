export const WorkflowDiscovery = {
    activeId: null,

    init(id, ssot, locale) {
        this.activeId = id;
        const root = document.getElementById('discovery-root');
        root.classList.remove('hidden');
        
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
                            <input type="number" data-physics="${key}" value="${key.includes('MASS') ? 1000 : 22}">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

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