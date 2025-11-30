// ========================================
// APP PRINCIPAL - COORDINADOR DE INTERFAZ
// ========================================

// ========================================
// NAVEGACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    inicializarApp();
});

function inicializarApp() {
    configurarNavegacion();
    configurarGenerador();
    configurarAnalizador();
}

function configurarNavegacion() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);

            // Actualizar navegación activa
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Mostrar sección correspondiente
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// ========================================
// CONFIGURACIÓN DEL GENERADOR
// ========================================

function configurarGenerador() {
    // Botón agregar prueba
    document.getElementById('btnAgregarPrueba').addEventListener('click', agregarFilaPrueba);

    // Botón agregar sociodemográfico
    document.getElementById('btnAgregarSocio').addEventListener('click', agregarFilaSocio);

    // Botón generar base de datos
    document.getElementById('btnGenerar').addEventListener('click', generarBaseDatos);

    // Botón descargar CSV
    document.getElementById('btnDescargarCSV').addEventListener('click', descargarCSV);

    // Botones importar/exportar pruebas
    document.getElementById('btnImportarPruebas').addEventListener('click', () => {
        document.getElementById('importPruebasInput').click();
    });
    document.getElementById('btnExportarPruebas').addEventListener('click', exportarConfigPruebas);
    document.getElementById('importPruebasInput').addEventListener('change', importarConfigPruebas);

    // Botones importar/exportar sociodemográficos
    document.getElementById('btnImportarSocio').addEventListener('click', () => {
        document.getElementById('importSocioInput').click();
    });
    document.getElementById('btnExportarSocio').addEventListener('click', exportarConfigSocio);
    document.getElementById('importSocioInput').addEventListener('change', importarConfigSocio);

    // Delegación de eventos para botones de eliminar
    document.getElementById('bodyPruebas').addEventListener('click', function (e) {
        if (e.target.closest('.btn-delete')) {
            eliminarFilaPrueba(e.target.closest('tr'));
        }
    });

    document.getElementById('bodySocio').addEventListener('click', function (e) {
        if (e.target.closest('.btn-delete')) {
            eliminarFilaSocio(e.target.closest('tr'));
        }
    });
}

function agregarFilaPrueba() {
    const tbody = document.getElementById('bodyPruebas');
    const nuevaFila = tbody.querySelector('.fila-prueba').cloneNode(true);

    // Limpiar valores
    nuevaFila.querySelectorAll('input').forEach(input => {
        input.value = '';
    });

    tbody.appendChild(nuevaFila);
    mostrarToast('Fila agregada', 'success');
}

function eliminarFilaPrueba(fila) {
    const tbody = document.getElementById('bodyPruebas');
    const filas = tbody.querySelectorAll('.fila-prueba');

    if (filas.length <= 1) {
        mostrarToast('Debe haber al menos una prueba', 'warning');
        return;
    }

    fila.remove();
    mostrarToast('Fila eliminada', 'success');
}

function agregarFilaSocio() {
    const tbody = document.getElementById('bodySocio');
    const nuevaFila = tbody.querySelector('.fila-socio').cloneNode(true);

    // Limpiar valores
    nuevaFila.querySelectorAll('input').forEach(input => {
        input.value = '';
    });

    tbody.appendChild(nuevaFila);
    mostrarToast('Variable agregada', 'success');
}

function eliminarFilaSocio(fila) {
    const tbody = document.getElementById('bodySocio');
    const filas = tbody.querySelectorAll('.fila-socio');

    if (filas.length <= 1) {
        mostrarToast('Debe haber al menos una variable sociodemográfica', 'warning');
        return;
    }

    fila.remove();
    mostrarToast('Variable eliminada', 'success');
}

function generarBaseDatos() {
    try {
        // Recolectar configuración
        generadorDatos.recolectarConfiguracion();

        // Validar
        const validacion = generadorDatos.validarConfiguracion();

        if (validacion.errores.length > 0) {
            mostrarToast('Error: ' + validacion.errores[0], 'error');
            return;
        }

        if (validacion.advertencias.length > 0) {
            console.warn('Advertencias:', validacion.advertencias);
        }

        // Generar datos
        mostrarToast('Generando base de datos...', 'success');

        setTimeout(() => {
            const datos = generadorDatos.generarBaseDatos();
            mostrarPreview(datos);
            habilitarDescargaCSV();
            habilitarUsarGenerados();
            mostrarToast('¡Base de datos generada exitosamente!', 'success');
        }, 300);

    } catch (error) {
        mostrarToast(error.message, 'error');
        console.error(error);
    }
}

