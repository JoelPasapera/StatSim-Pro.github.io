# ScientificCharts API Documentation

## Clase Principal: ScientificCharts

### Constructor
```javascript
new ScientificCharts(containerId, config)
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `containerId` | String | ID del contenedor DOM donde se renderizará el gráfico |
| `config` | Object | Objeto de configuración opcional |

**Ejemplo:**
```javascript
const chart = new ScientificCharts('myContainer', {
    width: 800,
    height: 600,
    primaryColor: '#2E5BBA'
});
```

---

## Métodos de Visualización

### 1. Distribución Gaussiana
```javascript
createGaussianDistribution(data, mean, std, options)
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `data` | Array | Datos numéricos para la distribución |
| `mean` | Number | Media (opcional, se calcula automáticamente) |
| `std` | Number | Desviación estándar (opcional) |
| `options` | Object | Opciones adicionales (título, etiquetas) |

**Retorno:** `ScientificCharts` - Instancia para method chaining

**Descripción:** Crea una curva de distribución normal con área sombreada, líneas de desviación estándar y estadísticas descriptivas.

**Uso científico:** Análisis de normalidad de datos, visualización de distribuciones teóricas, pruebas de hipótesis.

---

### 2. Matriz de Correlación
```javascript
createCorrelationMatrix(data, labels, options)
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `data` | Array | Matriz de correlaciones (array de arrays) |
| `labels` | Array | Etiquetas de las variables |
| `options` | Object | Opciones adicionales |

**Retorno:** `ScientificCharts` - Instancia para method chaining

**Descripción:** Heatmap que muestra las correlaciones entre variables con escala de color y valores numéricos.

**Uso científico:** Análisis de correlaciones multivariadas, estudios de asociación, reducción de dimensionalidad.

---

### 3. Diagrama de Caja y Bigotes
```javascript
createBoxPlot(data, labels, options)
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `data` | Array | Datos numéricos o array de arrays para múltiples boxplots |
| `labels` | Array | Etiquetas para los grupos |
| `options` | Object | Opciones adicionales |

**Retorno:** `ScientificCharts` - Instancia para method chaining

**Descripción:** Muestra distribuciones con mediana, cuartiles, bigotes y valores atípicos.

**Uso científico:** Comparación de distribuciones, identificación de outliers, análisis exploratorio de datos.

---

### 4. Diagrama de Violín
```javascript
createViolinPlot(data, labels, options)
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `data` | Array | Datos numéricos o array de arrays |
| `labels` | Array | Etiquetas para los grupos |
| `options` | Object | Opciones adicionales |

**Retorno:** `ScientificCharts` - Instancia para method chaining

**Descripción:** Combina boxplot con estimación de densidad para mostrar la distribución completa de los datos.

**Uso científico:** Visualización detallada de distribuciones, comparación de formas de distribución, análisis de multimodalidad.

---

### 5. Scatter Plot con Regresión
```javascript
createScatterPlot(xData, yData, options)
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `xData` | Array | Datos del eje X |
| `yData` | Array | Datos del eje Y |
| `options` | Object | Opciones adicionales |

**Retorno:** `ScientificCharts` - Instancia para method chaining

**Descripción:** Gráfico de dispersión con línea de regresión lineal y coeficiente de determinación R².

**Uso científico:** Análisis de correlación, modelado lineal, predicción, validación de relaciones entre variables.

---

### 6. Histograma con Densidad
```javascript
createHistogram(data, bins, options)
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `data` | Array | Datos numéricos |
| `bins` | Number | Número de bins (opcional) |
| `options` | Object | Opciones adicionales |

**Retorno:** `ScientificCharts` - Instancia para method chaining

**Descripción:** Histograma con curva de densidad superpuesta y estadísticas descriptivas.

**Uso científico:** Análisis de distribución de frecuencias, estimación de densidad, exploración de datos.

---

### 7. Gráfico de Barras con Error Bars
```javascript
createBarChartWithErrorBars(categories, values, errors, options)
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `categories` | Array | Etiquetas de categorías |
| `values` | Array | Valores para cada categoría |
| `errors` | Array | Intervalos de confianza/error (opcional) |
| `options` | Object | Opciones adicionales |

**Retorno:** `ScientificCharts` - Instancia para method chaining

**Descripción:** Barras con intervalos de confianza o barras de error estándar.

**Uso científico:** Comparación de medias con incertidumbre, análisis post-hoc, reporte de resultados con IC.

---

