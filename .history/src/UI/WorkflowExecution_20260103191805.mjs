/**
 * WorkflowExecution.mjs
 * Final Resilient Version: Checks media existence before rendering to prevent 404s.
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

        // Flatten technologies into a linear sequence
        product.technology_ref.forEach(techKey => {
            const tech = ssot.technologies[techKey];
            if (tech && tech.steps) {
                Object.entries(tech.steps).forEach(([stepId, stepData]) => {
                    this.steps.push({ id: stepId, techKey, ...stepData });
                });
            }
        });

        this.render(locale);
    },

    async render(locale) {
        const container = document.getElementById('execution-root');
        const step = this.steps[this.currentStepIndex];
        if (!container || !step) return;

        // Text & Locale Mapping
        const techName = locale[step.techKey] || step.techKey;
        const stepName = locale[step.id] || step.id.replace('step_', '').toUpperCase();
        const stepDesc = locale[`${step.id}_DESC`] || `Instruction for ${stepName}`;

        // PRE-FLIGHT CHECK: Does the video exist?
        let videoHtml = '';
        if (step.video) {
            try {
                // Try to find the file without fully downloading it
                const response = await fetch(step.video, { method: 'HEAD' });
                if (response.ok) {
                    videoHtml = `
                        <video src="${step.video}" autoplay loop muted playsinline class="active-media"></video>
                    `;
                } else {
                    throw new Error('404');
                }
            } catch (e) {
                // If missing, render fallback IMMEDIATELY (No console 404)
                const filename = step.video.split('/').pop();
                videoHtml = `
                    <div class="media-fallback">
                        <div class="fallback-icon">🎬</div>
                        <span>MEDIA OFFLINE</span>
                        <small>${filename}</small>
                    </div>`;
            }
        } else {
             videoHtml = `<div class="media-fallback"><span>PROCEDURAL STEP</span></div>`;
        }

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
                    ${videoHtml}
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