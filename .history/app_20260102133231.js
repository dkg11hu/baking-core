import { GraphResolver } from './src/Graph/Core/Resolver.mjs';
import { Calculator } from './src/Graph/Logic/Calculator.mjs';

let ssot, locale, currentProcess, currentStepIdx = 0;

async function boot() {
    try {
        const [ssotRes, localeRes] = await Promise.all([
            fetch('./data/Store/Registry/definitions.json'),
            fetch('./data/Store/Locale/en.json')
        ]);

        if (!ssotRes.ok || !localeRes.ok) throw new Error("Database files not found.");

        ssot = await ssotRes.json();
        locale = await localeRes.json();

        renderFilterChips();
        renderGallery(); // Initial view: Visual Tiles
        
        console.log("Visual Engine Initialized.");
    } catch (err) {
        console.error("Boot failed:", err);
    }
}

// #1: INTUITIVE FILTERING (Industry Standard Chips)
function renderFilterChips() {
    const chipContainer = document.getElementById('filter-chips');
    if (!chipContainer) return;

    // Dynamically gather unique industry_tags from registry
    const tags = new Set(['ALL']);
    Object.values(ssot.registry).forEach(item => {
        if (item.industry_tags) item.industry_tags.forEach(t => tags.add(t));
    });

    chipContainer.innerHTML = Array.from(tags).map(tag => `
        <button class="chip ${tag === 'ALL' ? 'active' : ''}" 
                onclick="filterByTag('${tag}')">${tag}</button>
    `).join('');
}

// #2: PHOTO TILE BROWSING
window.filterByTag = (tag) => {
    // Update active UI state
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.innerText === tag));
    renderGallery(tag);
};

function renderGallery(filterTag = 'ALL') {
    const grid = document.getElementById('tile-grid');
    const products = Object.entries(ssot.registry).filter(([_, item]) => {
        const isProcess = item.type === 'BRANCH';
        const matchesTag = filterTag === 'ALL' || item.industry_tags?.includes(filterTag);
        return isProcess && matchesTag;
    });

    grid.innerHTML = products.map(([id, data]) => `
        <div class="tile" onclick="startWorkflow('${id}')" 
             style="background-image: url('${data.ui_features?.tile_photo || ''}')">
            <div class="tile-label">
                <strong>${locale[id] || id}</strong>
            </div>
        </div>
    `).join('');
}

// #3: DETAILED WORKFLOW DRIVER (Stepwise)
window.startWorkflow = async (id) => {
    currentProcess = { id, ...ssot.registry[id] };
    currentStepIdx = 0;

    // Toggle Mobile Views
    document.getElementById('browser-view').classList.add('hidden');
    document.getElementById('workflow-view').classList.remove('hidden');

    updateWorkflowUI();
};

window.changeStep = (delta) => {
    const sequence = currentProcess.ui_features.workflow_sequence;
    const nextIdx = currentStepIdx + delta;
    
    if (nextIdx >= 0 && nextIdx < sequence.length) {
        currentStepIdx = nextIdx;
        updateWorkflowUI();
    } else if (nextIdx < 0) {
        // Go back to Gallery
        document.getElementById('browser-view').classList.remove('hidden');
        document.getElementById('workflow-view').classList.add('hidden');
    }
};

function updateWorkflowUI() {
    const sequence = currentProcess.ui_features.workflow_sequence;
    const stepKey = sequence[currentStepIdx];
    const video = currentProcess.ui_features.video_ref;
    const photo = currentProcess.ui_features.tile_photo;

    const mediaStage = document.getElementById('media-stage');
    const description = document.getElementById('step-description');

    // Logic-Blind Media Selector
    if (video && currentStepIdx === 0) { // Show video on first/relevant steps
        mediaStage.innerHTML = `<video src="${video}" controls autoplay muted loop></video>`;
    } else {
        mediaStage.innerHTML = `<img src="${photo}" alt="Step image">`;
    }

    description.innerHTML = `
        <small>${currentProcess.id} • Step ${currentStepIdx + 1} of ${sequence.length}</small>
        <h2>${locale[stepKey] || stepKey}</h2>
    `;
}

boot();