function mostrarPreview(datos) {
    const container = document.getElementById('previewContainer');
    const config = generadorDatos.obtenerConfiguracion();

    // Actualizar estadísticas
    document.getElementById('statParticipantes').textContent = datos.length;
    document.getElementById('statVariables').textContent = Object.keys(datos[0]).length;
    document.getElementById('statPruebas').textContent = config.pruebas.length;

    // Crear tabla preview (solo primeras 10 filas)
    const thead = document.getElementById('previewHead');
    const tbody = document.getElementById('previewBody');

    // Limpiar
    thead.innerHTML = '';
    tbody.innerHTML = '';

    // Encabezados
    const columnas = Object.keys(datos[0]);
    const filaEncabezados = document.createElement('tr');
    columnas.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        filaEncabezados.appendChild(th);
    });
    thead.appendChild(filaEncabezados);

    // Datos (máximo 10 filas)
    const maxFilas = Math.min(10, datos.length);
    for (let i = 0; i < maxFilas; i++) {
        const fila = document.createElement('tr');
        columnas.forEach(col => {
            const td = document.createElement('td');
            const valor = datos[i][col];
            td.textContent = typeof valor === 'number' ? valor.toFixed(2) : valor;
            fila.appendChild(td);
        });
        tbody.appendChild(fila);
    }

    // Mostrar container
    container.style.display = 'block';

    // Scroll suave hacia el preview
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function habilitarDescargaCSV() {
    const btn = document.getElementById('btnDescargarCSV');
    btn.disabled = false;
}

function descargarCSV() {
    try {
        generadorDatos.descargarCSV();
        mostrarToast('CSV descargado exitosamente', 'success');
    } catch (error) {
        mostrarToast(error.message, 'error');
    }
}

function habilitarUsarGenerados() {
    const btn = document.getElementById('btnUsarGenerados');
    btn.disabled = false;
}

// ========================================
// CONFIGURACIÓN DEL ANALIZADOR
// ========================================

function configurarAnalizador() {
    // Botón usar datos generados
    document.getElementById('btnUsarGenerados').addEventListener('click', cargarDatosGenerados);

    // Input file CSV
    document.getElementById('fileInput').addEventListener('change', cargarArchivoCSV);

    // Botón analizar
    document.getElementById('btnAnalizar').addEventListener('click', ejecutarAnalisis);

    // Botón descargar resultados
    document.getElementById('btnDescargarResultados').addEventListener('click', descargarResultados);
}

function cargarDatosGenerados() {
    try {
        // Verificar que AnalizadorEstadistico esté disponible
        //if (typeof AnalizadorEstadistico === 'undefined') {
        //    mostrarToast('Error: El analizador estadístico no está cargado. Recarga la página.', 'error');
        //    return;
        //}

        const datos = generadorDatos.obtenerDatosGenerados();

        if (!datos || datos.length === 0) {
            mostrarToast('No hay datos generados. Genera una base de datos primero.', 'warning');
            return;
        }

        if (typeof window.AnalizadorEstadistico === 'undefined') {
            mostrarToast('Error: AnalizadorEstadistico indefinido', 'error');
            return;
        }
        window.AnalizadorEstadistico.cargarDatos(datos);

        mostrarDatosCargados(datos);
        mostrarToast('Datos cargados exitosamente', 'success');

    } catch (error) {
        mostrarToast(error.message, 'error');
    }
}

function cargarArchivoCSV(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.name.endsWith('.csv')) {
        mostrarToast('Por favor selecciona un archivo CSV', 'error');
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        try {
            const csvText = event.target.result;
            AnalizadorEstadistico.cargarDesdeCSV(csvText);
            mostrarDatosCargados(AnalizadorEstadistico.obtenerDatos());
            mostrarToast('Archivo CSV cargado exitosamente', 'success');
        } catch (error) {
            mostrarToast(error.message, 'error');
        }
    };

    reader.readAsText(file);
}

