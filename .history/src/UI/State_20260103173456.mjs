// src/UI/State.mjs
export const State = {
    ssot: null,
    locale: null,
    isInitialized: false,

    async init() {
        if (this.isInitialized) return; // Prevent redundant network calls
        
        try {
            const [defRes, locRes] = await Promise.all([
                fetch('./data/definitions.json'),
                fetch('./data/en.json')
            ]);
            
            this.ssot = await defRes.json();
            this.locale = await locRes.json();
            
            // Logic-blind fetch for specific products
            await this.loadRegistryDetails();
            
            this.isInitialized = true;
            console.log("SSoT Sanitized & Locked.");
        } catch (err) {
            console.error("State Init Error:", err);
        }
    }
};