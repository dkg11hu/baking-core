import { MediaHelper } from './MediaHelper.mjs';

export const Gallery = {
    filter(tag, ssot, locale) {
        const grid = document.getElementById('tile-grid');
        const items = Object.entries(ssot.registry).filter(([_, data]) => 
            data.type === 'BRANCH' && (tag === 'ALL' || data.industry_tags?.includes(tag))
        );

        grid.innerHTML = items.map(([id, data]) => {
            const imgUrl = MediaHelper.safeImage(data.ui_features?.tile_photo, id);
            return `
                <div class="tile" onclick="startWorkflow('${id}')" 
                     style="background-image: url('${imgUrl}')">
                    <div class="tile-label">${locale[id] || id}</div>
                </div>
            `;
        }).join('');
    }
};