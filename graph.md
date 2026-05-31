# StatSim Pro — Validación contra SPSS & R

&gt; Analizador estadístico profesional implementado 100 % en el navegador. Sin frameworks pesados, sin backend, sin instalación.

[![GitHub Pages](https://img.shields.io/badge/🌐_Demo_Online-StatSim_Pro-2E5BBA?style=for-the-badge)](https://joelpasapera.github.io/StatSim-Pro.github.io/)

---

## 📊 Evidencia de validación

Los resultados arrojados por **StatSim Pro** fueron comparados directamente con los reportados por **IBM SPSS Statistics** (versión estándar de laboratorio) sobre la **misma base de datos**.

### Archivo de prueba
- [`base_datos_simulada.csv`](./base_datos_simulada.csv) — Base de datos simulada generada con el módulo interno de StatSim Pro (*N* = 300 participantes, variables `Total_R` y `Total_T`).

### Resultados obtenidos

#### 1. Correlación no paramétrica (Spearman)

| Métrica | StatSim Pro | IBM SPSS | Diferencia |
|---------|:-----------:|:--------:|:----------:|
| **ρ de Spearman** | **−0.0590** | **−0.059** | **0.0000** |
| **p-valor (bilateral)** | **0.3088** | **0.309** | **0.0002** |
| *N* | 300 | 300 | — |

#### 2. Prueba de normalidad — Kolmogorov-Smirnov (Lilliefors)

| Variable | Métrica | StatSim Pro | IBM SPSS | Diferencia |
|----------|---------|:-----------:|:--------:|:----------:|
| **Total_R** | Estadístico *D* | **0.0381** | **0.038** | **0.0001** |
| | p-valor | **0.3599** | 0.200¹ | — |
| **Total_T** | Estadístico *D* | **0.0803** | **0.080** | **0.0000** |
| | p-valor | **0.0001** | **&lt; .001** | — |

&gt; ¹ SPSS reporta *p* = 0.200 como **límite inferior de la significación verdadera** (ver pie de tabla en SPSS). StatSim Pro calcula el valor p exacto mediante la aproximación de Dallal-Wilkinson/Khorzad, arrojando un resultado más informativo (*p* = 0.3599).

### Capturas de pantalla

**Correlación de Spearman — StatSim Pro vs. SPSS**

![Spearman StatSim Pro vs SPSS](./docs/validacion_spearman.png)

**Pruebas de normalidad — StatSim Pro vs. SPSS**

![Normalidad StatSim Pro vs SPSS](./docs/validacion_normalidad.png)

---

## 🛠️ Tecnología

| Aspecto | Elección |
|---------|----------|
| **Frontend** | HTML5, CSS3, JavaScript puro (vanilla JS) |
| **Gráficos** | D3.js v7 (única dependencia externa, vendoreada) |
| **Build** | Ninguno. Zero-build, zero-config |
| **Backend** | Ninguno. Todo el procesamiento es client-side |
| **Hosting** | GitHub Pages (gratuito) |

---

## 📚 Motor estadístico implementado desde cero

- **Shapiro-Wilk** — Algoritmo de Royston (1992, AS R94), mismo que usan R y SPSS
- **Kolmogorov-Smirnov** — Corrección de Lilliefors (Dallal-Wilkinson / Khorzad)
- **Correlación** — Pearson y Spearman con intervalos de confianza (Fisher z; Bonett-Wright para Spearman)
- **Pruebas t** — Student y Welch
- **ANOVA** — Una vía con η²
- **No paramétricas** — Mann-Whitney U, Kruskal-Wallis con ε²
- **Chi-cuadrado** — Independencia con V de Cramér
- **Regresión** — Lineal simple por mínimos cuadrados
- **Fiabilidad** — Alfa de Cronbach por escala y dimensiones
- **p-valores** — Beta incompleta regularizada por fracción continua de Lentz (Numerical Recipes)

---

## 🚀 Uso

1. Abre la demo: [joelpasapera.github.io/StatSim-Pro.github.io](https://joelpasapera.github.io/StatSim-Pro.github.io/)
2. Ve a la pestaña **Simulador** para generar una base de datos
3. Ve a la pestaña **Analizador** para cargar tus datos (CSV) o usar los generados
4. Selecciona variables, tipo de análisis y ejecuta

---

## 🎓 Público objetivo

- Estudiantes de psicología, educación, sociología y ciencias de la salud
- Investigadores que necesitan análisis rápidos sin licencias de software propietario
- Docentes que buscan herramientas accesibles para enseñar estadística

---

## 📄 Licencia

MIT © Joel Pasapera

---

&gt; *"Construido para resolver un problema que vivía todos los días: perder horas en SPSS sin entender qué hacía. Ahora el análisis y la interpretación están en un solo clic."*
