export const WorkflowExecution = {
    steps: [], // Will store objects: { id: "step_boil", tech: "TECH_SCALD", data: {...} }
    currentStepIndex: 0,
    activeId: null,

    start(manifest, ssot, locale) {
        const product = ssot.registry[manifest.id];
        if (!product || !product.technology_ref) {
            this.renderError(`SSoT: No technology_ref for ${manifest.id}`);
            return;
        }

        this.activeId = manifest.id;
        this.currentStepIndex = 0;
        this.steps = [];

        // Dynamic SSoT Mapping: Flattening technologies into a linear workflow
        product.technology_ref.forEach(techKey => {
            const tech = ssot.technologies[techKey];
            if (tech && tech.steps) {
                Object.entries(tech.steps).forEach(([stepId, stepData]) => {
                    this.steps.push({
                        id: stepId,
                        techKey: techKey,
                        ...stepData
                    });
                });
            }
        });

        if (this.steps.length === 0) {
            this.renderError("SSoT: Workflow empty after tech resolution.");
            return;
        }

        this.render(locale);
    },

    render(locale) {
        const container = document.getElementById('execution-root');
        const step = this.steps[this.currentStepIndex];
        if (!step) return;

        // Fieldnames from DB: step.video, step.tools, step.techKey
        const stepName = locale[step.id] || step.id.replace('step_', '').toUpperCase();
        const techName = locale[step.techKey] || step.techKey;

        container.innerHTML = `
            <div class="execution-wrapper">
                <header class="step-header">
                    <div class="meta-row">
                        <span class="meta-chip"><span>TRACK</span><strong>${techName}</strong></span>
                        <button class="restart-btn" onclick="window.restartApp()">✕ RESTART</button>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((this.currentStepIndex + 1) / this.steps.length) * 100}%"></div>
                    </div>
                    <h2 class="step-title">${stepName}</h2>
                </header>

                <div class="media-container">
                    ${step.video ? `<video src="${step.video}" autoplay loop muted playsinline></video>` : ''}
                </div>

                <div class="instruction-card">
                    <div class="tool-list">
                        ${step.tools?.map(t => `<span class="tool-tag">${locale[t] || t}</span>`).join('') || ''}
                    </div>
                </div>
            </div>`;
    },

    renderError(msg) {
        document.getElementById('execution-root').innerHTML = `
            <div class="error-screen">
                <p style="color: #ff4444;">${msg}</p>
                <button class="btn-nav primary" onclick="window.restartApp()">BACK TO START</button>
            </div>`;
    },

    navigate(delta, locale) {
        this.currentStepIndex += delta;
        this.render(locale);
    }
};