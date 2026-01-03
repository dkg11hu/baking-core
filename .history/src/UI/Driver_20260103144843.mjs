export const Driver = {
    currentIndex: -1, // -1 = Gateway Choice
    steps: [],
    activeId: null,

    start(id, ssot, locale) {
        this.activeId = id;
        this.currentIndex = -1;
        
        // Compile workflow steps from technologies
        const entity = ssot.registry[id];
        this.steps = (entity.technology_ref || []).flatMap(ref => 
            Object.entries(ssot.technologies[ref]?.steps || {}).map(([k, v]) => ({ id: k, ...v }))
        );

        this.showView('workflow-view');
        this.render(locale);
    },

    render(locale) {
        const stage = document.getElementById('workflow-view');
        
        if (this.currentIndex === -1) {
            this.renderGateway(locale);
        } else {
            this.renderWorkflow(locale);
        }
    },

    renderGateway(locale) {
        const stage = document.getElementById('workflow-view');
        const name = locale[this.activeId] || this.activeId;

        stage.innerHTML = `
            <div class="gateway-screen">
                <span class="breadcrumb">GLOBAL SELECTION</span>
                <h1 class="step-title">${name}</h1>
                
                <div class="choice-container">
                    <button class="choice-card" onclick="window.viewFavorites()">
                        <div class="icon">★</div>
                        <div>
                            <strong>FAVORITES / HISTORY</strong>
                            <span>Sorted by frequency & timestamp</span>
                        </div>
                    </button>

                    <button class="choice-card highlight" onclick="window.changeStep(1)">
                        <div class="icon">➔</div>
                        <div>
                            <strong>START WORKFLOW</strong>
                            <span>Step-by-step technical driver</span>
                        </div>
                    </button>
                </div>
            </div>`;
    },

    renderWorkflow(locale) {
        const step = this.steps[this.currentIndex];
        const title = locale[step.id] || step.id;
        
        // Update DOM elements defined in your index.html
        document.getElementById('media-stage').innerHTML = `
            <video src="${step.video}" autoplay loop muted playsinline 
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            </video>
            <div class="media-fallback" style="display:none; height:240px; justify-content:center; align-items:center; background:#111; flex-direction:column; gap:10px;">
                <div class="artisan-loader"></div>
                <span style="color:#444; font-size:10px;">ASSET PENDING: ${step.id}</span>
            </div>`;

        document.getElementById('step-metadata').innerHTML = `<span class="step-meta">STEP ${this.currentIndex + 1} OF ${this.steps.length}</span>`;
        document.getElementById('step-description').innerHTML = `<h2 class="step-title">${title}</h2>`;
    },

    move(delta, locale) {
        this.currentIndex += delta;
        if (this.currentIndex < -1) { this.showView('browser-view'); return; }
        if (this.currentIndex >= this.steps.length) { location.reload(); return; }
        this.render(locale);
    },

    showView(viewId) {
        document.getElementById('browser-view').classList.toggle('hidden', viewId !== 'browser-view');
        document.getElementById('workflow-view').classList.toggle('hidden', viewId !== 'workflow-view');
    }
};