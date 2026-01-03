export const State = {
    ssot: null,
    locale: null,
    isInitialized: false,

    async init() {
        if (this.isInitialized) return;

        try {
            // Attempt to fetch from the root data directory
            const [defRes, locRes] = await Promise.all([
                fetch('./data/definitions.json'),
                fetch('./data/en.json')
            ]);

            if (!defRes.ok) throw new Error(`definitions.json not found at ${defRes.url}`);
            if (!locRes.ok) throw new Error(`en.json not found at ${locRes.url}`);

            this.ssot = await defRes.json();
            this.locale = await locRes.json();
            this.isInitialized = true;
            
            console.log("✅ SSoT Loaded successfully.");
        } catch (err) {
            this.isInitialized = false;
            console.error("❌ State Init Error:", err.message);
            
            // Helpful UI Overlay for debugging paths
            document.body.innerHTML = `
                <div style="background:#1a0000; color:#ff4444; padding:40px; font-family:monospace; height:100vh;">
                    <h2>DATA LOAD FAILURE (404)</h2>
                    <p>The browser is looking for your data here:</p>
                    <ul>
                        <li>${window.location.origin}/data/definitions.json</li>
                        <li>${window.location.origin}/data/en.json</li>
                    </ul>
                    <p><b>Solution:</b> Ensure your "data" folder is in the root directory of your project.</p>
                </div>`;
        }
    }
};