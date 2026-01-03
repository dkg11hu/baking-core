// src/UI/State.mjs
export const State = {
    ssot: null,
    locale: null,
    isInitialized: false,

    async init() {
        if (this.isInitialized) return;

        try {
            // The precise path discovered via 'find'
            const [defRes, locRes] = await Promise.all([
                fetch('/data/Store/Registry/definitions.json'),
                fetch('/data/en.json') 
            ]);

            if (!defRes.ok) throw new Error(`definitions.json not found at ${defRes.url}`);
            if (!locRes.ok) throw new Error(`en.json not found at ${locRes.url}`);

            this.ssot = await defRes.json();
            this.locale = await locRes.json();
            this.isInitialized = true;
            
            console.log("✅ SSoT Loaded from Registry folder.");
        } catch (err) {
            this.isInitialized = false;
            console.error("❌ State Init Error:", err.message);
        }
    }
};