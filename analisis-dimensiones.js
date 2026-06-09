// ========================================
// ANÁLISIS POR DIMENSIONES (objetivos específicos BASADOS EN LOS DATOS)
// Flujo: (1) se arman TODOS los pares candidatos dimensión ↔ variable general;
// (2) CribaCorrelaciones los evalúa de forma vectorizada (normalidad por
// columna → Pearson/Spearman, |r|); (3) solo los pares con |r| ≥ umbral,
// ordenados de mayor a menor y hasta un máximo configurado, se convierten en
// objetivos específicos y reciben el análisis completo del motor validado
// (AnalizadorEstadistico.calcularCorrelacion) y la prosa central
// (InterpretacionesEstadisticas).
// ========================================

const AnalisisDimensiones = {

    _cacheCriba: { clave: null, criba: null },

    // Construye los pares candidatos a partir de la estructura del simulador.
    _candidatos(var1, var2) {
        const E = (typeof EtiquetasVariables !== 'undefined') ? EtiquetasVariables : null;
        const candidatos = [];
        const agregar = (prueba, columnaObjetivo) => {
            const etObjetivo = E.etiqueta(columnaObjetivo);
            prueba.dimensiones.forEach(dim => {
                candidatos.push({
                    columnaX: dim.columna,
                    columnaY: columnaObjetivo,
                    etiquetaX: dim.etiqueta,
                    etiquetaY: etObjetivo,
                    pruebaDeX: prueba.etiquetaGeneral || prueba.prueba
                });
            });
        };
        const p1 = E ? E.pruebaConGeneral(var1) : null;
        const p2 = E ? E.pruebaConGeneral(var2) : null;
        // PRIORIDAD 1 (obligatorios): dimensión ↔ escala general de la otra prueba
        if (p1 && p1.dimensiones.length) agregar(p1, var2);
        if (p2 && p2.dimensiones.length) agregar(p2, var1);
        candidatos.forEach(c => { c.prioridad = 1; c.tipoPar = 'general-dim'; });
        // PRIORIDAD 2 (relleno hasta el máximo): dimensión ↔ dimensión entre pruebas
        if (p1 && p2 && p1.dimensiones.length && p2.dimensiones.length) {
            p1.dimensiones.forEach(d1 => {
                p2.dimensiones.forEach(d2 => {
                    candidatos.push({
                        columnaX: d1.columna,
                        columnaY: d2.columna,
                        etiquetaX: d1.etiqueta,
                        etiquetaY: d2.etiqueta,
                        pruebaDeX: p1.etiquetaGeneral || p1.prueba,
                        pruebaDeY: p2.etiquetaGeneral || p2.prueba,
                        prioridad: 2,
                        tipoPar: 'dim-dim'
                    });
                });
            });
        }
        // FALLBACK PARA BASES EXTERNAS (sin estructura del simulador): se
        // reconstruyen los candidatos desde las columnas de escala. Se prefieren
        // los prefijos nuevos (Dimension_); si la base es antigua, se usan las
        // columnas Total_. En ambos casos se trata como "dimensiones" a las
        // escalas que NO son las dos variables seleccionadas, y cada una se
        // contrasta con ambas (prioridad 1) y entre sí (prioridad 2); la criba
        // decide con los datos. La pertenencia dimensión→prueba no es deducible
        // del nombre, así que se omite en la redacción.
        if (candidatos.length === 0) {
            const datos = (typeof AnalizadorEstadistico !== 'undefined' && AnalizadorEstadistico.obtenerDatos)
                ? (AnalizadorEstadistico.obtenerDatos() || []) : [];
            if (datos.length === 0) return candidatos;
            const cols = Object.keys(datos[0]);

            // Columnas de escala: nuevos prefijos o, si no hay, Total_ (base antigua)
            let escalas = cols.filter(c => /^dimension_/i.test(c) || /^general_/i.test(c));
            if (escalas.length === 0) escalas = cols.filter(c => /^total_/i.test(c));
            if (escalas.length === 0) return candidatos;

            const et = c => E ? E.etiqueta(c) : c;
            const objetivosCols = [var1, var2].filter(Boolean);
            // "dimensiones" = escalas distintas de las dos variables seleccionadas
            const dims = escalas.filter(c => !objetivosCols.includes(c));
            if (dims.length === 0) return candidatos;

            dims.forEach(d => {
                objetivosCols.forEach(o => {
                    if (d === o) return;
                    candidatos.push({
                        columnaX: d, columnaY: o,
                        etiquetaX: et(d), etiquetaY: et(o),
                        prioridad: 1, tipoPar: 'general-dim'
                    });
                });
            });
            for (let i = 0; i < dims.length; i++) {
                for (let j = i + 1; j < dims.length; j++) {
                    candidatos.push({
                        columnaX: dims[i], columnaY: dims[j],
                        etiquetaX: et(dims[i]), etiquetaY: et(dims[j]),
                        prioridad: 2, tipoPar: 'dim-dim'
                    });
                }
            }
        }
        return candidatos;
    },

    // Criba (con caché por par de variables, para que el marco metodológico y
    // el render usen EL MISMO resultado sin recalcular).
    cribarObjetivos(var1, var2) {
        if (typeof CribaCorrelaciones === 'undefined') return null;
        const clave = `${var1}|${var2}`;
        if (this._cacheCriba.clave === clave) return this._cacheCriba.criba;

        const candidatos = this._candidatos(var1, var2);
        if (candidatos.length === 0) return null;

        const criba = CribaCorrelaciones.cribar(
            AnalizadorEstadistico.obtenerDatos() || [],
            candidatos,
            AnalizadorEstadistico
        );
        this._cacheCriba = { clave, criba };
        return criba;
    },

    // Punto de entrada de render. Devuelve true si renderizó.
    mostrar(var1, var2, tipoPrueba, unidadAnalisis, lugarContexto) {
        const container = document.getElementById('resultadosDimensiones');
        if (!container) return false;

        const criba = this.cribarObjetivos(var1, var2);
        if (!criba) return false;

        const I = InterpretacionesEstadisticas;
        const contexto = (unidadAnalisis && lugarContexto)
            ? ` en ${unidadAnalisis} de ${lugarContexto}`
            : '';

        let html = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">🎯 Objetivos Específicos basados en los datos</h3>
                </div>
                <p class="help-text">El programa evaluó TODOS los pares candidatos (normalidad por variable →
                Pearson o Spearman sobre rangos) y seleccionó como objetivos específicos los de mayor correlación
                en valor absoluto, de mayor a menor y hasta un máximo de ${criba.maximo}, garantizando primero los
                pares dimensión ↔ escala general. El umbral |r| ≥ ${criba.umbral.toFixed(2)} (Cohen, 1988) se
                muestra como referencia de relevancia del efecto.</p>
        `;

        // ---- Tabla de criba (transparencia del proceso de selección) ----
        html += `
                <div class="result-box" style="margin-top: 0.75rem;">
                    <h4>Criba de candidatos (n = ${criba.n})</h4>
                    <div class="table-container">
                    <table class="table">
                        <thead><tr>
                            <th>#</th><th>Par evaluado</th><th>Método</th>
                            <th>Coeficiente</th><th>|coef|</th><th>≥ umbral</th><th>Seleccionado</th>
                        </tr></thead>
                        <tbody>
        `;
        criba.evaluados.forEach((e, i) => {
            const abs = Math.abs(e.coeficiente);
            html += `<tr>
                <td>${i + 1}</td>
                <td>${e.etiquetaX} ↔ ${e.etiquetaY}</td>
                <td>${e.valido ? e.metodo : '—'}</td>
                <td>${e.valido ? e.coeficiente.toFixed(3) : 'no calculable'}</td>
                <td>${e.valido ? abs.toFixed(3) : '—'}</td>
                <td>${e.superaUmbral ? '✔' : '✘'}</td>
                <td>${e.seleccionado ? '✅ Objetivo específico' : '—'}</td>
            </tr>`;
        });
        html += `</tbody></table></div>
                 <p style="margin: 0.5rem 0 0;">${I.generarResumenCriba(criba)}</p>
                 </div>`;

        // ---- Análisis completo SOLO de los seleccionados ----
        const verbos = I._VERBOS_CORRELACIONALES;
        criba.seleccionados.forEach((sel, i) => {
            let resultado = null, error = null;
            try {
                // Reporte fino con el motor estadístico validado
                resultado = AnalizadorEstadistico.calcularCorrelacion(sel.columnaX, sel.columnaY, tipoPrueba);
            } catch (e) { error = e.message; }

            const objetivo = I.generarObjetivoDeParSeleccionado(sel, i, contexto);

            html += `
                <div class="result-box" style="margin-top: 1rem;">
                    <h4>Objetivo específico ${i + 1}: ${objetivo}</h4>
            `;
            if (error || !resultado) {
                html += `<p>No se pudo calcular el análisis completo: ${error || 'sin resultado'}</p></div>`;
                return;
            }
            const esSp = I._esSpearman(resultado.tipoCorrelacion);
            const ic = resultado.intervaloConfianza;
            const icTxt = (ic && Number.isFinite(ic.inferior)) ? `[${ic.inferior.toFixed(3)}, ${ic.superior.toFixed(3)}]` : '—';
            const sig = resultado.pValor < 0.05;
            html += `
                    <div class="table-container">
                    <table class="table">
                        <thead><tr>
                            <th>n</th><th>Método</th><th>Coeficiente</th><th>p-valor</th>
                            <th>IC 95%</th><th>Magnitud</th><th>Decisión</th>
                        </tr></thead>
                        <tbody><tr>
                            <td>${resultado.n}</td>
                            <td>${esSp ? 'Spearman (ρ)' : 'Pearson (r)'}</td>
                            <td><strong>${resultado.coeficiente.toFixed(3)}</strong></td>
                            <td>${I._fmtP(resultado.pValor)}</td>
                            <td>${icTxt}</td>
                            <td>${resultado.interpretacion.fuerza} (${resultado.interpretacion.direccion})</td>
                            <td>${sig ? '✅ Significativa' : '➖ No significativa'}</td>
                        </tr></tbody>
                    </table>
                    </div>
                    <details style="margin: 0.5rem 0 0;">
                        <summary style="cursor: pointer; font-weight: 600;">Interpretación profesional</summary>
                        <p style="margin: 0.5rem 0 0;">${I.generarInterpretacionCorrelacion(
                            `la dimensión ${sel.etiquetaX}`, sel.etiquetaY, resultado)}</p>
                    </details>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
        container.style.display = 'block';
        return true;
    }
};

if (typeof window !== 'undefined') {
    window.AnalisisDimensiones = AnalisisDimensiones;
}
