export const Driver = {
    currentIndex: 0,
    steps: [],

    start(id, ssot, locale) {
        const entity = ssot.registry[id];
        const techRefs = entity.technology_ref || [];
        
        this.steps = [];
        techRefs.forEach(ref => {
            const techData = ssot.technologies[ref];
            if (techData?.steps) {
                Object.entries(techData.steps).forEach(([key, val]) => {
                    this.steps.push({ id: key, ...val });
                });
            }
        });

        if (this.steps.length === 0) return;
        this.currentIndex = 0;
        this.render(locale);
    },

render(locale) {
    const step = this.steps[this.currentIndex];
    const screen = document.querySelector('.screen-content');
    
    const videoSrc = step.video || '';
    // FIX: Fallback to step.id only if locale[step.id] is missing
    const stepTitle = locale[step.id] || step.id.replace('step_', '').toUpperCase();

    screen.innerHTML = `
        <div class="media-container">
            <video src="${videoSrc}" autoplay loop muted playsinline 
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            </video>
            <div class="media-fallback" style="display:none;">
                <div class="visualizer-icon"><div class="pulse-ring"></div><div class="inner-dot"></div></div>
                <div class="fallback-text-group">
                    <span class="tech-id">${step.id}</span>
                    <span class="status-msg">ASSET PENDING</span>
                </div>
            </div>
        </div>

        <div class="instruction-stage">
            <div class="step-meta">STEP ${this.currentIndex + 1} OF ${this.steps.length}</div>
            <h2 class="step-title">${stepTitle}</h2>
            <div class="tool-tray">
                ${(step.tools || []).map(t => `<span class="tool-pill">${locale[t] || t}</span>`).join('')}
            </div>
        </div>

        <div class="stepper-controls">
            <button class="nav-btn secondary" onclick="window.changeStep(-1)">BACK</button>
            <button class="nav-btn primary" onclick="window.changeStep(1)">
                ${this.currentIndex === this.steps.length - 1 ? 'FINISH' : 'NEXT'}
            </button>
        </div>
    `;
}
