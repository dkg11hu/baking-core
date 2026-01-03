/**
 * WorkflowExecution.mjs
 * Handles the step-by-step bake process.
 * Resilient to missing video files (404s).
 */
export const WorkflowExecution = {
    steps: [],
    currentStepIndex: 0,
    activeId: null,

    start(manifest, ssot, locale) {
        const product = ssot.registry[manifest.id];
        
        // Safety: If product or tech refs are missing, stop.
        if (!product || !product.technology_ref) {
            console.warn(`SSoT: No technology_ref found for ${manifest.id}`);
            return;
        }

        this.activeId = manifest.id;
        this.currentStepIndex = 0;
        this.steps = [];

        // 1. FLATTEN TECHNOLOGIES
        // Combines steps from 'TECH_SCALD', 'TECH_LEAVENED_BASE', etc.
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

        // Locale Lookups
        const stepName = locale[step.id] || step.id.replace('step_', '').toUpperCase();
        const techName = locale[step.techKey] || step.techKey;
        const stepDesc = locale[`${step.id}_DESC`] || `Execute protocol for ${stepName}.`;

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
                        <video src="${step.video}" autoplay loop muted playsinline 
                               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        </video>
                        <div class="media-placeholder">
                            <span>MEDIA OFFLINE</span>
                            <small>${step.video.split('/').pop()}</small>
                        </div>
                    ` : '<div class="media-placeholder">PROCEDURAL STEP (NO VIDEO)</div>'}
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
        const next = this.currentStepIndex + delta;
        if (next >= 0 && next < this.steps.length) {
            this.currentStepIndex = next;
            this.render(locale);
        }
    }
};