### 8. Gráfico de Bland-Altman
```javascript
createBlandAltmanPlot(method1, method2, options)
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `method1` | Array | Datos del primer método |
| `method2` | Array | Datos del segundo método |
| `options` | Object | Opciones adicionales |

**Retorno:** `ScientificCharts` - Instancia para method chaining

**Descripción:** Análisis de concordancia entre dos métodos de medición con límites de acuerdo.

**Uso científico:** Validación clínica, comparación de instrumentos, estudios de reproducibilidad, análisis de métodos.

---

### 9. Gráfico de Radar
```javascript
createRadarChart(categories, values, options)
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `categories` | Array | Dimensiones/categorías |
| `values` | Array | Valores para cada dimensión |
| `options` | Object | Opciones adicionales |

**Retorno:** `ScientificCharts` - Instancia para method chaining

**Descripción:** Gráfico radial para comparar múltiples dimensiones simultáneamente.

**Uso científico:** Perfiles multivariados, análisis de rendimiento, comparación de perfiles, evaluación integral.

---

### 10. Gráfico de Residuos
```javascript
createResidualPlot(predicted, observed, options)
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `predicted` | Array | Valores predichos por el modelo |
| `observed` | Array | Valores observados |
| `options` | Object | Opciones adicionales |

**Retorno:** `ScientificCharts` - Instancia para method chaining

**Descripción:** Residuos vs valores predichos para diagnóstico de modelos.

**Uso científico:** Diagnóstico de regresión, validación de supuestos, detección de heterocedasticidad, análisis de residuos.

---

## Métodos de Utilidad

### Limpiar Gráfico
```javascript
clear()
```
**Retorno:** `ScientificCharts` - Instancia para method chaining

**Descripción:** Limpia el contenido del gráfico actual.

---

### Exportar SVG
```javascript
exportSVG()
```
**Retorno:** `String` - SVG como string

**Descripción:** Exporta el gráfico actual como código SVG.

---

### Redimensionar
```javascript
resize(width, height)
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `width` | Number | Nuevo ancho del gráfico |
| `height` | Number | Nuevo alto del gráfico |

**Retorno:** `ScientificCharts` - Instancia para method chaining

---

## Clase Builder: ScientificChartsBuilder

### Constructor
```javascript
new ScientificChartsBuilder(containerId)
```

### Métodos del Builder

#### Configurar Dimensiones
```javascript
setDimensions(width, height)
```

#### Configurar Márgenes
```javascript
setMargins(top, right, bottom, left)
```

#### Configurar Colores
```javascript
setColors(primary, secondary)
```

#### Configurar Fuente
```javascript
setFont(fontFamily, fontSize)
```

#### Construir
```javascript
build()
```
**Retorno:** `ScientificCharts` - Nueva instancia configurada

**Ejemplo:**
```javascript
const chart = new ScientificChartsBuilder('container')
    .setDimensions(1000, 700)
    .setMargins(60, 60, 80, 80)
    .setColors('#1f77b4', '#ff7f0e')
    .setFont('Arial', 14)
    .build();
```

---

## Configuración por Defecto

```javascript
{
    width: 800,
    height: 600,
    margin: { top: 40, right: 40, bottom: 60, left: 60 },
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: 12,
    titleFontSize: 16,
    axisColor: '#333333',
    gridColor: '#E5E5E5',
    primaryColor: '#2E5BBA',
    secondaryColor: '#D32F2F',
    backgroundColor: '#FFFFFF'
}
```

---

## Dependencias

- D3.js v7 o superior
- Navegador con soporte ES6

---

## Ejemplos de Uso

### Crear múltiples gráficos
```javascript
// Crear instancia
const chart = new ScientificCharts('myChart');

// Crear diferentes visualizaciones
chart.createHistogram(data, 20, { title: 'Distribución de Edad' });

// Más tarde, limpiar y crear otro
chart.clear().createScatterPlot(xData, yData, {
    title: 'Relación Peso-Estatura',
    xLabel: 'Peso (kg)',
    yLabel: 'Estatura (cm)'
});
```

### Uso con el Builder
```javascript
const chart = new ScientificChartsBuilder('chartContainer')
    .setDimensions(1200, 800)
    .setColors('#2E5BBA', '#D32F2F')
    .build()
    .createCorrelationMatrix(correlationMatrix, variableLabels, {
        title: 'Matriz de Correlaciones Genéticas'
    });
```

---

## Notas de Implementación

1. **Validación de Datos:** Todos los métodos incluyen validación básica de tipos y longitudes
2. **Manejo de Errores:** Se lanzan errores descriptivos para datos inválidos
3. **Estilo APA/IEEE:** Fuentes, colores y diseño siguen estándares de publicación científica
4. **Responsive:** Los gráficos se adaptan al tamaño del contenedor
5. **Accesibilidad:** Colores con alto contraste y etiquetas descriptivas
6. **Rendimiento:** Optimizado para datasets grandes con D3.js eficiente