export const MapSelection = {
    render() {
        return `
            <div class="map-container" id="view-map">
                <svg viewBox="0 0 400 180" class="interactive-map">
                    <rect width="400" height="180" fill="#080808" rx="12"/>
                    
                    <path id="EUROPE" 
                          class="map-region" 
                          onmousemove="window.showHelper(event, 'Europe')" 
                          onmouseleave="window.hideHelper()"
                          onclick="window.filterByTerritory('EUROPE')" 
                          d="M160,30 L220,30 L230,80 L170,100 Z" />
                    
                    <path id="ASIA" 
                          class="map-region" 
                          onmousemove="window.showHelper(event, 'Asia')" 
                          onmouseleave="window.hideHelper()"
                          onclick="window.filterByTerritory('ASIA')" 
                          d="M270,40 L350,40 L360,110 L280,130 Z" />
                </svg>
            </div>
        `;
    }
};