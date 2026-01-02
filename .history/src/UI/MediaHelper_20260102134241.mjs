export const MediaHelper = {
    // Default SVG Placeholder
    getFallbackSVG(label = "Baking Core") {
        const svg = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' style='background:#222;'>
                <rect width='100' height='100' fill='#2a2a2a'/>
                <path d='M30 70 L50 30 L70 70' stroke='#f1c40f' stroke-width='4' fill='none' opacity='0.5'/>
                <text x='50%' y='85%' text-anchor='middle' fill='#555' font-size='8' font-family='sans-serif'>
                    ${label}
                </text>
            </svg>`;
        return `data:image/svg+xml;base64,${btoa(svg)}`;
    },

    // Centralized Image Handler with Fallback
    safeImage(url, altLabel) {
        if (!url || url.trim() === "") return this.getFallbackSVG(altLabel);
        return url;
    }
};