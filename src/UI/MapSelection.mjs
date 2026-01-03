export const MapSelection = {
    render() {
        const container = document.getElementById('view-map');
        if (!container) return;

        // Note: Using bright colors (Gold/White) for visibility on OLED
        container.innerHTML = `
            <svg viewBox="0 0 100 100" class="interactive-map" style="width: 100%; height: 100%;">
                <circle cx="50" cy="50" r="48" fill="#111" stroke="#333" stroke-width="1" />
                
                <text x="50" y="50" text-anchor="middle" fill="#666" font-size="6" font-weight="bold">SELECT REGION</text>
                
                <g onclick="window.filterByTerritory('EUROPE')" style="cursor: pointer;">
                    <circle cx="30" cy="40" r="14" fill="rgba(241, 196, 15, 0.15)" stroke="#f1c40f" stroke-width="0.5"/>
                    <text x="30" y="40" dy="1.5" text-anchor="middle" fill="#fff" font-size="4" pointer-events="none">EUROPE</text>
                </g>

                <g onclick="window.filterByTerritory('ASIA')" style="cursor: pointer;">
                    <circle cx="70" cy="40" r="14" fill="rgba(241, 196, 15, 0.15)" stroke="#f1c40f" stroke-width="0.5"/>
                    <text x="70" y="40" dy="1.5" text-anchor="middle" fill="#fff" font-size="4" pointer-events="none">ASIA</text>
                </g>

                <g onclick="window.filterByTerritory('ALL')" style="cursor: pointer;">
                    <circle cx="50" cy="75" r="14" fill="#f1c40f" />
                    <text x="50" y="75" dy="1.5" text-anchor="middle" fill="#000" font-size="4" font-weight="900" pointer-events="none">ALL</text>
                </g>
            </svg>
        `;
    }
};