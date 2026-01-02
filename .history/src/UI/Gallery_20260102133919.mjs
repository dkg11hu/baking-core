export const Gallery = {
    render(ssot, locale) {
        const grid = document.getElementById('tile-grid');
        const chips = document.getElementById('filter-chips');
        
        // Render Chips (Industry Tags)
        const tags = new Set(['ALL']);
        Object.values(ssot.registry).forEach(i => i.industry_tags?.forEach(t => tags.add(t)));
        chips.innerHTML = Array.from(tags).map(t => `<button class="chip" onclick="filterByTag('${t}')">${t}</button>`).join('');

        // Render Tiles
        this.filter('ALL', ssot, locale);
    },

    filter(tag, ssot, locale) {
        const grid = document.getElementById('tile-grid');
        const items = Object.entries(ssot.registry).filter(([_, data]) => 
            data.type === 'BRANCH' && (tag === 'ALL' || data.industry_tags?.includes(tag))
        );

        grid.innerHTML = items.map(([id, data]) => `
            <div class="tile" onclick="startWorkflow('${id}')" style="background-image: url('${data.ui_features.tile_photo}')">
                <div class="tile-label">${locale[id] || id}</div>
            </div>
        `).join('');
    }
};