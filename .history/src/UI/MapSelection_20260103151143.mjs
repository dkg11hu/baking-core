export const MapSelection = {
    render() {
        return `
            <div class="map-container">
                <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" class="interactive-map">
                    <path id="EU" d="M480,120 L520,120 L530,160 L490,180 Z" 
                          class="map-region"
                          onclick="window.filterByTerritory('EU')"
                          onmousemove="window.showHelper(event, 'EUROPE')"
                          onmouseleave="window.hideHelper()">
                    </path>
                    
                    <path id="AM" d="M150,150 L250,150 L280,350 L120,350 Z" 
                          class="map-region"
                          onclick="window.filterByTerritory('AM')"
                          onmousemove="window.showHelper(event, 'AMERICAS')"
                          onmouseleave="window.hideHelper()">
                    </path>

                    <rect width="1000" height="500" fill="transparent" 
                          onclick="window.filterByTerritory('ALL')"
                          onmousemove="window.showHelper(event, 'INTERNATIONAL')">
                    </rect>
                </svg>
                <div class="map-hint">TAP REGION OR BACKGROUND FOR GLOBAL</div>
            </div>
        `;
    }
};