export const MapSelection = {
    render() {
        return `
            <div class="map-container">
                <svg viewBox="0 0 400 180" class="interactive-map">
                    <rect width="400" height="180" fill="#0a0a0a" rx="10"/>
                    
                    <path id="EUROPE" d="M170,40 L210,40 L220,80 L180,90 Z" 
                          class="map-region" onclick="window.filterByTerritory('EUROPE')"/>
                    
                    <path id="ASIA" d="M260,50 L340,50 L350,110 L270,120 Z" 
                          class="map-region" onclick="window.filterByTerritory('ASIA')"/>

                    <circle cx="30" cy="150" r="15" 
                            class="map-region" onclick="window.filterByTerritory('ALL')"/>
                </svg>
                <div id="active-territory-label">WORLDWIDE SELECTION</div>
            </div>
        `;
    }
};