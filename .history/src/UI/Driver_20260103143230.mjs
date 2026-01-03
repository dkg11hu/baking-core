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
        
        // Logic-Blind: Source path strictly from database
        const videoSrc = step.video || '';
        const stepName = locale[step.id] || step.id;

        screen.innerHTML = `
            <div class="media-container">
                <video 
                    src="${videoSrc}" 
                    autoplay loop muted playsinline 
                    class="step-video"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                </video>
                
                <div class="media-fallback" style="display:none;">
                    <div class="visualizer-icon">
                        <div class="pulse-ring"></div>
                        <div class="inner-dot"></div>
                    </div>
                    <span class="tech-id">${step.id}</span>
                    <span class="status-msg">ASSET_PENDING</span>
                </div>
            </div>

            <div class="instruction-stage">
                <div class="step-meta">STEP ${this.currentIndex + 1} OF ${this.steps.length}</div>
                <h2>${stepName}</h2>
                <div class="tool-tray">
                    ${(step.tools || []).map(t => `<span class="tool-pill">${locale[t] || t}</span>`).join('')}
                </div>
            </div>

            <div class="stepper-controls">
                <button class="nav-btn" onclick="window.changeStep(-1)">BACK</button>
                <button class="nav-btn primary" onclick="window.changeStep(1)">
                    ${this.currentIndex === this.steps.length - 1 ? 'FINISH' : 'NEXT'}
                </button>
            </div>
        `;
    },

    move(delta, locale) {
        const next = this.currentIndex + delta;
        if (next >= 0 && next < this.steps.length) {
            this.currentIndex = next;
            this.render(locale);
        } else if (next >= this.steps.length) {
            location.reload(); 
        }
    }
};