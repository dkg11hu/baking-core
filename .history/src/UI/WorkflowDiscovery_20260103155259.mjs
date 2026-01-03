export const WorkflowDiscovery = {
    activeId: null,

    init(id, ssot, locale) {
        this.activeId = id;
        const root = document.getElementById('discovery-root');
        const entity = ssot.registry[id];
        
        // Pull fieldnames directly from SSoT physics_categories
        const fields = entity.physics_categories || ['PHYS_MASS_TOTAL'];

        root.innerHTML = `
            <div class="params-ui">
                ${fields.map(key => `
                    <div class="param-input">
                        <label>${locale[key] || key}</label>
                        <input type="number" data-physics="${key}" value="${key.includes('MASS') ? 1000 : 22}">
                    </div>
                `).join('')}
            </div>
        `;
    },

    getLockedManifest() {
        const params = {};
        // Scrape the UI for the fieldnames defined by the DB
        document.querySelectorAll('[data-physics]').forEach(el => {
            params[el.dataset.physics] = el.value;
        });

        return {
            id: this.activeId,
            values: params, // This is the "Resolved" data for Workflow #2
            timestamp: Date.now()
        };
    }
};