export const Driver = {
    currentIndex: 0,
    steps: [],

    start(id, ssot, locale) {
        const entity = ssot.registry[id];
        const techRefs = entity.technology_ref || [];
        
        // Traverse Technologies -> Steps
        this.steps = [];
        techRefs.forEach(ref => {
            const techData = ssot.technologies[ref];
            if (techData && techData.steps) {
                Object.entries(techData.steps).forEach(([key, val]) => {
                    this.steps.push({ id: key, ...val });
                });
            }
        });

        if (this.steps.length === 0) return console.error("No steps found");

        this.currentIndex = 0;
        this.render(locale);
    },

    render(locale) {
        const step = this.steps[this.currentIndex];
        const screen = document.querySelector('.screen-content');
        
        // Path pulled directly from definitions.json 'video' field
        const videoPath = step.video || '';
        const stepLabel = locale[step.id] || step.id;

        screen.innerHTML = `
            <div class="media-container">
                <video src="${videoPath}" autoplay loop muted playsinline
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                </video>
                <div class="fallback-ui" style="display:none;">
                    <div class="artisan-loader"></div>
                    <span>TECH PREVIEW: ${step.id}</span>
                </div>
            </div>
            <div class="content-stage">
                <div class="step-indicator">STEP ${this.currentIndex + 1} OF ${this.steps.length}</div>
                <h2>${stepLabel}</h2>
                <div class="tool-tags">
                    ${(step.tools || []).map(tool => `<span class="tag">${locale[tool] || tool}</span>`).join('')}
                </div>
            </div>
            <div class="stepper-controls">
                <button class="btn-nav" onclick="window.changeStep(-1)">BACK</button>
                <button class="btn-nav primary" onclick="window.changeStep(1)">
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