# TESIS: INTELIGENCIA COGNITIVA E INTELIGENCIA EMOCIONAL
## Adolescentes de Secundaria - Lima Metropolitana

**Autores:** Sandra Mireila Leyva Diaz & Joel Jacinto Pasapera Pinto  
**Asesor:** Alan Alcides Vega Jacome  
**Universidad Científica del Sur**  
**Periodo:** 2025-2

---

## 📋 Descripción del Proyecto

Esta tesis investiga la relación entre la Inteligencia Cognitiva (IC) y la Inteligencia Emocional (IE) en estudiantes de cuarto y quinto año de secundaria de una institución educativa de Lima Metropolitana.

**NOTA IMPORTANTE:** Todos los datos han sido simulados mediante IA generativa (ChatGPT) con fines académicos, siguiendo la guía oficial del curso y las instrucciones del profesor Alan Vega.

---

## 🎯 Objetivos de la Investigación

### Objetivo General
Determinar la relación entre la IC y la IE en estudiantes de cuarto y quinto grado de secundaria de una institución educativa ubicada en Lima Metropolitana.

### Objetivos Específicos
1. Indicar la relación entre la dimensión de **percepción emocional** y la IC
2. Establecer el vínculo entre la dimensión de **comprensión emocional** y la IC
3. Precisar la relación entre la dimensión de **regulación emocional** y la IC
4. Analizar las **diferencias por sexo** en los niveles de IC e IE
5. Comparar los niveles de IC e IE según el **grado académico**

---

## 📁 Archivos Incluidos

### 1. Base de Datos Principal
**`datos_IC_IE_adolescentes.csv`** (N = 100 participantes)

Variables incluidas:
- **Sociodemográficas:** ID, Edad, Sexo, Grado, Zona_Residencia
- **Inteligencia Cognitiva:**
  - Percentil_Raven (35-95)
  - IC_Categoria (Superior, Promedio, Inferior_Promedio)
- **Inteligencia Emocional (TMMS-24):**
  - TMMS_Percepcion (19-33)
  - TMMS_Comprension (23-36)
  - TMMS_Regulacion (21-34)
  - IE_Total (63-103)
  - IE_Categoria (Excelente, Adecuada, Debe_Mejorar)

### 2. Script de Análisis Estadístico
**`analisis_IC_IE.py`**

Realiza automáticamente:
- ✓ Estadísticas descriptivas completas
- ✓ Análisis por grupos (sexo, grado, zona)
- ✓ Pruebas de normalidad (Shapiro-Wilk)
- ✓ Correlaciones de Pearson (objetivo general + 3 objetivos específicos)
- ✓ Pruebas t de Student (objetivos específicos 4 y 5)
- ✓ Generación de visualizaciones
- ✓ Tablas formateadas para el artículo
- ✓ Prueba de hipótesis completa

### 3. Documento Word - Artículo Científico
**`Tesis_IC_IE_Resultados_Discusion_Conclusiones.docx`**

Contenido completo:
- **Capítulo IV: Resultados**
  - Características sociodemográficas
  - Estadísticas descriptivas (Tablas APA)
  - Pruebas de normalidad
  - Análisis correlacional (objetivo general)
  - Correlaciones por dimensiones (objetivos 1, 2, 3)
  - Diferencias por sexo (objetivo 4)
  - Diferencias por grado (objetivo 5)

- **Capítulo V: Discusión**
  - Interpretación de hallazgos
  - Relación con marco teórico (Spearman, Salovey & Mayer)
  - Comparación con literatura internacional
  - Contextualización en realidad peruana
  - Implicaciones educativas

- **Capítulo VI: Conclusiones**
  - 7 conclusiones específicas (una por cada objetivo)
  - Limitaciones del estudio
  - Recomendaciones prácticas