function mostrarDatosCargados(datos) {
    const container = document.getElementById('datosContainer');
    const seleccionContainer = document.getElementById('seleccionContainer');

    // Actualizar estadísticas
    document.getElementById('analisisN').textContent = datos.length;
    document.getElementById('analisisVars').textContent = Object.keys(datos[0]).length;

    // Crear tabla (primeras 10 filas)
    const thead = document.getElementById('analisisHead');
    const tbody = document.getElementById('analisisBody');

    thead.innerHTML = '';
    tbody.innerHTML = '';

    const columnas = Object.keys(datos[0]);

    // Encabezados
    const filaEncabezados = document.createElement('tr');
    columnas.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        filaEncabezados.appendChild(th);
    });
    thead.appendChild(filaEncabezados);

    // Datos
    const maxFilas = Math.min(10, datos.length);
    for (let i = 0; i < maxFilas; i++) {
        const fila = document.createElement('tr');
        columnas.forEach(col => {
            const td = document.createElement('td');
            const valor = datos[i][col];
            td.textContent = typeof valor === 'number' ? valor.toFixed(2) : valor;
            fila.appendChild(td);
        });
        tbody.appendChild(fila);
    }

    // Poblar selectores de variables (solo columnas numéricas)
    const columnasNumericas = columnas.filter(col => {
        return typeof datos[0][col] === 'number' || !isNaN(parseFloat(datos[0][col]));
    });

    const select1 = document.getElementById('variable1');
    const select2 = document.getElementById('variable2');

    select1.innerHTML = '<option value="">Seleccionar variable...</option>';
    select2.innerHTML = '<option value="">Seleccionar variable...</option>';

    columnasNumericas.forEach(col => {
        if (typeof col !== "string") {
            mostrarToast('Las columnas deben ser de tipo string', 'error');
            return;
        }

        const option1 = document.createElement('option');
        option1.value = col.trim();
        option1.textContent = col.trim();
        select1.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = col.trim();
        option2.textContent = col.trim();
        select2.appendChild(option2);
    });

    // Mostrar containers
    container.style.display = 'block';
    seleccionContainer.style.display = 'block';

    // Scroll
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function ejecutarAnalisis() {
    try {
        const var1 = document.getElementById('variable1').value;
        const var2 = document.getElementById('variable2').value;
        const tipoPrueba = document.querySelector('input[name="tipoPrueba"]:checked').value;

        if (!var1 || !var2) {
            mostrarToast('Por favor selecciona ambas variables', 'warning');
            return;
        }

        if (var1 === var2) {
            mostrarToast('Las variables deben ser diferentes', 'warning');
            return;
        }

        mostrarToast('Ejecutando análisis...', 'success');

        setTimeout(() => {
            // Contexto de investigación
            const unidadAnalisis = document.getElementById('unidadAnalisis').value;
            const lugarContexto = document.getElementById('lugarContexto').value;
            console.log("Unidad (texto):", unidadAnalisis);
            console.log("Contexto (texto):", lugarContexto);

            // Marco metodológico
            const marco = AnalizadorEstadistico.generarMarcoMetodologico(var1, var2, unidadAnalisis, lugarContexto);

            // Calcular correlación
            const resultado = AnalizadorEstadistico.calcularCorrelacion(var1, var2, tipoPrueba);

            // Generar todas las secciones dinámicamente
            mostrarMarcoMetodologico(marco);
            mostrarPruebasNormalidad(var1, var2, resultado);
            mostrarCorrelacion(var1, var2, resultado);
            mostrarDecision(resultado);
            mostrarDiscusion(var1, var2, resultado);

            // Mostrar referencias bibliográficas
            mostrarReferencias(var1, var2, resultado);

            mostrarToast('Análisis completado exitosamente', 'success');
        }, 300);

    } catch (error) {
        mostrarToast(error.message, 'error');
        console.error(error);
    }
}

