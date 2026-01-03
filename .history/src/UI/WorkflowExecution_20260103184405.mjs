export const WorkflowExecution = {
    steps: [],
    currentStepIndex: 0,

    start(manifest, ssot, locale) {
        // 1. Target the correct ID from your index.html
        const container = document.getElementById('execution-root');
        if (!container) return;

        // 2. Fetch the Product Entity from the Registry
        const product = ssot.registry[manifest.id];
        
        // 3. Map Steps strictly from the database 'process' or 'workflow' field
        // Logic-blind: we use whatever keys the database provides
        this.steps = product.workflow_steps || ['PREP', 'BAKE']; 
        this.currentStepIndex = 0;
        
        this.render(locale);
    },

    render(locale) {
        const container = document.getElementById('execution-root');
        const stepKey = this.steps[this.currentStepIndex];
        
        // Fieldname: derived from locale translation of the DB key
        const stepName = locale[stepKey] || stepKey;

        container.innerHTML = `
            <div class="execution-wrapper">
                <header class="step-header">
                    <span class="meta-chip">
                        <span>PROGRESS</span>
                        <strong>${this.currentStepIndex + 1} / ${this.steps.length}</strong>
                    </span>
                    <h2 class="step-title">${stepName}</h2>
                </header>
                
                <div class="instruction-body">
                    <p>${locale[stepKey + '_DESC'] || 'Follow standard protocol for ' + stepKey}</p>
                </div>
            </div>
        `;
    },

    navigate(delta, locale) {
        const next = this.currentStepIndex + delta;
        if (next >= 0 && next < this.steps.length) {
            this.currentStepIndex = next;
            this.render(locale);
        }
    }
};