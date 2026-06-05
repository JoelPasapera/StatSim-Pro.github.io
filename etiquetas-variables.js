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
    }
};

if (typeof window !== 'undefined') {
    window.EtiquetasVariables = EtiquetasVariables;
}
