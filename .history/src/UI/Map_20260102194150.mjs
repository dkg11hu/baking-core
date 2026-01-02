export const MapSelection = {
    render() {
        return `
            <div class="selector-view" id="view-map">
                <svg viewBox="0 0 400 160" class="interactive-map">
                    <rect width="400" height="160" fill="#111" rx="15"/>
                    <path id="EUROPE" d="M160,30 L210,30 L220,80 L170,90 Z" 
                          class="map-region" onclick="window.filterByTerritory('EUROPE')"/>
                    <path id="ASIA" d="M260,40 L340,40 L350,100 L270,110 Z" 
                          class="map-region" onclick="window.filterByTerritory('ASIA')"/>
                    <rect x="10" y="10" width="50" height="20" rx="5" fill="#333" 
                          class="map-region" onclick="window.filterByTerritory('ALL')"/>
                </svg>
                <div class="selector-label">GEOGRAPHIC ORIGIN</div>
            </div>
        `;
    }
};