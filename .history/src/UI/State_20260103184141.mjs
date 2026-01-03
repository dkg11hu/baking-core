// src/UI/State.mjs
export const State = {
    ssot: null,
    locale: null,
    isInitialized: false,

    async init() {
        if (this.isInitialized) return;

        try {
            const [defRes, locRes] = await Promise.all([
                fetch('./data/Store/Registry/definitions.json'),
                fetch('./data/Store/Locale/en.json')
            ]);

            if (!defRes.ok) throw new Error(`Definitions missing: ${defRes.status}`);
            if (!locRes.ok) throw new Error(`Locale missing: ${locRes.status}`);

            this.ssot = await defRes.json();
            this.locale = await locRes.json();
            this.isInitialized = true;
            
            console.log("✅ SSoT and Locale loaded from deep storage.");
        } catch (err) {
            this.isInitialized = false;
            console.error("❌ State Init Error:", err.message);
        }
    }
};