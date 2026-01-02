export const MapSelection = {
    render() {
        return `
            <div class="map-container" id="view-map">
                <div id="map-tooltip" class="map-tooltip"></div>

                <svg viewBox="0 0 400 180" class="interactive-map" 
                     onmousemove="window.showMapHelper(event)"
                     onmouseleave="window.hideMapHelper()">
                    
                    <rect width="400" height="180" fill="#080808" rx="12"/>
                    
                    <path id="EUROPE" data-name="Europe" d="M160,30 L220,30 L230,80 L170,100 Z" 
                          class="map-region" onclick="window.filterByTerritory('EUROPE')"/>
                    
                    <path id="ASIA" data-name="Asia" d="M270,40 L350,40 L360,110 L280,130 Z" 
                          class="map-region" onclick="window.filterByTerritory('ASIA')"/>

                    <circle id="JAPAN" data-name="Japan" cx="370" cy="75" r="8" 
                            class="map-region" onclick="window.filterByTerritory('JAPAN')"/>
                    
                    <rect id="ALL" data-name="Worldwide" x="20" y="140" width="80" height="25" rx="5" 
                          class="map-region" onclick="window.filterByTerritory('ALL')"/>
                </svg>
                <div id="active-territory-label">Select Origin</div>
            </div>
        `;
    }
};