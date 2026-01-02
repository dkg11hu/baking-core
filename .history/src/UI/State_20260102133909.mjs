export const State = {
    ssot: null,
    locale: null,
    currentId: null,
    currentStepIdx: 0,

    async init() {
        const [sRes, lRes] = await Promise.all([
            fetch('./data/Store/Registry/definitions.json'),
            fetch('./data/Store/Locale/en.json')
        ]);
        this.ssot = await sRes.json();
        this.locale = await lRes.json();
        return { ssot: this.ssot, locale: this.locale };
    }
};