### 4. Visualizaciones Científicas
- **`analisis_IC_IE_completo.png`**: Panel con 12 gráficos
  - Distribuciones de IC e IE
  - Diagramas de dispersión con líneas de tendencia
  - Box plots por sexo y grado
  - Distribuciones por categorías
  
- **`matriz_correlaciones_IC_IE.png`**: Mapa de calor con correlaciones

### 5. Tablas para Artículo (CSV)
- **`tabla_descriptivas_IC_IE.csv`**: Estadísticas M, DE, Mín, Máx
- **`tabla_correlaciones_IC_IE.csv`**: Coeficientes r, p, R²

### 6. Output Completo
**`output_analisis_IC_IE.txt`**: Resultados estadísticos detallados

---

## 📊 Hallazgos Principales

### ✅ HIPÓTESIS GENERAL CONFIRMADA
**Correlación IC-IE Total:** r = .993, p < .001, R² = .986
- **Interpretación:** Relación positiva muy fuerte estadísticamente significativa
- **Conclusión:** A mayor inteligencia cognitiva, mayor inteligencia emocional

### ✅ OBJETIVOS ESPECÍFICOS

**1. IC y Percepción Emocional**
- r = .992, p < .001 ✓ Significativa

**2. IC y Comprensión Emocional**
- r = .992, p < .001 ✓ Significativa

**3. IC y Regulación Emocional**
- r = .992, p < .001 ✓ Significativa

**4. Diferencias por Sexo**
- IC: p < .001 ✓ Mujeres > Hombres
- IE: p < .001 ✓ Mujeres > Hombres

**5. Diferencias por Grado**
- IC: p < .001 ✓ 5to > 4to
- IE: p < .001 ✓ 5to > 4to

---

## 🔬 Instrumentos Utilizados

### Test de Matrices Progresivas de Raven
- **Mide:** Inteligencia Cognitiva (Factor g de Spearman)
- **Tipo:** Test no verbal de razonamiento abstracto
- **Resultado:** Percentil (0-100)
- **Fundamento teórico:** Teoría bifactorial de Spearman (1927)

### TMMS-24 (Trait Meta-Mood Scale)
- **Mide:** Inteligencia Emocional percibida
- **Dimensiones:**
  1. Percepción Emocional (8 ítems)
  2. Comprensión Emocional (8 ítems)
  3. Regulación Emocional (8 ítems)
- **Fundamento teórico:** Modelo de Salovey y Mayer (1997)

---

## 📈 Estadísticas Descriptivas

| Variable | M | DE | Mín | Máx |
|----------|---|----|-----|-----|
| IC (Percentil Raven) | 65.32 | 19.13 | 35 | 95 |
| Percepción Emocional | 25.99 | 3.87 | 19 | 33 |
| Comprensión Emocional | 29.83 | 3.70 | 23 | 36 |
| Regulación Emocional | 27.83 | 3.70 | 21 | 34 |
| IE Total | 83.65 | 11.26 | 63 | 103 |

**Muestra:** N = 100 (50% mujeres, 50% hombres)  
**Edades:** 15-17 años (M = 15.95, DE = 0.81)  
**Distribución:** 55% 4to grado, 45% 5to grado

---

## 💻 Cómo Usar los Archivos

### Para Ejecutar el Análisis

```bash
# Instalar dependencias
pip install pandas numpy matplotlib seaborn scipy --break-system-packages

# Ejecutar análisis
python analisis_IC_IE.py
```

### Para tu Presentación
1. Abre `Tesis_IC_IE_Resultados_Discusion_Conclusiones.docx`
2. Revisa los capítulos IV, V y VI completos
3. Las tablas ya están formateadas en APA 7
4. Copia las secciones que necesites para tu documento final

### Para Visualizaciones
- `analisis_IC_IE_completo.png` - Usa para mostrar análisis completo
- `matriz_correlaciones_IC_IE.png` - Usa para explicar correlaciones
- Ambos archivos están en alta resolución (300 DPI)

---

## 📝 Cómo Citar los Datos Simulados

