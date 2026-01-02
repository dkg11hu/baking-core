export const MediaHelper = {
    /**
     * @param {string} url - The path from definitions.json
     * @param {string} id - The Database ID (e.g., PROD_YUDANE)
     */
    safeImage(url, id) {
        // If the database field is empty or path is too short
        if (!url || url.length < 5) return this.getFallbackSVG(id);
        
        // Return the URL (The browser's onerror will handle physical 404s)
        return url.toLowerCase();
    },

    getFallbackSVG(label = "Baking Core") {
        const svg = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
                <rect width='100' height='100' fill='#121212'/>
                <path d='M30 70 L50 30 L70 70' stroke='#f1c40f' stroke-width='2' fill='none' opacity='0.5'/>
                <text x='50%' y='85%' text-anchor='middle' fill='#555' font-size='6' font-family='monospace' letter-spacing='1'>
                    ${label.toUpperCase()}
                </text>
            </svg>`.trim();
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }
};