/**
 * WorkflowExecution (Track 2)
 * Manages the step-by-step baking process.
 */
export const WorkflowExecution = {
    steps: [],
    currentStepIndex: 0,

    start(manifest, ssot, locale) {
        // Logic-blind: Pulling steps from the product's formula
        const entity = ssot.registry[manifest.id];
        // Ensure we target 'execution-root' as per your HTML
        const container = document.getElementById('execution-root');
        
        if (!container) {
            console.error("❌ Execution target 'execution-root' not found in DOM");
            return;
        }

        // Mocking steps based on database logic
        this.steps = ["Prepare Ingredients", "Autolyse", "Bulk Ferment", "Shape", "Bake"];
        this.currentStepIndex = 0;
        this.render();
    },

    render() {
        const container = document.getElementById('execution-root');
        if (!container) return;

        const stepName = this.steps[this.currentStepIndex];

        container.innerHTML = `
            <div class="execution-wrapper">
                <div class="step-header">
                    <span class="breadcrumb">STEP ${this.currentStepIndex + 1} OF ${this.steps.length}</span>
                    <h2 class="step-title" style="color: #fff;">${stepName}</h2>
                </div>
                <div class="step-body">
                    </div>
            </div>
        `;
    },

    navigate(delta) {
        const next = this.currentStepIndex + delta;
        if (next >= 0 && next < this.steps.length) {
            this.currentStepIndex = next;
            this.render();
        }
    }
};