import { Formula } from '../Formula.mjs';

export const Params = {
    activeId: null,
    
    render(id, ssot, locale) {
        this.activeId = id;
        const product = ssot.registry[id];
        const container = document.getElementById('params-view');
        
        // Retrieve which physics inputs this product requires from the SSoT
        const requiredParams = product.physics_categories || ['PHYS_MASS_TOTAL'];

        container.innerHTML = `
            <div class="params-container">
                <header class="params-header">
                    <span class="breadcrumb">${locale['UI_PARAMETRIZATION'] || 'PARAMETRIZATION'}</span>
                    <h1>${locale[id] || id}</h1>
                </header>

                <div class="params-list">
                    ${requiredParams.map(paramKey => `
                        <div class="input-group">
                            <label>${locale[paramKey] || paramKey}</label>
                            <input type="number" 
                                   data-param="${paramKey}" 
                                   value="${this.getDefaultValue(paramKey)}"
                                   onchange="Params.handleUpdate()">
                        </div>
                    `).join('')}
                </div>

                <div id="params-preview" class="yield-preview">
                    </div>
            </div>
        `;
        
        this.handleUpdate(); // Initial calculation
    },

    getDefaultValue(key) {
        const defaults = { 'PHYS_MASS_TOTAL': 1000, 'PHYS_TEMP_ROOM': 22, 'PHYS_TEMP_FLOUR': 20 };
        return defaults[key] || 0;
    },

    handleUpdate() {
        const inputs = document.querySelectorAll('[data-param]');
        const currentParams = {};
        inputs.forEach(input => {
            currentParams[input.dataset.param] = parseFloat(input.value);
        });

        // Workflow #1 Logic: Recalculate the formula based on inputs
        // This does NOT start the video; it just prepares the data
        const results = Formula.calculate(this.activeId, currentParams);
        this.renderPreview(results);
    },

    renderPreview(results) {
        const preview = document.getElementById('params-preview');
        if (!preview) return;
        
        preview.innerHTML = `
            <div class="preview-card">
                <span>FINAL YIELD</span>
                <strong>${results.totalMass}g</strong>
            </div>
        `;
        
        // Logic-blind: light up the NEXT button now that params are valid
        document.querySelector('.btn-nav.primary').disabled = false;
    }
};