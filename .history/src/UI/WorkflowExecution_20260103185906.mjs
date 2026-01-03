export const WorkflowExecution = {
    steps: [],
    currentStepIndex: 0,
    activeId: null,

    start(manifest, ssot, locale) {
        const productData = ssot.registry[manifest.id];
        
        // SSoT VALIDATION: If the product doesn't exist or has no workflow, do not proceed.
        if (!productData || !productData.process_flow) {
            console.error(`❌ SSoT Failure: No process_flow found for ${manifest.id}`);
            return;
        }

        this.activeId = manifest.id;
        this.steps = productData.process_flow; // Strictly from DB
        this.currentStepIndex = 0;

        this.render(locale);
    },

    render(locale) {
        const container = document.getElementById('execution-root');
        const stepKey = this.steps[this.currentStepIndex];

        // PREVENT UNDEFINED: If the index is out of bounds, stop rendering.
        if (!stepKey) return;

        const productName = locale[this.activeId] || this.activeId;
        const stepName = locale[stepKey] || stepKey;
        const stepDesc = locale[`${stepKey}_DESC`] || `Check definitions.json for key: ${stepKey}`;

        container.innerHTML = `
            <div class="execution-wrapper">
                <header class="step-header">
                    <div class="meta-row">
                        <span class="meta-chip"><span>PRODUCT</span><strong>${productName}</strong></span>
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
            </div>`;
    },

    navigate(delta, locale) {
        const next = this.currentStepIndex + delta;
        if (next >= 0 && next < this.steps.length) {
            this.currentStepIndex = next;
            this.render(locale);
        }
    }
};