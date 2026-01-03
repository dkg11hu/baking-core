export const WorkflowExecution = {
    steps: [],
    currentIndex: 0,
    manifest: null,

    start(manifest, ssot, locale) {
        this.manifest = manifest;
        this.currentIndex = 0;
        const root = document.getElementById('execution-root');
        root.classList.remove('hidden');

        const entity = ssot.registry[manifest.id];
        const refs = Array.isArray(entity.technology_ref) ? entity.technology_ref : [entity.technology_ref];
        
        this.steps = refs.flatMap(ref => 
            Object.entries(ssot.technologies[ref]?.steps || {}).map(([k, v]) => ({ id: k, ...v }))
        );

        this.render(locale);
    },

    render(locale) {
        const step = this.steps[this.currentIndex];
        
        // Video Stage
        document.getElementById('media-stage').innerHTML = `
            <video src="${step.video}" autoplay loop muted playsinline 
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            </video>
            <div class="media-fallback" style="display:none;">
                <span>ASSET PENDING: ${step.id}</span>
            </div>`;

        // Metadata Header (Locked Values)
        const metaHTML = Object.entries(this.manifest.values).map(([key, val]) => `
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
        if (this.currentIndex < 0) location.reload();
        if (this.currentIndex >= this.steps.length) location.reload();
        this.render(locale);
    }
};