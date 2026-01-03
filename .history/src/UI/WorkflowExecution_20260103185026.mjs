export const WorkflowExecution = {
    steps: [],
    currentStepIndex: 0,
    activeManifest: null,

    start(manifest, ssot, locale) {
        const container = document.getElementById('execution-root');
        if (!container) return;

        this.activeManifest = manifest;
        const product = ssot.registry[manifest.id];

        // SSoT Fieldname: "process_flow" or "workflow_steps"
        this.steps = product.process_flow || []; 
        this.currentStepIndex = 0;

        this.render(locale);
    },

    render(locale) {
        const container = document.getElementById('execution-root');
        const stepKey = this.steps[this.currentStepIndex];
        
        // Dynamic labels from SSoT Locale
        const stepName = locale[stepKey] || stepKey;
        const stepDesc = locale[`${stepKey}_DESC`] || "No instruction found in DB.";

        container.innerHTML = `
            <div class="execution-wrapper">
                <header class="step-header">
                    <div class="meta-row">
                        <span class="meta-chip"><span>PRODUCT</span><strong>${this.activeManifest.id}</strong></span>
                        <button class="restart-btn" onclick="window.restartApp()">✕ RESTART</button>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((this.currentStepIndex + 1) / this.steps.length) * 100}%"></div>
                    </div>
                    <h2 class="step-title">${stepName}</h2>
                </header>

                <div class="instruction-card">
                    <p class="instruction-text">${stepDesc}</p>
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