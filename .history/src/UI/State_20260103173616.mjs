// src/UI/State.mjs
export const State = {
    ssot: null,
    locale: null,
    isInitialized: false,

    async init() {
        if (this.isInitialized) return;

        try {
            // Use './data/...' if data is in the root relative to index.html
            const [defRes, locRes] = await Promise.all([
                fetch('./data/definitions.json'),
                fetch('./data/en.json')
            ]);

            if (!defRes.ok || !locRes.ok) {
                throw new Error(`Fetch failed: ${defRes.status} / ${locRes.status}`);
            }

            this.ssot = await defRes.json();
            this.locale = await locRes.json();
            this.isInitialized = true;
            
            console.log("SSoT Loaded successfully");
        } catch (err) {
            console.error("State Init Error:", err);
            // Block the UI if data is missing
            document.body.innerHTML = `<div style="color:red; padding:20px;">
                Critical Error: Data files not found at /data/. Check server paths.
            </div>`;
        }
    }
};