function mostrarMarcoMetodologico(marco) {
    const container = document.getElementById('marcoMetodologicoContainer');
    if (!container) {
        console.warn('No existe elemento #marcoMetodologicoContainer en el HTML');
        return;
    }

    let html = `
        <div class="result-section">
            <h3 class="section-title">📋 Marco Metodológico</h3>
            
            <div class="result-box">
                <h4 class="result-subtitle">❓ Pregunta de Investigación</h4>
                <p class="marco-text">${marco.preguntaInvestigacion}</p>
            </div>
            
            <div class="result-box">
                <h4 class="result-subtitle">🎯 Objetivo General</h4>
                <p class="marco-text">${marco.objetivoGeneral}</p>
            </div>
            
            <div class="result-box">
                <h4 class="result-subtitle">📋 Objetivos Específicos</h4>
                <ol class="marco-list">
                    ${marco.objetivosEspecificos.map(obj => `<li>${obj}</li>`).join('')}
                </ol>
            </div>
            
            <div class="result-box">
                <h4 class="result-subtitle">💡 Hipótesis de Investigación (H₁)</h4>
                <p class="marco-text">${marco.hipotesis.hipotesisInvestigador}</p>
            </div>
            
            <div class="result-box">
                <h4 class="result-subtitle">❌ Hipótesis Nula (H₀)</h4>
                <p class="marco-text">${marco.hipotesis.hipotesisNula}</p>
            </div>
        </div>
    `;

    container.innerHTML = html;
    container.style.display = 'block';
}


function mostrarPruebasNormalidad(var1, var2, resultado) {
    const container = document.getElementById('pruebasNormalidadContainer');
    if (!container) {
        console.warn('No existe elemento #pruebasNormalidadContainer en el HTML');
        return;
    }

    const html = `
        <div class="result-section">
            <h3 class="section-title">Pruebas de normalidad</h3>
            <p class="result-subtitle">Hernández-Sampieri & Mendoza (2023) establecen que el tamaño muestral es el criterio decisivo para elegir la prueba de normalidad adecuada, porque cada una tiene sensibilidad diferente según el volumen de datos. Por un lado, Shapiro-Wilk es la prueba más potente parar muestras pequeñas (menor a 50 datos). Por otro lado, Kolmogorov-Smirnov es recomendable aplicarla con muestras mayores a 50. Es decir, el criterio metodológico en la selección de la prueba depende del cumplimiento del supuesto muestral.</p>
            <div class="result-box" style="margin-bottom: 1rem;">
                <h5 style="margin-bottom: 0.5rem; font-weight: 600;">Variable: ${var1}</h5>
                <table class="result-table">
                    <tr>
                        <td>Prueba utilizada:</td>
                        <td><strong>${resultado.normalidad1.prueba}</strong> (${resultado.normalidad1.razon})</td>
                    </tr>
                    <tr>
                        <td>Estadístico:</td>
                        <td>${resultado.normalidad1.estadistico.toFixed(4)}</td>
                    </tr>
                    <tr>
                        <td>p-valor:</td>
                        <td>${resultado.normalidad1.pValor.toFixed(4)}</td>
                    </tr>
                    <tr>
                        <td>Decisión:</td>
                        <td><strong>${resultado.normalidad1.decision}</strong></td>
                    </tr>
                </table>
            </div>
            
            <div class="result-box">
                <h5 style="margin-bottom: 0.5rem; font-weight: 600;">Variable: ${var2}</h5>
                <table class="result-table">
                    <tr>
                        <td>Prueba utilizada:</td>
                        <td><strong>${resultado.normalidad2.prueba}</strong> (${resultado.normalidad2.razon})</td>
                    </tr>
                    <tr>
                        <td>Estadístico:</td>
                        <td>${resultado.normalidad2.estadistico.toFixed(4)}</td>
                    </tr>
                    <tr>
                        <td>p-valor:</td>
                        <td>${resultado.normalidad2.pValor.toFixed(4)}</td>
                    </tr>
                    <tr>
                        <td>Decisión:</td>
                        <td><strong>${resultado.normalidad2.decision}</strong></td>
                    </tr>
                </table>
            </div>
        </div>
    `;

    container.innerHTML = html;
    container.style.display = 'block';
}

