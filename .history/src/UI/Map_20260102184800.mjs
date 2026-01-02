export const MapSelection = {
    render() {
        return `
            <div class="map-wrapper">
                <svg viewBox="0 0 400 200" class="selection-map">
                    <rect width="400" height="200" fill="#0a0a0a" rx="15"/>
                    
                    <path id="EUROPE" d="M160,40 L210,40 L220,90 L170,100 Z" 
                          class="map-region" onclick="filterByTerritory('EUROPE')"/>
                    
                    <path id="ASIA" d="M250,50 L350,50 L360,120 L260,130 Z" 
                          class="map-region" onclick="filterByTerritory('ASIA')"/>
                          
                    <circle id="JAPAN" cx="370" cy="80" r="10" 
                            class="map-region" onclick="filterByTerritory('JAPAN')"/>

                    <rect id="GLOBAL" x="10" y="160" width="60" height="20" rx="5"
                          class="map-region" onclick="filterByTerritory('ALL')"/>
                </svg>
                <div id="active-territory-label">WORLDWIDE SELECTION</div>
            </div>
        `;
    }
};