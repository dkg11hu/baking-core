export const Driver = {
    currentIndex: 0,
    steps: [],

    start(id, ssot, locale) {
        const entity = ssot.registry[id];
        
        // 1. Get the reference to the technology (e.g., "TECH_SCALD")
        const techRefs = entity.technology_ref || [];
        
        // 2. Flatten steps from all associated technologies
        this.steps = [];
        techRefs.forEach(ref => {
            const techData = ssot.technologies[ref];
            if (techData && techData.steps) {
                // Convert the steps object into an array for the stepper
                Object.entries(techData.steps).forEach(([stepKey, stepValues]) => {
                    this.steps.push({
                        id: stepKey,
                        ...stepValues
                    });
                });
            }
        });

        if (this.steps.length === 0) {
            console.warn(`No technology steps found for ${id}`);
            return;
        }

        this.currentIndex = 0;
        this.render(locale);
    },

    render(locale) {
        const step = this.steps[this.currentIndex];
        const screen = document.querySelector('.screen-content');
        
        // The video path now comes from the technology definition
        const videoPath = step.video || '';
        const stepLabel = locale[step.id] || step.id;

        screen.innerHTML = `
            <div class="media-container">
                <video src="${videoPath}" autoplay loop muted playsinline
                       onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                </video>
                <div class="fallback-ui" style="display:none; height:200px; background:#111; justify-content:center; align-items:center; color:#555; flex-direction:column;">
                    <div class="artisan-loader"></div>
                    <span style="margin-top:10px">TECH: ${step.id}</span>
                </div>
            </div>
            <div class="content-stage">
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