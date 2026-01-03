/**
 * WorkflowExecution.mjs
 * SSoT-driven execution with 404 resilience.
 */
export const WorkflowExecution = {
    steps: [],
    currentStepIndex: 0,
    activeId: null,

    start(manifest, ssot, locale) {
        const product = ssot.registry[manifest.id];
        // SSoT Guard: Stop if data is missing
        if (!product || !product.technology_ref) {
            console.error(`SSoT Error: No technology_ref for ${manifest.id}`);
            return;
        }

        this.activeId = manifest.id;
        this.currentStepIndex = 0;
        this.steps = [];

        // Flatten Tech Steps
        product.technology_ref.forEach(techKey => {
            const tech = ssot.technologies[techKey];
            if (tech?.steps) {
                Object.entries(tech.steps).forEach(([stepId, stepData]) => {
                    this.steps.push({ id: stepId, techKey, ...stepData });
                });
            }
        });

        this.render(locale);
    },

    render(locale) {
        const container = document.getElementById('execution-root');
        const step = this.steps[this.currentStepIndex];
        if (!container || !step) return;

        // Labels
        const techName = locale[step.techKey] || step.techKey;
        const stepName = locale[step.id] || step.id.replace('step_', '').toUpperCase();
        const stepDesc = locale[`${step.id}_DESC`] || `Execute protocol for ${stepName}.`;
        // Safe filename extraction for the error message
        const filename = step.video ? step.video.split('/').pop() : 'No File';

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

                <div class="media-stage">
                    ${step.video ? `
                        <video 
                            src="${step.video}" 
                            autoplay loop muted playsinline 
                            class="active-media"
                            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        </video>
                        
                        <div class="media-fallback" style="display: none;">
                            <div class="fallback-icon">🎬</div>
                            <span>MEDIA OFFLINE</span>
                            <small>${filename}</small>
                        </div>
                    ` : `
                        <div class="media-fallback" style="display: flex;">
                            <span>PROCEDURAL STEP</span>
                        </div>
                    `}
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