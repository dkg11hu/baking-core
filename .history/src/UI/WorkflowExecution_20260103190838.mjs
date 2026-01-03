/**
 * WorkflowExecution.mjs
 * SSoT-driven execution track with 404-resilience.
 */
export const WorkflowExecution = {
    steps: [],
    currentStepIndex: 0,
    activeId: null,

    start(manifest, ssot, locale) {
        const product = ssot.registry[manifest.id];
        if (!product || !product.technology_ref) return;

        this.activeId = manifest.id;
        this.currentStepIndex = 0;
        this.steps = [];

        // Dynamic SSoT Mapping: Build step array from referenced technologies
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

        this.render(locale);
    },

    render(locale) {
        const container = document.getElementById('execution-root');
        const step = this.steps[this.currentStepIndex];
        if (!container || !step) return;

        const stepName = locale[step.id] || step.id.replace('step_', '').toUpperCase();
        const techName = locale[step.techKey] || step.techKey;
        const stepDesc = locale[`${step.id}_DESC`] || `Follow protocol for ${stepName}.`;

        container.innerHTML = `
            <div class="execution-wrapper">
                <header class="step-header">
                    <div class="meta-row">
                        <span class="meta-chip"><span>TECH</span><strong>${techName}</strong></span>
                        <button class="restart-btn" onclick="window.restartApp()">✕ RESTART</button>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((this.currentStepIndex + 1) / this.steps.length) * 100}%"></div>
                    </div>
                    <h2 class="step-title">${stepName}</h2>
                </header>

                <div class="media-stage">
                    ${step.video ? `
                        <video src="${step.video}" autoplay loop muted playsinline 
                               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        </video>
                        <div class="media-placeholder">NO VIDEO DATA AVAILABLE</div>
                    ` : '<div class="media-placeholder">PROCEDURAL STEP</div>'}
                </div>

                <div class="instruction-card">
                    <p class="instruction-text">${stepDesc}</p>
                    <div class="tool-list">
                        ${step.tools?.map(t => `<span class="tool-tag">${locale[t] || t}</span>`).join('') || ''}
                    </div>
                </div>
            </div>`;
    },

    navigate(delta, locale) {
        this.currentStepIndex += delta;
        this.render(locale);
    }
};