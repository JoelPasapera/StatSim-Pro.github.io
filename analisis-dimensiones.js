// ========================================
// ANÁLISIS POR DIMENSIONES (objetivos específicos)
// Responde los objetivos específicos correlacionales de una tesis: cada
// dimensión de una prueba frente a la variable general de la otra.
// - La ESTRUCTURA (qué dimensiones pertenecen a qué prueba) la aporta el
//   simulador vía EtiquetasVariables; con CSV externo se usa el mecanismo
//   legado del analizador si fue configurado.
// - El CÁLCULO lo hace AnalizadorEstadistico.calcularCorrelacion (normalidad
//   por par → Pearson/Spearman automático, igual que el análisis principal).
// - La REDACCIÓN sale de InterpretacionesEstadisticas (fuente única de prosa).
// ========================================

const AnalisisDimensiones = {

    // Punto de entrada. Devuelve true si renderizó (hay estructura aplicable).
    mostrar(var1, var2, tipoPrueba, unidadAnalisis, lugarContexto) {
        const container = document.getElementById('resultadosDimensiones');
        if (!container) return false;

        const E = (typeof EtiquetasVariables !== 'undefined') ? EtiquetasVariables : null;
        if (!E) return false;

        // Bloques de análisis: si var1 es la escala general de una prueba con
        // dimensiones, sus dimensiones se correlacionan con var2; y viceversa.
        const bloques = [];
        const p1 = E.pruebaConGeneral(var1);
        const p2 = E.pruebaConGeneral(var2);
        if (p1 && p1.dimensiones.length) bloques.push({ prueba: p1, columnaObjetivo: var2 });
        if (p2 && p2.dimensiones.length) bloques.push({ prueba: p2, columnaObjetivo: var1 });
        if (bloques.length === 0) return false;

        const contexto = (unidadAnalisis && lugarContexto)
            ? ` en ${unidadAnalisis} de ${lugarContexto}`
            : '';

        let html = `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">🎯 Objetivos Específicos: Correlaciones por Dimensiones</h3>
                </div>
                <p class="help-text">Cada tabla responde a los objetivos específicos del estudio: la relación de cada
                dimensión con la variable general correspondiente. El método (Pearson o Spearman) se decide por par,
                según la normalidad de ambas variables involucradas.</p>
        `;

        bloques.forEach(bloque => {
            html += this._renderBloque(bloque, tipoPrueba, contexto);
        });

        html += `</div>`;
        container.innerHTML = html;
        container.style.display = 'block';
        return true;
    },

    // Un bloque = las dimensiones de una prueba frente a una variable objetivo.
    _renderBloque(bloque, tipoPrueba, contexto) {
        const I = InterpretacionesEstadisticas;
        const E = EtiquetasVariables;
        const etObjetivo = E.etiqueta(bloque.columnaObjetivo);
        const verbos = I._VERBOS_CORRELACIONALES;

        // Calcular cada par (con tolerancia a fallos por dimensión)
        const filas = [];
        bloque.prueba.dimensiones.forEach((dim, idx) => {
            let resultado = null, error = null;
            try {
                resultado = AnalizadorEstadistico.calcularCorrelacion(dim.columna, bloque.columnaObjetivo, tipoPrueba);
            } catch (e) {
                error = e.message;
            }
            filas.push({ dim, idx, resultado, error });
        });

        let html = `
            <div class="result-box" style="margin-top: 1rem;">
                <h4>${bloque.prueba.etiquetaGeneral ? `Dimensiones de ${bloque.prueba.etiquetaGeneral}` : bloque.prueba.prueba} → ${etObjetivo}</h4>
                <ol style="margin: 0.5rem 0 1rem 1.25rem;">
        `;
        filas.forEach((f, i) => {
            const verbo = verbos[i % verbos.length];
            html += `<li>${verbo} la relación entre la dimensión ${f.dim.etiqueta} de ${bloque.prueba.etiquetaGeneral} y ${etObjetivo}${contexto}.</li>`;
        });
        html += `</ol>
                <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Dimensión</th><th>n</th><th>Método</th><th>Coeficiente</th>
                            <th>p-valor</th><th>IC 95%</th><th>Magnitud</th><th>Decisión</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        const filasResumen = [];
        filas.forEach(f => {
            if (f.error || !f.resultado) {
                html += `<tr><td>${f.dim.etiqueta}</td><td colspan="7">No se pudo calcular: ${f.error || 'sin resultado'}</td></tr>`;
                return;
            }
            const r = f.resultado;
            const esSp = I._esSpearman(r.tipoCorrelacion);
            const sig = r.pValor < 0.05;
            const ic = r.intervaloConfianza;
            const icTxt = (ic && Number.isFinite(ic.inferior)) ? `[${ic.inferior.toFixed(3)}, ${ic.superior.toFixed(3)}]` : '—';
            filasResumen.push({
                etiquetaDimension: f.dim.etiqueta,
                coeficiente: r.coeficiente,
                pValor: r.pValor,
                significativa: sig,
                fuerza: r.interpretacion.fuerza,
                tipoCorrelacion: r.tipoCorrelacion
            });
            html += `
                <tr>
                    <td><strong>${f.dim.etiqueta}</strong></td>
                    <td>${r.n}</td>
                    <td>${esSp ? 'Spearman (ρ)' : 'Pearson (r)'}</td>
                    <td><strong>${r.coeficiente.toFixed(3)}</strong></td>
                    <td>${I._fmtP(r.pValor)}</td>
                    <td>${icTxt}</td>
                    <td>${r.interpretacion.fuerza} (${r.interpretacion.direccion})</td>
                    <td>${sig ? '✅ Significativa' : '➖ No significativa'}</td>
                </tr>
            `;
        });

        html += `</tbody></table></div>`;

        // Interpretación individual por dimensión (plegable, reutiliza la prosa central)
        filas.forEach(f => {
            if (f.error || !f.resultado) return;
            const texto = I.generarInterpretacionCorrelacion(
                `la dimensión ${f.dim.etiqueta}`, etObjetivo, f.resultado
            );
            html += `
                <details style="margin: 0.5rem 0;">
                    <summary style="cursor: pointer; font-weight: 600;">Interpretación — ${f.dim.etiqueta} ↔ ${etObjetivo}</summary>
                    <p style="margin: 0.5rem 0 0;">${texto}</p>
                </details>
            `;
        });

        // Síntesis profesional del bloque
        if (filasResumen.length > 0) {
            html += `
                <div class="result-box" style="margin-top: 0.75rem; background: var(--color-bg-secondary);">
                    <strong>Síntesis del bloque:</strong>
                    <p style="margin: 0.4rem 0 0;">${I.generarResumenDimensiones(etObjetivo, filasResumen)}</p>
                </div>
            `;
        }

        html += `</div>`;
        return html;
    }
};

if (typeof window !== 'undefined') {
    window.AnalisisDimensiones = AnalisisDimensiones;
}