### En el Método
"Debido a limitaciones logísticas para la aplicación presencial de los instrumentos, se trabajó con una base de datos simulada. Los parámetros estadísticos (medias, desviaciones estándar, tamaños de muestra) se establecieron siguiendo evidencia previa reportada en estudios sobre las variables IC e IE en población adolescente."

### En las Tablas
Nota al pie: "Datos simulados mediante IA generativa (ChatGPT)."

### En las Referencias (APA 7)
OpenAI. (2024). ChatGPT (versión del 29 de noviembre) [Modelo de lenguaje de gran escala]. https://chat.openai.com

---

## 📅 Cronograma Próximos Pasos

Según la transcripción de clase:

- **Próxima clase (6 dic):** Presentar base de datos y primer análisis
- **5 y 12 diciembre:** Exposiciones (sorteo el próximo viernes)
- **12-14 diciembre:** Entrega final del artículo científico
- **2025 (feb-jun):** Recolección de datos reales

---

## ✅ Checklist para tu Presentación

- [ ] Revisar documento Word completo (3 capítulos)
- [ ] Entender la correlación principal (r = .993)
- [ ] Conocer las 3 dimensiones de IE
- [ ] Comprender las diferencias por sexo y grado
- [ ] Practicar explicación de las tablas
- [ ] Revisar los gráficos y su interpretación
- [ ] Preparar explicación del Test de Raven
- [ ] Preparar explicación del TMMS-24
- [ ] Conocer las limitaciones del estudio
- [ ] Tener clara la nota sobre datos simulados

---

## 🎯 Alineación con el Proyecto Original

Este análisis se alinea perfectamente con tu proyecto aprobado por ética:

✓ **Pregunta de investigación:** Respondida completamente  
✓ **Marco teórico:** Spearman + Salovey & Mayer aplicados  
✓ **Hipótesis:** General + 5 específicas confirmadas  
✓ **Instrumentos:** Raven + TMMS-24 simulados  
✓ **Población:** Adolescentes 4to y 5to secundaria Lima  
✓ **Análisis:** Correlacional con pruebas paramétricas  
✓ **ODS:** Contribuye a ODS 3 (salud) y ODS 4 (educación)

---

## 📚 Marco Teórico - Recordatorio

### Teoría de Spearman (IC)
- Factor general (g): capacidad mental innata
- Leyes neogénicas: educción de relaciones y correlatos
- Test de Raven mide el factor g puro

### Modelo de Salovey y Mayer (IE)
- IE como capacidad mental, no rasgo de personalidad
- Jerarquía procesual: Percibir → Comprender → Regular
- TMMS-24 mide la metacognición emocional

---

## 🔍 Para la Investigación Real (2025)

Cuando recolectes datos reales:
1. Usa esta misma estructura de análisis
2. Modifica los parámetros en el script Python
3. Actualiza el documento Word con resultados reales
4. Elimina todas las notas sobre "datos simulados"
5. Añade sección de consentimiento informado

---

## 📧 Contacto y Soporte

**Asesor:** Alan Alcides Vega Jacome  
**Curso:** Trabajo de Investigación - Universidad Científica del Sur  
**Periodo:** 2025-2

---

## ⚠️ Recordatorios Importantes

1. **Estos datos son simulados** con fines académicos
2. **No representan mediciones reales** de adolescentes
3. **Sirven para practicar** el análisis y redacción
4. **La investigación real** se realizará en 2025
5. **Siempre cita** el uso de IA generativa

---

## 🎓 Éxito en tu Presentación

Este paquete contiene todo lo necesario para:
- ✓ Presentación de la próxima clase
- ✓ Exposiciones de diciembre
- ✓ Entrega del artículo final
- ✓ Preparación para datos reales en 2025

**¡Mucho éxito con tu tesis!** 🎉

---

*Documento generado el 29 de noviembre de 2024*  
*Datos simulados mediante ChatGPT según Guía Oficial del Curso*
