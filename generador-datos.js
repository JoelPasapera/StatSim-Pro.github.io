// ========================================
// GENERADOR DE BASE DE DATOS SIMULADA
// ========================================

// Tope superior del tamaño muestral para evitar congelar el navegador.
const TAMANO_MUESTRAL_MAXIMO = 100000;

class GeneradorDatos {
    constructor() {
        this.datosGenerados = null;
        this.configuracion = {
            tamanoMuestra: 100,
            semilla: null,
            pruebas: [],
            sociodemograficos: []
        };
        // Fuente de números aleatorios (reemplazable por un PRNG sembrado)
        this.aleatorio = Math.random;
    }

    // ========================================
    // ALEATORIEDAD (REPRODUCIBLE CON SEMILLA)
    // ========================================

    // Inicializa la fuente de aleatoriedad. Con una semilla numérica usa un
    // PRNG determinista (Mulberry32): la misma semilla produce el mismo
    // conjunto de datos. Sin semilla, usa Math.random.
    inicializarAleatorio(semilla) {
        if (semilla === null || semilla === undefined || isNaN(semilla)) {
            this.aleatorio = Math.random;
            return;
        }

        let estado = Math.trunc(semilla) >>> 0;
        this.aleatorio = function () {
            estado = (estado + 0x6D2B79F5) >>> 0;
            let t = estado;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    // ========================================
    // RECOLECCIÓN DE CONFIGURACIÓN
    // ========================================
    
    recolectarConfiguracion() {
        // Tamaño muestral
        const tamano = parseInt(document.getElementById('tamanoMuestra').value);
        if (isNaN(tamano) || tamano < 2) {
            throw new Error('El tamaño muestral debe ser al menos 2');
        }
        // Tope superior para evitar congelar el navegador ante un valor enorme
        // (p. ej. un error tipográfico como 1000000).
        if (tamano > TAMANO_MUESTRAL_MAXIMO) {
            throw new Error(`El tamaño muestral máximo permitido es ${TAMANO_MUESTRAL_MAXIMO}`);
        }
        this.configuracion.tamanoMuestra = tamano;

        // Semilla opcional para reproducibilidad
        const semillaTexto = document.getElementById('semilla').value.trim();
        this.configuracion.semilla = semillaTexto === '' ? null : parseInt(semillaTexto, 10);

        // Pruebas aplicadas
        this.configuracion.pruebas = this.recolectarPruebas();
        if (this.configuracion.pruebas.length === 0) {
            throw new Error('Debe agregar al menos una prueba');
        }

        // Datos sociodemográficos
        this.configuracion.sociodemograficos = this.recolectarSociodemograficos();
        if (this.configuracion.sociodemograficos.length === 0) {
            throw new Error('Debe agregar al menos un dato sociodemográfico');
        }

        return this.configuracion;
    }

    recolectarPruebas() {
        const pruebas = [];
        const nombresCortosUsados = new Set();
        const filas = document.querySelectorAll('#bodyPruebas .fila-prueba');

        filas.forEach((fila, index) => {
            const inputs = fila.querySelectorAll('input');
            const nombre = inputs[0].value.trim();
            const numItems = parseInt(inputs[1].value);
            const media = parseFloat(inputs[2].value);
            const desviacion = parseFloat(inputs[3].value);
            const minimo = parseFloat(inputs[4].value);
            const maximo = parseFloat(inputs[5].value);
            const alfa = inputs[6] ? parseFloat(inputs[6].value) : NaN;

            if (nombre && !isNaN(numItems) && !isNaN(media) && !isNaN(desviacion)) {
                if (numItems < 1) {
                    throw new Error(`Prueba "${nombre}": El número de ítems debe ser al menos 1`);
                }
                if (desviacion <= 0) {
                    throw new Error(`Prueba "${nombre}": La desviación estándar debe ser mayor a 0`);
                }

                // Validar rango si se especifica
                if (!isNaN(minimo) && !isNaN(maximo)) {
                    if (minimo >= maximo) {
                        throw new Error(`Prueba "${nombre}": El mínimo debe ser menor que el máximo`);
                    }
                }

                // Validar alfa objetivo si se especifica
                if (!isNaN(alfa) && (alfa < 0 || alfa >= 1)) {
                    throw new Error(`Prueba "${nombre}": El α objetivo debe estar entre 0 y 1`);
                }

                pruebas.push({
                    nombre: nombre,
                    nombreCorto: this.generarNombreCortoUnico(nombre, nombresCortosUsados),
                    numItems: numItems,
                    media: media,
                    desviacion: desviacion,
                    minimo: !isNaN(minimo) ? minimo : null,
                    maximo: !isNaN(maximo) ? maximo : null,
                    alfa: !isNaN(alfa) ? alfa : 0
                });
            }
        });

        return pruebas;
    }

    recolectarSociodemograficos() {
        const socio = [];
        const nombresCortosUsados = new Set();
        const filas = document.querySelectorAll('#bodySocio .fila-socio');

        filas.forEach((fila, index) => {
            const inputs = fila.querySelectorAll('input');
            const categoria = inputs[0].value.trim();
            const promedio = parseFloat(inputs[1].value);
            const desviacion = parseFloat(inputs[2].value);
            const minimo = parseFloat(inputs[3].value);
            const maximo = parseFloat(inputs[4].value);
            const decimales = parseInt(inputs[5].value);

            if (categoria && !isNaN(promedio) && !isNaN(desviacion)) {
                if (desviacion <= 0) {
                    throw new Error(`Categoría "${categoria}": La desviación estándar debe ser mayor a 0`);
                }
                
                // Validar rango si se especifica
                if (!isNaN(minimo) && !isNaN(maximo)) {
                    if (minimo >= maximo) {
                        throw new Error(`Categoría "${categoria}": El mínimo debe ser menor que el máximo`);
                    }
                }
                
                // Validar número de decimales
                let numDecimales = 2; // Por defecto
                if (!isNaN(decimales)) {
                    if (decimales < 0 || decimales > 4) {
                        throw new Error(`Categoría "${categoria}": Los decimales deben estar entre 0 y 4`);
                    }
                    numDecimales = decimales;
                }

                socio.push({
                    categoria: categoria,
                    categoriaCorta: this.generarNombreCortoUnico(categoria, nombresCortosUsados),
                    promedio: promedio,
                    desviacion: desviacion,
                    minimo: !isNaN(minimo) ? minimo : null,
                    maximo: !isNaN(maximo) ? maximo : null,
                    decimales: numDecimales
                });
            }
        });

        return socio;
    }

    generarNombreCorto(nombre) {
        // Genera un nombre corto a partir del nombre completo
        // Toma las iniciales y números
        let corto = nombre
            .replace(/[^a-zA-Z0-9\s]/g, '') // Eliminar caracteres especiales
            .split(/\s+/) // Separar por espacios
            .map(palabra => palabra.charAt(0).toUpperCase()) // Primera letra
            .join('');

        return corto.substring(0, 10); // Máximo 10 caracteres
    }

    // Devuelve un nombre corto único respecto a `usados`, agregando un sufijo
    // numérico si hay colisión. Evita que dos pruebas/variables con iniciales
    // iguales generen el mismo prefijo de columna y se sobrescriban entre sí.
    generarNombreCortoUnico(nombre, usados) {
        let base = this.generarNombreCorto(nombre);
        if (!base) base = 'V'; // Respaldo si el nombre no tiene caracteres alfanuméricos

        let corto = base;
        let sufijo = 2;
        while (usados.has(corto)) {
            corto = `${base}_${sufijo}`;
            sufijo++;
        }

        usados.add(corto);
        return corto;
    }

    // ========================================
    // GENERACIÓN DE DATOS ALEATORIOS
    // ========================================

    generarBaseDatos() {
        // Inicializar la fuente de aleatoriedad (sembrada si hay semilla)
        this.inicializarAleatorio(this.configuracion.semilla);

        const n = this.configuracion.tamanoMuestra;
        const datos = [];

        // Generar datos para cada participante
        for (let i = 0; i < n; i++) {
            const participante = { ID: i + 1 };

            // Generar datos sociodemográficos
            this.configuracion.sociodemograficos.forEach(socio => {
                let valor = this.generarValorNormal(
                    socio.promedio,
                    socio.desviacion
                );
                
                // Aplicar límites si están definidos
                if (socio.minimo !== null && socio.maximo !== null) {
                    valor = Math.max(socio.minimo, Math.min(socio.maximo, valor));
                }
                
                // Redondear según número de decimales especificado
                const factor = Math.pow(10, socio.decimales);
                participante[socio.categoriaCorta] = Math.round(valor * factor) / factor;
            });

            // Generar datos de cada prueba
            this.configuracion.pruebas.forEach(prueba => {
                const puntajes = this.generarPuntajesPrueba(
                    prueba.numItems,
                    prueba.media,
                    prueba.desviacion,
                    prueba.minimo,
                    prueba.maximo,
                    prueba.alfa
                );

                // Agregar cada ítem
                puntajes.items.forEach((puntaje, idx) => {
                    const nombreColumna = `${prueba.nombreCorto}${idx + 1}`;
                    participante[nombreColumna] = puntaje;
                });

                // Agregar total
                participante[`Total_${prueba.nombreCorto}`] = puntajes.total;
            });

            datos.push(participante);
        }

        this.datosGenerados = datos;
        return datos;
    }

    generarPuntajesPrueba(numItems, mediaTotal, desviacionTotal, minItem = null, maxItem = null, alfaObjetivo = 0, factor = null) {
        // IMPORTANTE: mediaTotal y desviacionTotal son los parámetros del puntaje TOTAL
        // de la prueba (lo que el usuario introduce en "Media (M)" y "DE"), NO valores por ítem.
        // Cada ítem se genera alrededor de su media esperada (mediaTotal / numItems).
        //
        // FACTOR LATENTE: para que la escala tenga consistencia interna realista
        // (α de Cronbach), los ítems comparten un factor común F:
        //   ítem_estándar = λ·F + √(1−λ²)·ε
        // donde λ es la carga factorial derivada del α objetivo. Con α = 0 los
        // ítems son independientes (comportamiento original). La DE por ítem se
        // ajusta para que la DE del TOTAL siga en el objetivo aunque los ítems
        // estén correlacionados.

        if (minItem === null) minItem = 1;
        if (maxItem === null) maxItem = 7;

        const k = numItems;
        const mediaPorItem = mediaTotal / k;

        // Carga factorial λ a partir del α objetivo (fórmula de Spearman-Brown
        // invertida): correlación media entre ítems r̄ = α / (k − α(k−1)); λ = √r̄.
        let lambda = 0;
        if (alfaObjetivo > 0 && alfaObjetivo < 1 && k >= 2) {
            const rMedia = alfaObjetivo / (k - alfaObjetivo * (k - 1));
            lambda = Math.sqrt(Math.max(0, Math.min(0.999, rMedia)));
        }

        // DE por ítem: Var(total) = k·σ_i²·(1 + (k−1)·λ²) debe igualar DE_total²
        const desviacionPorItem = desviacionTotal / Math.sqrt(k * (1 + (k - 1) * lambda * lambda));

        // Factor común de la escala (uno por participante); si se pasa, se reutiliza
        // (lo usa el módulo de correlaciones para enlazar escalas).
        const F = factor !== null ? factor : this.generarNormalEstandar();
        const unicidad = Math.sqrt(1 - lambda * lambda);

        const items = [];
        for (let i = 0; i < k; i++) {
            const z = lambda * F + unicidad * this.generarNormalEstandar();
            let valor = mediaPorItem + desviacionPorItem * z;
            valor = Math.max(minItem, Math.min(maxItem, valor));
            valor = Math.round(valor);
            items.push(valor);
        }

        const totalReal = items.reduce((a, b) => a + b, 0);
        return {
            items: items,
            total: totalReal
        };
    }

    // Valor normal estándar N(0,1) por el método de Box-Muller.
    generarNormalEstandar() {
        let u1 = this.aleatorio();
        let u2 = this.aleatorio();
        while (u1 === 0) u1 = this.aleatorio(); // Evitar log(0)
        return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    }

    generarValorNormal(media, desviacion) {
        // NO redondear aquí, se redondeará después según el contexto
        return media + desviacion * this.generarNormalEstandar();
    }

    // ========================================
    // EXPORTACIÓN A CSV
    // ========================================

    exportarCSV() {
        if (!this.datosGenerados || this.datosGenerados.length === 0) {
            throw new Error('No hay datos generados para exportar');
        }

        // Obtener encabezados
        const encabezados = Object.keys(this.datosGenerados[0]);
        
        // Crear contenido CSV
        let csv = encabezados.join(',') + '\n';
        
        this.datosGenerados.forEach(fila => {
            const valores = encabezados.map(encabezado => {
                let valor = fila[encabezado];
                // Escapar valores que contengan comas
                if (typeof valor === 'string' && valor.includes(',')) {
                    valor = `"${valor}"`;
                }
                return valor;
            });
            csv += valores.join(',') + '\n';
        });

        return csv;
    }

    descargarCSV(nombreArchivo = 'base_datos_simulada.csv') {
        const csv = this.exportarCSV();
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', nombreArchivo);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }

    // ========================================
    // UTILIDADES
    // ========================================

    obtenerDatosGenerados() {
        return this.datosGenerados;
    }

    obtenerConfiguracion() {
        return this.configuracion;
    }

    limpiarDatos() {
        this.datosGenerados = null;
        this.configuracion = {
            tamanoMuestra: 100,
            semilla: null,
            pruebas: [],
            sociodemograficos: []
        };
    }

    // ========================================
    // VALIDACIONES
    // ========================================

    validarConfiguracion() {
        const errores = [];
        const advertencias = [];

        // Validar tamaño muestral
        if (this.configuracion.tamanoMuestra < 30) {
            advertencias.push('Tamaño muestral < 30: Los análisis estadísticos pueden tener bajo poder');
        }

        if (this.configuracion.tamanoMuestra > 10000) {
            advertencias.push('Tamaño muestral muy grande: Puede ser poco realista');
        }

        // Validar pruebas
        this.configuracion.pruebas.forEach(prueba => {
            // Validar desviación estándar razonable
            const rangoEsperado = prueba.numItems * 5; // Suposición de escala Likert
            if (prueba.desviacion > rangoEsperado / 2) {
                advertencias.push(
                    `Prueba "${prueba.nombre}": Desviación estándar muy alta (${prueba.desviacion}) para ${prueba.numItems} ítems`
                );
            }

            // Validar que la media sea positiva
            if (prueba.media < 0) {
                errores.push(`Prueba "${prueba.nombre}": La media no puede ser negativa`);
            }
        });

        // Validar sociodemográficos
        this.configuracion.sociodemograficos.forEach(socio => {
            // Validar desviación razonable
            if (socio.desviacion > Math.abs(socio.promedio) * 2) {
                advertencias.push(
                    `Variable "${socio.categoria}": Desviación estándar muy alta (${socio.desviacion}) comparada con la media (${socio.promedio})`
                );
            }
            
            // Validar coherencia de límites con la media
            if (socio.minimo !== null && socio.maximo !== null) {
                if (socio.promedio < socio.minimo || socio.promedio > socio.maximo) {
                    advertencias.push(
                        `Variable "${socio.categoria}": La media (${socio.promedio}) está fuera del rango [${socio.minimo}, ${socio.maximo}]`
                    );
                }
                
                // Validar que el rango sea razonable para la desviación
                const rango = socio.maximo - socio.minimo;
                if (socio.desviacion > rango / 2) {
                    advertencias.push(
                        `Variable "${socio.categoria}": La desviación estándar (${socio.desviacion}) es muy alta para el rango [${socio.minimo}, ${socio.maximo}]`
                    );
                }
            }
        });

        return { errores, advertencias };
    }

    // ========================================
    // ESTADÍSTICAS DESCRIPTIVAS RÁPIDAS
    // ========================================

    calcularEstadisticas(columna) {
        if (!this.datosGenerados) return null;

        const valores = this.datosGenerados
            .map(fila => fila[columna])
            .filter(v => v !== null && v !== undefined && !isNaN(v));

        if (valores.length === 0) return null;

        valores.sort((a, b) => a - b);

        const n = valores.length;
        const suma = valores.reduce((a, b) => a + b, 0);
        const media = suma / n;
        
        const varianza = valores
            .map(v => Math.pow(v - media, 2))
            .reduce((a, b) => a + b, 0) / n;
        
        const desviacion = Math.sqrt(varianza);
        
        const min = valores[0];
        const max = valores[n - 1];
        
        const mediana = n % 2 === 0
            ? (valores[n / 2 - 1] + valores[n / 2]) / 2
            : valores[Math.floor(n / 2)];

        return {
            n: n,
            media: media,
            desviacion: desviacion,
            min: min,
            max: max,
            mediana: mediana
        };
    }
}

// ========================================
// INSTANCIA GLOBAL
// ========================================
const generadorDatos = new GeneradorDatos();