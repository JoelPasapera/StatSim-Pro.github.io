// ========================================
// ARSENAL DE PROXIES CORS — módulo dedicado (separa los proxies de la lógica).
// Provee una lista extensa de proxies CORS públicos Y un sistema de SALUD que
// reordena dinámicamente: los que responden suben al frente, los que fallan
// bajan. Así una búsqueda usa primero lo que está vivo y rápido, en vez de
// recorrer una lista estática gigante de endpoints muertos.
//
// Cada proxy se describe con:
//   build(url)  → URL del proxy que envuelve la URL objetivo
//   mode        → 'raw' (devuelve el cuerpo tal cual) | 'json' (cuerpo en JSON)
//   jsonField   → si mode==='json', campo del que extraer el HTML
//   needsEncode → si la URL objetivo debe ir percent-encoded
// ========================================

const ProxiesCORS = {

    // ---- Arsenal (orden inicial; la salud lo reordena en caliente) ----
    LISTA: [
        { id: 'allorigins-raw',   build: u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,        mode: 'raw' },
        { id: 'allorigins-get',   build: u => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,         mode: 'json', jsonField: 'contents' },
        { id: 'corsproxy-io',     build: u => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,                   mode: 'raw' },
        { id: 'codetabs',         build: u => `https://api.codetabs.com/v1/proxy/?quest=${u}`,                        mode: 'raw' },
        { id: 'thingproxy',       build: u => `https://thingproxy.freeboard.io/fetch/${u}`,                           mode: 'raw' },
        { id: 'corsproxy-org',    build: u => `https://corsproxy.org/?${encodeURIComponent(u)}`,                      mode: 'raw' },
        { id: 'whateverorigin',   build: u => `https://www.whateverorigin.org/get?url=${encodeURIComponent(u)}`,      mode: 'json', jsonField: 'contents' },
        { id: 'cors-anywhere-hf', build: u => `https://cors-anywhere.herokuapp.com/${u}`,                             mode: 'raw' },
        { id: 'proxy-cors-sh',    build: u => `https://proxy.cors.sh/${u}`,                                           mode: 'raw' },
        { id: 'yacdn',            build: u => `https://yacdn.org/proxy/${u}`,                                         mode: 'raw' },
        { id: 'crossorigin-me',   build: u => `https://crossorigin.me/${u}`,                                          mode: 'raw' },
        { id: 'jsonp-afeld',      build: u => `https://jsonp.afeld.me/?url=${encodeURIComponent(u)}`,                 mode: 'raw' },
        { id: 'cors-bridged',     build: u => `https://cors.bridged.cc/${u}`,                                         mode: 'raw' },
        { id: 'test-cors',        build: u => `https://test.cors.workers.dev/?${u}`,                                  mode: 'raw' },
        { id: 'cors1-deno',       build: u => `https://cors1.deno.dev/${u}`,                                          mode: 'raw' },
        { id: 'cors-eu-org',      build: u => `https://cors.eu.org/${u}`,                                             mode: 'raw' },
        { id: 'allorigins-hexlet',build: u => `https://allorigins.hexlet.app/raw?url=${encodeURIComponent(u)}`,      mode: 'raw' }
    ],

    // ---- Salud persistente (localStorage no está disponible en artifacts del
    // chat, pero sí en el sitio desplegado; se degrada a memoria si falla) ----
    _mem: {},
    _CLAVE: 'statsim_proxy_health',

    _cargarSalud() {
        try {
            const raw = (typeof localStorage !== 'undefined') && localStorage.getItem(this._CLAVE);
            this._mem = raw ? JSON.parse(raw) : {};
        } catch (e) { this._mem = {}; }
        return this._mem;
    },
    _guardarSalud() {
        try { if (typeof localStorage !== 'undefined') localStorage.setItem(this._CLAVE, JSON.stringify(this._mem)); }
        catch (e) { /* memoria solamente */ }
    },

    // Puntaje: tasa de éxito reciente con bonus de velocidad y penalización por
    // fallos consecutivos. Proxies sin historial parten neutros (0.5).
    _score(id) {
        const h = this._mem[id];
        if (!h || (h.ok + h.fail) === 0) return 0.5;
        const tasa = h.ok / (h.ok + h.fail);
        const vel = h.msProm ? Math.max(0, 1 - h.msProm / 15000) : 0; // 0..1
        const castigo = Math.min(0.4, (h.rachaFail || 0) * 0.1);
        return tasa * 0.7 + vel * 0.3 - castigo;
    },

    registrar(id, exito, ms) {
        const h = this._mem[id] || (this._mem[id] = { ok: 0, fail: 0, msProm: 0, rachaFail: 0 });
        if (exito) {
            h.ok++; h.rachaFail = 0;
            h.msProm = h.msProm ? Math.round(h.msProm * 0.7 + ms * 0.3) : ms;
        } else { h.fail++; h.rachaFail = (h.rachaFail || 0) + 1; }
        this._guardarSalud();
    },

    // Lista ordenada por salud (mejor primero), excluyendo opcionalmente los
    // que llevan demasiados fallos seguidos.
    ordenados(maxRachaFail = 6) {
        if (!Object.keys(this._mem).length) this._cargarSalud();
        return this.LISTA
            .filter(p => ((this._mem[p.id] || {}).rachaFail || 0) < maxRachaFail)
            .map(p => ({ p, s: this._score(p.id) }))
            .sort((a, b) => b.s - a.s)
            .map(x => x.p);
    },

    // Extrae el HTML de la respuesta según el modo del proxy.
    async extraer(proxy, resp) {
        if (proxy.mode === 'json') {
            const j = await resp.json();
            return (proxy.jsonField ? j[proxy.jsonField] : j) || '';
        }
        return resp.text();
    },

    estado() {
        return this.LISTA.map(p => ({ id: p.id, score: +this._score(p.id).toFixed(2), ...(this._mem[p.id] || {}) }));
    }
};

if (typeof window !== 'undefined') {
    window.ProxiesCORS = ProxiesCORS;
    ProxiesCORS._cargarSalud();
}
