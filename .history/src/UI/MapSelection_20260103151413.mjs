export const MapSelection = {
    render() {
        return `
            <div class="map-wrapper">
                <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                    <rect width="800" height="400" fill="transparent" onclick="window.filterByTerritory('ALL')"></rect>
                    
                    <path id="EU" class="map-region" d="M400 100 L450 100 L450 150 Z" onclick="window.filterByTerritory('EU')"></path>
                    <path id="AM" class="map-region" d="M100 100 L200 100 L200 300 Z" onclick="window.filterByTerritory('AM')"></path>
                </svg>
                <div class="map-hint">TAP REGION OR BACKGROUND FOR GLOBAL</div>
            </div>
        `;
    }
};