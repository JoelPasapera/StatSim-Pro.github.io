// ========================================
// ETIQUETAS DE VARIABLES (estilo "variable labels" de SPSS)
// Las columnas del dataset conservan su nombre técnico (Total_IC, PC_IE…)
// para no romper nada; la interfaz y los textos muestran la etiqueta humana
// ("Inteligencia Cognitiva"). El simulador registra aquí las etiquetas y la
// estructura de pruebas al generar; con datos importados por CSV simplemente
// no hay etiquetas y todo cae al nombre de columna (comportamiento anterior).
// ========================================

const EtiquetasVariables = {
    _mapa: {},        // { nombreColumna: etiqueta }
    _estructura: [],  // [{ prueba, columnaGeneral, etiquetaGeneral, dimensiones: [{columna, etiqueta}] }]

    // Registra el diccionario de etiquetas y la estructura de pruebas.
    fijar(mapa, estructura) {
        this._mapa = mapa || {};
        this._estructura = estructura || [];
    },

    limpiar() {
        this._mapa = {};
        this._estructura = [];
    },

    // Etiqueta humana de una columna; si no existe, devuelve la columna tal cual.
    etiqueta(columna) {
        return this._mapa[columna] || columna;
    },

    // Texto para desplegables: "Etiqueta (columna)" cuando hay etiqueta.
    etiquetaConColumna(columna) {
        const et = this.etiqueta(columna);
        return et === columna ? columna : `${et} (${columna})`;
    },

    tieneEtiquetas() {
        return Object.keys(this._mapa).length > 0;
    },

    // Estructura de pruebas (para el análisis por dimensiones).
    estructura() {
        return this._estructura;
    },

    // Devuelve la prueba cuya escala general es esta columna (o null).
    pruebaConGeneral(columna) {
        return this._estructura.find(p => p.columnaGeneral === columna) || null;
    },

    // ----------------------------------------
    // EDITOR DE ETIQUETAS (solo para bases de datos EXTERNAS)
    // Con datos del simulador las etiquetas llegan solas y este editor no se
    // muestra; con un CSV externo permite renombrar las variables a mano.
    // ----------------------------------------

    mostrarEditor(idContenedor, columnas, alAplicar) {
        const cont = document.getElementById(idContenedor);
        if (!cont) return;

        const filas = columnas.map(col => `
            <tr>
                <td><code>${col}</code></td>
                <td>
                    <input type="text" class="input input-sm" data-columna="${col}"
                        value="${(this._mapa[col] && this._mapa[col] !== col) ? this._mapa[col] : ''}"
                        placeholder="Ej: Inteligencia emocional" maxlength="120">
                </td>
            </tr>
        `).join('');

        cont.innerHTML = `
            <div class="card">
                <details>
                    <summary style="cursor: pointer; font-weight: 700; padding: 0.25rem 0;">
                        ✏️ Renombrar variables (etiquetas) — opcional
                    </summary>
                    <p class="help-text" style="margin-top: 0.5rem;">
                        Asigna un nombre legible a cada columna (Ej: <code>Total_IE</code> →
                        "Inteligencia emocional"). Las etiquetas se usarán en la pregunta, objetivos,
                        hipótesis, resultados y discusión; los datos no se modifican. Deja vacío lo
                        que no quieras renombrar.
                    </p>
                    <div class="table-container">
                        <table class="table">
                            <thead><tr><th>Columna</th><th>Etiqueta (nombre completo)</th></tr></thead>
                            <tbody>${filas}</tbody>
                        </table>
                    </div>
                    <button type="button" id="btnAplicarEtiquetas" class="btn btn-primary" style="margin-top: 0.5rem;">
                        Aplicar etiquetas
                    </button>
                </details>
            </div>
        `;
        cont.style.display = 'block';

        const self = this;
        const btn = document.getElementById('btnAplicarEtiquetas');
        if (btn) {
            btn.addEventListener('click', function () {
                const mapa = {};
                cont.querySelectorAll('input[data-columna]').forEach(input => {
                    const etiqueta = input.value.trim();
                    if (etiqueta) mapa[input.getAttribute('data-columna')] = etiqueta;
                });
                // Base externa: hay etiquetas pero no estructura de pruebas
                self.fijar(mapa, []);
                if (typeof alAplicar === 'function') alAplicar();
            });
        }
    },

    ocultarEditor(idContenedor) {
        const cont = document.getElementById(idContenedor);
        if (!cont) return;
        cont.innerHTML = '';
        cont.style.display = 'none';
    }
};

if (typeof window !== 'undefined') {
    window.EtiquetasVariables = EtiquetasVariables;
}
