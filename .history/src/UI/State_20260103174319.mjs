export const State = {
    ssot: null,
    locale: null,
    isInitialized: false,

    async init() {
        if (this.isInitialized) return;

        try {
            // Using 'data/...' (relative to index.html) 
            // This is the most robust way to hit a root-level folder.
            const [defRes, locRes] = await Promise.all([
                fetch('data/definitions.json'),
                fetch('data/en.json')
            ]);

            if (!defRes.ok) throw new Error(`definitions.json not found (Status: ${defRes.status})`);
            if (!locRes.ok) throw new Error(`en.json not found (Status: ${locRes.status})`);

            const ssotData = await defRes.json();
            const localeData = await locRes.json();

            // Strict logic-blind assignment
            this.ssot = ssotData;
            this.locale = localeData;
            this.isInitialized = true;
            
            console.log("✅ SSoT Loaded successfully.");
        } catch (err) {
            this.isInitialized = false;
            console.error("❌ State Init Error:", err.message);
            
            // Auto-Injection of visual debugger
            const errorDiv = document.createElement('div');
            errorDiv.style = "position:fixed; top:0; left:0; background:#200; color:#f66; padding:20px; z-index:9999; font-family:monospace; width:100%;";
            errorDiv.innerHTML = `
                <strong>DATA LOAD FAILURE:</strong> ${err.message}<br>
                Current Path: ${window.location.href}<br>
                Attempted: ${window.location.origin}/data/definitions.json
            `;
            document.body.appendChild(errorDiv);
        }
    }
};