function mostrarCorrelacion(var1, var2, resultado) {
    const container = document.getElementById('resultadosCorrelacion');
    if (!container) return;

    const html = `
        <div class="result-section">
            <h3 class="section-title">Análisis de Correlación</h3>
            <p class="result-subtitle">El análisis de correlación permite medir la fuerza y dirección de la relación entre dos variables cuantitativas. Según Hernández, Fernández & Baptista (2010), el coeficiente de correlación de Pearson es adecuado cuando ambas variables siguen una distribución normal, mientras que el coeficiente de correlación de Spearman es preferible cuando al menos una variable no cumple con la normalidad. Es decir, la elección del coeficiente no es arbitraria, depende estrictamente del cumplimiento del supuesto de normalidad previamente validado. La interpretación del coeficiente varía desde -1 (correlación negativa perfecta) hasta +1 (correlación positiva perfecta), siendo 0 indicativo de ausencia de correlación.</p>

            <div class="result-box">
                <table class="result-table">
                    <tr>
                        <td>Variables:</td>
                        <td><strong>${var1} - ${var2}</strong></td>
                    </tr>
                    <tr>
                        <td>N:</td>
                        <td>${resultado.n}</td>
                    </tr>
                    <tr>
                        <td>Coeficiente utilizado:</td>
                        <td><strong>${resultado.tipoCorrelacion}</strong></td>
                    </tr>
                    <tr>
                        <td>Razón:</td>
                        <td>${resultado.normalidad1.normal && resultado.normalidad2.normal ?
            'Ambas variables son normales' :
            'Al menos una variable no es normal'}</td>
                    </tr>
                    <tr>
                        <td>Coeficiente (${resultado.tipoCorrelacion === 'Pearson' ? 'r' : 'ρ'}):</td>
                        <td><strong style="font-size: 1.1em;">${resultado.coeficiente.toFixed(4)}</strong></td>
                    </tr>
                    <tr>
                        <td>p-valor (${resultado.tipoPrueba}):</td>
                        <td><strong>${resultado.pValor.toFixed(4)}</strong></td>
                    </tr>
                    <tr>
                        <td>Interpretación:</td>
                        <td><strong>${resultado.interpretacion.texto}</strong></td>
                    </tr>
                </table>
            </div>
        </div>
    `;

    container.innerHTML = html;
    container.style.display = 'block';
}

