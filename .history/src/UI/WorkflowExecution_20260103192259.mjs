/**
 * WorkflowExecution.mjs
 * FAIL-SAFE VERSION: Defaults to 'Offline', upgrades to Video only if found.
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

        // Flatten Tech Steps
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

    render(locale) {
        const container = document.getElementById('execution-root');
        const step = this.steps[this.currentStepIndex];
        if (!container || !step) return;

        // 1. Text Content
        const techName = locale[step.techKey] || step.techKey;
        const stepName = locale[step.id] || step.id.replace('step_', '').toUpperCase();
        const stepDesc = locale[`${step.id}_DESC`] || `Execute protocol for ${stepName}.`;
        const filename = step.video ? step.video.split('/').pop() : 'None';

        // 2. Render UI with DEFAULT OFFLINE SLATE
        // We do NOT put the <video> tag in yet. We assume it's missing.
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

                <div class="media-stage" id="media-stage-${this.currentStepIndex}">
                    <div class="media-fallback">
                        <div class="fallback-icon">🎬</div>
                        <span>MEDIA OFFLINE</span>
                        <small>${step.video ? filename : 'PROCEDURAL'}</small>
                    </div>
                </div>

                <div class="instruction-card">
                    <p class="instruction-text">${stepDesc}</p>
                    <div class="tool-list">
                        ${step.tools?.map(t => `<span class="tool-tag">${locale[t] || t}</span>`).join('') || ''}
                    </div>
                </div>
            </div>`;

        // 3. Background Enhancement
        // Try to load the video. If successful, inject it into the DOM.
        if (step.video) {
            this.attemptVideoLoad(step.video, `media-stage-${this.currentStepIndex}`);
        }
    },

    attemptVideoLoad(url, containerId) {
        const video = document.createElement('video');
        video.src = url;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.className = 'active-media';

        // Event: If metadata loads, the file exists. Swap it in.
        video.onloadedmetadata = () => {
            const stage = document.getElementById(containerId);
            if (stage) {
                stage.innerHTML = ''; // Clear the "Offline" slate
                stage.appendChild(video); // Inject the video
                console.log("✅ Video Loaded:", url);
            }
        };

        // Event: If it fails, do nothing. The "Offline" slate is already there.
        video.onerror = () => {
            // Console will still show 404 (Browser requirement), but UI is safe.
        };
    },

    navigate(delta, locale) {
        const next = this.currentStepIndex + delta;
        if (next >= 0 && next < this.steps.length) {
            this.currentStepIndex = next;
            this.render(locale);
        }
    }
};