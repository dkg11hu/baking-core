export const MapSelection = {
    /**
     * Renders a high-visibility SVG map optimized for the iPhone XS viewport.
     * Hits are larger than the visual paths to account for mobile thumb accuracy.
     */
    render() {
        return `
            <div class="map-container" id="view-map">
                <svg viewBox="0 0 400 180" class="interactive-map" xmlns="http://www.w3.org/2000/svg">
                    <rect width="400" height="180" fill="#080808" rx="12"/>
                    
                    <g stroke="#1a1a1a" stroke-width="0.5">
                        <line x1="0" y1="60" x2="400" y2="60" />
                        <line x1="0" y1="120" x2="400" y2="120" />
                        <line x1="133" y1="0" x2="133" y2="180" />
                        <line x1="266" y1="0" x2="266" y2="180" />
                    </g>

                    <path id="EUROPE" 
                          d="M160,30 L220,30 L230,80 L170,100 Z" 
                          class="map-region" 
                          onclick="window.filterByTerritory('EUROPE')"/>
                    
                    <path id="ASIA" 
                          d="M270,40 L350,40 L360,110 L280,130 Z" 
                          class="map-region" 
                          onclick="window.filterByTerritory('ASIA')"/>

                    <circle id="JAPAN" 
                            cx="370" cy="75" r="8" 
                            class="map-region" 
                            onclick="window.filterByTerritory('JAPAN')"/>
                    
                    <rect id="ALL" 
                          x="20" y="140" width="80" height="25" rx="5" 
                          class="map-region" 
                          onclick="window.filterByTerritory('ALL')"/>
                    
                    <text x="30" y="157" fill="#666" font-size="10" font-family="monospace" pointer-events="none">GLOBAL</text>
                </svg>
                <div id="active-territory-label">Select Origin</div>
            </div>
        `;
    }
};