function mostrarDecision(resultado) {
    const container = document.getElementById('resultadosDecision');
    if (!container) return;

    const prueba = AnalizadorEstadistico.pruebaHipotesis(resultado);

    const html = `
        <div class="result-section">
            <h3 class="section-title">Prueba de Hipótesis</h3>
            <p class="result-subtitle">Según Taherdoost (2022), la prueba de hipótesis es un procedimiento estadístico que permite evaluar afirmaciones sobre parámetros poblacionales basándose en datos muestrales. El proceso implica formular una hipótesis nula (H₀) y una hipótesis alternativa (H₁), seleccionar un nivel de significancia (α), calcular un estadístico de prueba y determinar el p-valor asociado. La decisión de rechazar o no rechazar H₀ se basa en la comparación del p-valor con α, proporcionando así una base objetiva para la inferencia estadística.</p>
            <div class="result-box">
                <table class="result-table">
                    <tr>
                        <td>Nivel de significancia (α):</td>
                        <td><strong>${prueba.alpha}</strong></td>
                    </tr>
                    <tr>
                        <td>p-valor:</td>
                        <td><strong>${resultado.pValor.toFixed(4)}</strong></td>
                    </tr>
                    <tr>
                        <td>Comparación:</td>
                        <td>${resultado.pValor.toFixed(4)} ${prueba.decision === 'rechazar' ? '<' : '≥'} ${prueba.alpha}</td>
                    </tr>
                    <tr>
                        <td>Decisión sobre H₀:</td>
                        <td class="${prueba.decision === 'rechazar' ? 'decision-reject' : 'decision-accept'}">
                            <strong>${prueba.decision === 'rechazar' ? 'SE RECHAZA H₀' : 'NO SE RECHAZA H₀'}</strong>
                        </td>
                    </tr>
                    <tr>
                        <td>Conclusión:</td>
                        <td><strong>${prueba.conclusionH1}</strong></td>
                    </tr>
                </table>
                
                <div style="margin-top: 1rem; padding: 1rem; background-color: #f9f9f9; border-radius: 6px;">
                    <p style="margin: 0; font-size: 0.9rem; line-height: 1.6;">
                        ${prueba.conclusionH0}
                    </p>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
    container.style.display = 'block';
}

function mostrarDiscusion(var1, var2, resultado) {
    const container = document.getElementById('resultadosDiscusion');
    if (!container) return;

    const discusion = AnalizadorEstadistico.generarDiscusion(var1, var2, resultado);

    const html = `
        <div class="result-section">
            <h3 class="section-title">Discusión (Plantilla)</h3>
            <div class="discussion-box">
                ${discusion.replace(/\[(.*?)\]/g, '<span class="highlight">[$1]</span>')}
            </div>
        </div>
    `;

    container.innerHTML = html;
    container.style.display = 'block';
}

function mostrarReferencias(var1, var2, resultado) {
    // ✅ DECLARA EL CONTENEDOR PRINCIPAL
    const container = document.getElementById('resultadosContainer');
    if (!container) {
        console.error("No se encontró el contenedor #resultadosContainer");
        return;
    }

    const html = `
        <div class="references-container">
            <h4 class="result-title">Referencias bibliográficas</h4>
            <div class="reference-card">
                <p class="reference-text">1. Hernández-Sampieri, R., & Mendoza, C. (2023). Metodología de la investigación: las rutas cuantitativa, cualitativa y mixta. <a href="https://apiperiodico.jalisco.gob.mx/api/sites/periodicooficial.jalisco.gob.mx/files/metodologia_de_la_investigacion_-_roberto_hernandez_sampieri.pdf" target="_blank">https://apiperiodico.jalisco.gob.mx/api/sites/periodicooficial.jalisco.gob.mx/files/metodologia_de_la_investigacion_-_roberto_hernandez_sampieri.pdf</a></p>
            </div>

            <div class="reference-card">
                <p class="reference-text">2. Hernández, D., Fernández, C., & Baptista, M. D. P. (2010). Metodologia de la investigacion 5ta Edicion Sampieri. <a href="https://www.academia.edu/download/46694261/Metodologia_de_la_investigacion_5ta_Edicion_Sampieri___Dulce_Hernandez_-_Academia.edu.pdf" target="_blank">https://www.academia.edu/download/46694261/Metodologia_de_la_investigacion_5ta_Edicion_Sampieri___Dulce_Hernandez_-_Academia.edu.pdf</a></p>
            </div>

            <div class="reference-card">
                <p class="reference-text">3. Taherdoost, H. (2022). What are different research approaches? Comprehensive review of qualitative, quantitative, and mixed method research, their applications, types, and limitations. Journal of Management Science & Engineering Research, 5(1), 53-63. <a href="https://hal.science/hal-03741840/document" target="_blank">https://hal.science/hal-03741840/document</a></p>
            </div>
        </div>
    `;

    container.innerHTML = html;
    container.style.display = 'block';
}

function descargarResultados() {
    // Obtener el contenido de resultados
    const normalidad = document.getElementById('resultadosNormalidad').innerText;
    const correlacion = document.getElementById('resultadosCorrelacion').innerText;
    const decision = document.getElementById('resultadosDecision').innerText;
    const discusion = document.getElementById('resultadosDiscusion').innerText;

    const contenido = `
RESULTADOS DEL ANÁLISIS ESTADÍSTICO
====================================

1. PRUEBA DE NORMALIDAD
${normalidad}

2. ANÁLISIS DE CORRELACIÓN
${correlacion}

3. PRUEBA DE HIPÓTESIS
${decision}

4. DISCUSIÓN (PLANTILLA)
${discusion}


----
Generado por StatSim Pro
Fecha: ${new Date().toLocaleDateString()}
`;

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'resultados_analisis.txt');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    mostrarToast('Resultados descargados', 'success');
}
// autor: Joel pasapera
// ========================================
// UTILIDADES
// ========================================

function mostrarToast(mensaje, tipo = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.className = `toast ${tipo}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========================================
// FORMATEO DE NÚMEROS
// ========================================

function formatearNumero(numero, decimales = 2) {
    return Number(numero).toFixed(decimales);
}

function formatearPValor(p) {
    if (p < 0.001) return '< .001';
    if (p < 0.01) return p.toFixed(3);
    return p.toFixed(4);
}

// ========================================
// IMPORTAR/EXPORTAR CONFIGURACIONES
// ========================================

// PRUEBAS APLICADAS
function exportarConfigPruebas() {
    try {
        const filas = document.querySelectorAll('#bodyPruebas .fila-prueba');

        if (filas.length === 0) {
            mostrarToast('No hay pruebas para exportar', 'warning');
            return;
        }

        // Crear CSV con encabezados
        let csv = 'Nombre,NumItems,Media,DE,MinItem,MaxItem\n';

        filas.forEach(fila => {
            const inputs = fila.querySelectorAll('input');
            const nombre = inputs[0].value.trim() || '';
            const numItems = inputs[1].value || '';
            const media = inputs[2].value || '';
            const de = inputs[3].value || '';
            const min = inputs[4].value || '';
            const max = inputs[5].value || '';

            // Escapar valores con comas
            const nombreEscapado = nombre.includes(',') ? `"${nombre}"` : nombre;
            csv += `${nombreEscapado},${numItems},${media},${de},${min},${max}\n`;
        });

        // Descargar archivo
        descargarArchivo(csv, 'configuracion_pruebas.csv', 'text/csv');
        mostrarToast('Configuración de pruebas exportada exitosamente', 'success');

    } catch (error) {
        mostrarToast('Error al exportar: ' + error.message, 'error');
    }
}

function importarConfigPruebas(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const csv = event.target.result;
            const lineas = csv.trim().split('\n');

            if (lineas.length < 2) {
                mostrarToast('El archivo CSV está vacío o no tiene datos', 'error');
                return;
            }

            // Verificar encabezados
            const encabezados = lineas[0].toLowerCase();
            if (!encabezados.includes('nombre') || !encabezados.includes('numitems')) {
                mostrarToast('El archivo CSV no tiene el formato correcto. Encabezados esperados: Nombre,NumItems,Media,DE,MinItem,MaxItem', 'error');
                return;
            }

            // Limpiar tabla actual
            const tbody = document.getElementById('bodyPruebas');
            tbody.innerHTML = '';

            // Procesar cada línea (saltar encabezados)
            for (let i = 1; i < lineas.length; i++) {
                const linea = lineas[i].trim();
                if (!linea) continue;

                const valores = parsearLineaCSV(linea);

                if (valores.length >= 4) {
                    agregarFilaPruebaConDatos({
                        nombre: valores[0] || '',
                        numItems: valores[1] || '',
                        media: valores[2] || '',
                        de: valores[3] || '',
                        min: valores[4] || '',
                        max: valores[5] || ''
                    });
                }
            }

            mostrarToast(`Configuración importada: ${lineas.length - 1} pruebas`, 'success');

        } catch (error) {
            mostrarToast('Error al importar: ' + error.message, 'error');
        }
    };

    reader.readAsText(file);
    e.target.value = ''; // Limpiar input
}

