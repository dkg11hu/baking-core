export const MediaHelper = {
    getFallbackSVG(label = "Baking Core") {
        const svg = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
                <rect width='100' height='100' fill='#1a1a1a'/>
                <circle cx='50' cy='45' r='20' stroke='#f1c40f' stroke-width='2' fill='none' opacity='0.4'/>
                <path d='M35 65 L50 35 L65 65' stroke='#f1c40f' stroke-width='3' fill='none'/>
                <text x='50%' y='85%' text-anchor='middle' fill='#888' font-size='6' font-family='monospace' letter-spacing='1'>
                    ${label.toUpperCase()}
                </text>
            </svg>`.trim();
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    },

    safeImage(url, altLabel) {
        // If path is missing or too short, use SVG
        if (!url || url.length < 3) return this.getFallbackSVG(altLabel);
        return url;
    }
};