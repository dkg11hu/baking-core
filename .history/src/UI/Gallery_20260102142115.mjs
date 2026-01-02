import { MediaHelper } from './MediaHelper.mjs';

export const Gallery = {
    render(ssot, locale) {
        const chipContainer = document.getElementById('filter-chips');
        const tags = new Set(['ALL']);
        Object.values(ssot.registry).forEach(item => {
            if (item.industry_tags) item.industry_tags.forEach(t => tags.add(t));
        });

        chipContainer.innerHTML = Array.from(tags).map(tag => `
            <button class="chip ${tag === 'ALL' ? 'active' : ''}" 
                    onclick="filterByTag('${tag}')">${tag}</button>
        `).join('');

        this.filter('ALL', ssot, locale);
    },

    filter(tag, ssot, locale) {
        const grid = document.getElementById('tile-grid');
        document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.innerText === tag));

        const products = Object.entries(ssot.registry).filter(([_, item]) => {
            return item.type === 'BRANCH' && (tag === 'ALL' || item.industry_tags?.includes(tag));
        });

        grid.innerHTML = products.map(([id, data]) => {
            const fallback = MediaHelper.getFallbackSVG(id);
            const imgUrl = MediaHelper.safeImage(data.ui_features?.tile_photo, id);
            return `
                <div class="tile" onclick="startWorkflow('${id}')">
                    <img src="${imgUrl}" onerror="this.src='${fallback}'; this.onerror=null;">
                    <div class="tile-label"><strong>${locale[id] || id}</strong></div>
                </div>
            `;
        }).join('');
    }
};