function agregarFilaPruebaConDatos(datos) {
    const tbody = document.getElementById('bodyPruebas');
    const nuevaFila = document.createElement('tr');
    nuevaFila.className = 'fila-prueba';

    nuevaFila.innerHTML = `
        <td><input type="text" class="input input-sm" placeholder="Ej: WAIS-IV" maxlength="100" value="${datos.nombre}"></td>
        <td><input type="number" class="input input-sm" placeholder="Ej: 60" min="1" value="${datos.numItems}"></td>
        <td><input type="number" class="input input-sm" placeholder="Ej: 100" step="0.01" value="${datos.media}"></td>
        <td><input type="number" class="input input-sm" placeholder="Ej: 15" step="0.01" min="0.01" value="${datos.de}"></td>
        <td><input type="number" class="input input-sm" placeholder="Ej: 0" step="1" value="${datos.min}"></td>
        <td><input type="number" class="input input-sm" placeholder="Ej: 5" step="1" value="${datos.max}"></td>
        <td>
            <button class="btn-icon btn-delete" title="Eliminar">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 4H13M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M6 7V11M10 7V11M4 4H12L11.5 13C11.5 13.5523 11.0523 14 10.5 14H5.5C4.94772 14 4.5 13.5523 4.5 13L4 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </button>
        </td>
    `;

    tbody.appendChild(nuevaFila);
}

