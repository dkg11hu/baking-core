import { MediaHelper } from './MediaHelper.mjs';

export const Gallery = {
    renderTiles(products, locale) {
        const grid = document.getElementById('tile-grid');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(2, 1fr)'; // Strict 2-column layout
        grid.style.gap = '10px';
        grid.style.padding = '10px';

        grid.innerHTML = products.map(([id, data]) => {
            const imgUrl = MediaHelper.safeImage(data.ui_features?.tile_photo, id);
            const fallback = MediaHelper.getFallbackSVG(id);

            return `
                <div class="tile" style="aspect-ratio: 1/1; position: relative; overflow: hidden; border-radius: 12px;">
                    <img src="${imgUrl}" 
                         style="width: 100%; height: 100%; object-fit: cover;"
                         onerror="this.onerror=null; this.src='${fallback}';">
                    <div class="tile-label" style="position: absolute; bottom: 0; width: 100%; padding: 8px; background: rgba(0,0,0,0.6); font-size: 10px;">
                        ${locale[id] || id}
                    </div>
                </div>
            `;
        }).join('');
    }
};