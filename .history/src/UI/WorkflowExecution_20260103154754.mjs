export const WorkflowExecution = {
    steps: [],
    currentIndex: 0,
    lockedData: null,

    // Workflow #2 Entry Point
    start(manifest, ssot, locale) {
        this.lockedData = manifest;
        this.currentIndex = 0;
        
        const entity = ssot.registry[manifest.id];
        const refs = Array.isArray(entity.technology_ref) ? entity.technology_ref : [entity.technology_ref];
        
        // Locked Step Compilation
        this.steps = refs.flatMap(ref => 
            Object.entries(ssot.technologies[ref]?.steps || {}).map(([k, v]) => ({ id: k, ...v }))
        );

        this.render(locale);
    },

    render(locale) {
        const step = this.steps[this.currentIndex];
        
        // Render Video
        document.getElementById('media-stage').innerHTML = `
            <video src="${step.video}" autoplay loop muted playsinline></video>
        `;

        // Render Frozen Parameters (Workflow #1 results) in the Header
        const metaHTML = Object.entries(this.lockedData.parameters.values).map(([key, val]) => `
            <div class="meta-chip">
                <span>${locale[key] || key}</span>
                <strong>${val}</strong>
            </div>
        `).join('');

        document.getElementById('step-metadata').innerHTML = metaHTML;
        document.getElementById('step-description').innerHTML = `
            <h2 class="step-title">${locale[step.id] || step.id}</h2>
        `;
    },

    navigate(delta, locale) {
        this.currentIndex += delta;
        if (this.currentIndex < 0) {
            // Re-open Workflow #1 (Unlock)
            window.openDiscovery(); 
            return;
        }
        if (this.currentIndex >= this.steps.length) {
            location.reload();
            return;
        }
        this.render(locale);
    }
};