// SOCIODEMOGRÁFICOS
function exportarConfigSocio() {
    try {
        const filas = document.querySelectorAll('#bodySocio .fila-socio');

        if (filas.length === 0) {
            mostrarToast('No hay variables sociodemográficas para exportar', 'warning');
            return;
        }

        // Crear CSV con encabezados
        let csv = 'Categoria,Promedio,DE,Minimo,Maximo,Decimales\n';

        filas.forEach(fila => {
            const inputs = fila.querySelectorAll('input');
            const categoria = inputs[0].value.trim() || '';
            const promedio = inputs[1].value || '';
            const de = inputs[2].value || '';
            const min = inputs[3].value || '';
            const max = inputs[4].value || '';
            const decimales = inputs[5].value || '';

            // Escapar valores con comas
            const categoriaEscapada = categoria.includes(',') ? `"${categoria}"` : categoria;
            csv += `${categoriaEscapada},${promedio},${de},${min},${max},${decimales}\n`;
        });

        // Descargar archivo
        descargarArchivo(csv, 'configuracion_sociodemograficos.csv', 'text/csv');
        mostrarToast('Configuración de sociodemográficos exportada exitosamente', 'success');

    } catch (error) {
        mostrarToast('Error al exportar: ' + error.message, 'error');
    }
}

function importarConfigSocio(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const csv = event.target.result;
            const lineas = csv.trim().split('\n');

            if (lineas.length < 2) {
                mostrarToast('El archivo CSV está vacío o no tiene datos', 'error');
                return;
            }

            // Verificar encabezados
            const encabezados = lineas[0].toLowerCase();
            if (!encabezados.includes('categoria') || !encabezados.includes('promedio')) {
                mostrarToast('El archivo CSV no tiene el formato correcto. Encabezados esperados: Categoria,Promedio,DE,Minimo,Maximo,Decimales', 'error');
                return;
            }

            // Limpiar tabla actual
            const tbody = document.getElementById('bodySocio');
            tbody.innerHTML = '';

            // Procesar cada línea (saltar encabezados)
            for (let i = 1; i < lineas.length; i++) {
                const linea = lineas[i].trim();
                if (!linea) continue;

                const valores = parsearLineaCSV(linea);

                if (valores.length >= 3) {
                    agregarFilaSocioConDatos({
                        categoria: valores[0] || '',
                        promedio: valores[1] || '',
                        de: valores[2] || '',
                        min: valores[3] || '',
                        max: valores[4] || '',
                        decimales: valores[5] || '2'
                    });
                }
            }

            mostrarToast(`Configuración importada: ${lineas.length - 1} variables`, 'success');

        } catch (error) {
            mostrarToast('Error al importar: ' + error.message, 'error');
        }
    };

    reader.readAsText(file);
    e.target.value = ''; // Limpiar input
}

function agregarFilaSocioConDatos(datos) {
    const tbody = document.getElementById('bodySocio');
    const nuevaFila = document.createElement('tr');
    nuevaFila.className = 'fila-socio';

    nuevaFila.innerHTML = `
        <td><input type="text" class="input input-sm" placeholder="Ej: Edad" value="${datos.categoria}"></td>
        <td><input type="number" class="input input-sm" placeholder="Ej: 20" step="0.01" value="${datos.promedio}"></td>
        <td><input type="number" class="input input-sm" placeholder="Ej: 2.5" step="0.01" min="0.01" value="${datos.de}"></td>
        <td><input type="number" class="input input-sm" placeholder="Ej: 15" step="0.01" value="${datos.min}"></td>
        <td><input type="number" class="input input-sm" placeholder="Ej: 25" step="0.01" value="${datos.max}"></td>
        <td><input type="number" class="input input-sm" placeholder="Ej: 2" min="0" max="4" value="${datos.decimales}"></td>
        <td>
            <button class="btn-icon btn-delete" title="Eliminar">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 4H13M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M6 7V11M10 7V11M4 4H12L11.5 13C11.5 13.5523 11.0523 14 10.5 14H5.5C4.94772 14 4.5 13.5523 4.5 13L4 4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </button>
        </td>
    `;

    tbody.appendChild(nuevaFila);
}

// UTILIDADES
function parsearLineaCSV(linea) {
    const resultado = [];
    let dentroComillas = false;
    let valorActual = '';

    for (let i = 0; i < linea.length; i++) {
        const char = linea[i];

        if (char === '"') {
            dentroComillas = !dentroComillas;
        } else if (char === ',' && !dentroComillas) {
            resultado.push(valorActual.trim());
            valorActual = '';
        } else {
            valorActual += char;
        }
    }
    resultado.push(valorActual.trim());

    return resultado;
}

function descargarArchivo(contenido, nombreArchivo, tipoMime) {
    const blob = new Blob([contenido], { type: tipoMime + ';charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', nombreArchivo);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
