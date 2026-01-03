// src/UI/State.mjs
export const State = {
    ssot: null,
    locale: null,
    isInitialized: false,

    async init() {
        if (this.isInitialized) return;

        try {
            // Use relative paths: ./data/...
            const [defRes, locRes] = await Promise.all([
                fetch('./data/definitions.json'),
                fetch('./data/en.json')
            ]);

            // If either fails, stop and alert
            if (!defRes.ok || !locRes.ok) {
                throw new Error(`CRITICAL: Data files missing from server. Status: ${defRes.status}`);
            }

            this.ssot = await defRes.json();
            this.locale = await locRes.json();
            this.isInitialized = true;
            
            console.log("SSoT Loaded: Registry has", Object.keys(this.ssot.registry).length, "items.");
        } catch (err) {
            this.isInitialized = false;
            console.error("State Init Error:", err);
            // Visual feedback so you aren't staring at a black screen
            document.body.innerHTML = `
                <div style="background:#200; color:#f88; padding:20px; font-family:sans-serif;">
                    <h3>System Offline</h3>
                    <p>${err.message}</p>
                    <small>Check if <b>/data/definitions.json</b> exists in your root folder.</small>
                </div>`;
        }
    }
};