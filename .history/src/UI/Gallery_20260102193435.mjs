import { MediaHelper } from './MediaHelper.mjs';

export const Gallery = {
    render(ssot, locale) {
        const grid = document.getElementById('tile-grid');
        // Filter for Products (BRANCH nodes)
        const products = Object.entries(ssot.registry).filter(([_, item]) => item.type === 'BRANCH');

        grid.innerHTML = products.map(([id, data]) => {
            const imgUrl = MediaHelper.safeImage(data.ui_features?.tile_photo, id);
            const fallback = MediaHelper.getFallbackSVG(id);

            return `
                <div class="tile" onclick="window.startWorkflow('${id}')">
                    <img src="${imgUrl}" 
                         alt="${id}"
                         onerror="this.onerror=null; this.src='${fallback}';">
                    <div class="tile-label">
                        <strong>${locale[id] || id}</strong>
                    </div>
                </div>
            `;
        }).join('');
    }
};