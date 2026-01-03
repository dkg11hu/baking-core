export const WorkflowExecution = {
    steps: [],
    currentStepIndex: 0,
    activeId: null,

    start(manifest, ssot, locale) {
        const container = document.getElementById('execution-root');
        if (!container || !ssot.registry[manifest.id]) return;

        this.activeId = manifest.id;
        const productData = ssot.registry[this.activeId];

        // Derived strictly from DB fieldname
        this.steps = productData.process_flow || [];
        this.currentStepIndex = 0;

        this.render(locale);
    },

    render(locale) {
        const container = document.getElementById('execution-root');
        const stepKey = this.steps[this.currentStepIndex];
        
        // Final Fix for Labels: Strict Locale Lookup
        const productName = locale[this.activeId] || this.activeId;
        const stepName = locale[stepKey] || stepKey;
        const stepDesc = locale[`${stepKey}_DESC`] || "Check definitions.json for key: " + stepKey;

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
            </div>
        `;
    },

    navigate(delta, locale) {
        this.currentStepIndex += delta;
        this.render(locale);
    }
};