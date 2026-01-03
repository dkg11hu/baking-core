/**
 * WorkflowExecution.mjs
 * Offline-First Architecture: 
 * Renders "Media Offline" slate by default. 
 * Only upgrades to video if the file successfully loads in the background.
 */
export const WorkflowExecution = {
    steps: [],
    currentStepIndex: 0,
    activeId: null,

    start(manifest, ssot, locale) {
        const product = ssot.registry[manifest.id];
        
        // SSoT Guard
        if (!product || !product.technology_ref) {
            console.error(`SSoT Error: No technology_ref for ${manifest.id}`);
            return;
        }

        this.activeId = manifest.id;
        this.currentStepIndex = 0;
        this.steps = [];

        // Flatten Technologies into a single step list
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

        // Labels
        const techName = locale[step.techKey] || step.techKey;
        const stepName = locale[step.id] || step.id.replace('step_', '').toUpperCase();
        const stepDesc = locale[`${step.id}_DESC`] || `Execute protocol for ${stepName}.`;
        const filename = step.video ? step.video.split('/').pop() : 'None';

        // 1. RENDER UI WITH DEFAULT OFFLINE SLATE
        // We do NOT add the <video> tag yet. We assume it fails.
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

        // 2. BACKGROUND CHECK (Progressive Enhancement)
        // If a video URL exists, try to load it silently.
        if (step.video) {
            this.attemptVideoLoad(step.video, `media-stage-${this.currentStepIndex}`);
        }
    },

    attemptVideoLoad(url, containerId) {
        // Create a detached video element to test the URL
        const video = document.createElement('video');
        video.src = url;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.className = 'active-media';

        // SUCCESS: File found. Swap the slate for the player.
        video.onloadedmetadata = () => {
            const stage = document.getElementById(containerId);
            if (stage) {
                stage.innerHTML = ''; // Remove "Media Offline" slate
                stage.appendChild(video); // Insert real video
            }
        };

        // FAILURE: File missing (404). Do nothing. 
        // The user continues seeing the "Media Offline" slate we already rendered.
        video.onerror = () => {
            // Browser will log 404, but UI remains stable.
        };
    }
};