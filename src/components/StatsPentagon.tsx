// CharacterStatsPentagon.tsx
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
// Importamos componentes SVG específicos.
// OJO: Text de react-native-svg se renombra para no chocar con Text normal.
import Svg, { Circle, Line, Polygon, Text as SvgText } from "react-native-svg";
import { useTheme } from "../theme/ThemeContext";

// Definimos el tipo de props que acepta el componente.
type Props = {
  size?: number; // tamaño del SVG (ancho y alto)
  maxValue?: number; // valor máximo de la escala para normalizar
  values?: number[]; // valores de los stats
  labels?: string[]; // nombres de los stats
};

export default function StatsPentagon({
  // Valores por defecto si el padre no pasa props
  size = 375,
  maxValue = 10, // 👈 ahora trabajamos sobre escala 0–10
  values = [10, 6, 4, 5, 9], // 5 valores de ejemplo
  labels = ["Communication", "Awareness", "Fun", "Affection", "Security"], // 5 nombres
}: Props) {
  // 1) Obtenemos los colores desde el theme (no hardcodeamos hex aquí).
  const theme = useTheme();
  const ringColor = theme.colors.chartRing;
  const axisColor = theme.colors.chartAxis;
  const outlineColor = theme.colors.chartOutline;
  const dataStrokeColor = theme.colors.chartPoint;
  const dataFillColor = theme.colors.chartFill;
  const labelColor = theme.colors.chartLabel;

  // Número de lados del polígono (5 = pentágono).
  const sides = values.length;

  // 2) Centro del SVG (coordenadas x e y).
  const cx = size / 2;
  const cy = size / 2;

  // 3) Radio del pentágono externo (la "caja" máxima de stats).
  const radius = size * 0.32;

  // 4) Radio donde colocaremos las etiquetas, un poco más lejos del pentágono.
  const labelRadius = size * 0.4;

  // PERFORMANCE OPTIMIZATION: Memoize basePoints calculation to prevent
  // unnecessary recalculation on every render when dependencies haven't changed.
  // 5) Cálculo de los puntos base del pentágono máximo.
  //    Cada punto se calcula en base a un ángulo (en radianes),
  //    repartiendo 360° (2π radianes) entre los 5 lados.
  const basePoints = useMemo(() => {
    return Array.from({ length: sides }).map((_, i) => {
      // Calculamos el ángulo para el lado i.
      // (2π * i / sides) reparte los puntos en círculo.
      // Restamos π/2 para que el primer punto esté arriba (ángulo -90º).
      const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;

      // Coordenadas cartesianas del punto en el perímetro:
      // x = cx + r * cos(angle)
      // y = cy + r * sin(angle)
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      // Guardamos también el ángulo porque lo reutilizaremos para dataPoints y labels.
      return { x, y, angle };
    });
  }, [sides, cx, cy, radius]);

  // 6) String de puntos para el pentágono externo (SVG espera "x1,y1 x2,y2 ...").
  const outerPointsStr = basePoints.map((p) => `${p.x},${p.y}`).join(" ");

  // PERFORMANCE OPTIMIZATION: Memoize dataPoints calculation.
  // 7) Cálculo de los puntos de datos según los valores.
  const dataPoints = useMemo(() => {
    return basePoints.map((p, i) => {
      // Valor bruto: si no hay valor en la posición i, usamos 0.
      const raw = values[i] ?? 0;

      // Clampeamos el valor al rango [0, maxValue] para que nada se salga.
      const value = Math.max(0, Math.min(raw, maxValue));

      // Ratio normalizado 0–1 (0 = nada, 1 = valor máximo).
      const ratio = value / maxValue;

      // Radio efectivo para este stat: cuanto más alto el valor,
      // más se acerca al pentágono externo (radius).
      const r = radius * ratio;

      // Proyectamos el punto sobre la misma dirección (p.angle),
      // pero con el radio reducido según el valor.
      const x = cx + r * Math.cos(p.angle);
      const y = cy + r * Math.sin(p.angle);

      // Devolvemos el punto con su valor (lo usaremos para pintar y para la media).
      return { x, y, value };
    });
  }, [basePoints, values, maxValue, radius, cx, cy]);

  // 8) String de puntos para el pentágono que representa los datos.
  const dataPointsStr = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // PERFORMANCE OPTIMIZATION: Memoize average calculation.
  // 9) Calculamos la media para mostrarla en el centro.
  //    Sumamos los valores y dividimos por el número de lados.
  const average = useMemo(() => {
    return dataPoints.reduce((sum, p) => sum + p.value, 0) / sides;
  }, [dataPoints, sides]);

  // RESPONSIVE DESIGN: Scale label fontSize based on size to prevent overlap.
  // On small SVGs (< 300px), labels can overlap. This scales proportionally.
  const labelFontSize = Math.max(10, size * 0.032);

  // ACCESSIBILITY: Build detailed description for screen readers.
  // Format individual scores for accessibility hint.
  const individualScoresText = labels
    .map((label, i) => `${label}: ${dataPoints[i]?.value ?? 0}`)
    .join(", ");

  const accessibilityHint = `Pentagon chart showing ${labels.join(
    ", "
  )}. Average score is ${
    Math.round(average * 10) / 10
  } out of ${maxValue}. Individual scores: ${individualScoresText}`;

  return (
    <View
      style={styles.container}
      // ACCESSIBILITY: Add screen reader support for the SVG visualization
      accessibilityRole="image"
      accessibilityLabel="Relationship statistics visualization"
      accessibilityHint={accessibilityHint}
    >
      {/* El componente SVG es el lienzo donde vamos a dibujar el gráfico. */}
      <Svg width={size} height={size}>
        {/* 10) Dibujamos los "anillos" de nivel (25%, 50%, 75%, 100%).
                Son pentágonos concéntricos que ayudan a leer la escala. */}
        {[0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const r = radius * ratio;

          // Calculamos los puntos del pentágono escalado por ese ratio.
          const ringPoints = basePoints
            .map((p) => {
              const x = cx + r * Math.cos(p.angle);
              const y = cy + r * Math.sin(p.angle);
              return `${x},${y}`;
            })
            .join(" ");

          return (
            <Polygon
              key={idx}
              points={ringPoints}
              stroke={ringColor}
              strokeWidth={1}
              fill="none"
            />
          );
        })}

        {/* 11) Dibujamos las líneas radiales (ejes) desde el centro
                hacia cada vértice del pentágono máximo. */}
        {basePoints.map((p, i) => (
          <Line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke={axisColor}
            strokeWidth={1}
          />
        ))}

        {/* 12) Pentágono externo que marca el límite máximo (100% del stat). */}
        <Polygon
          points={outerPointsStr}
          stroke={outlineColor}
          strokeWidth={2}
          fill="none"
        />

        {/* 13) Pentágono que representa los datos actuales (forma del "personaje"). */}
        <Polygon
          points={dataPointsStr}
          stroke={dataStrokeColor}
          strokeWidth={2}
          fill={dataFillColor}
        />

        {/* 14) Puntos circulares en cada vértice del pentágono de datos
                para enfatizar cada stat. */}
        {dataPoints.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={4} fill={dataStrokeColor} />
        ))}

        {/* 15) Etiquetas de stats alrededor del pentágono. */}
        {basePoints.map((p, i) => {
          const label = labels[i] ?? `Stat ${i + 1}`;

          // Posición de la etiqueta: mismo ángulo, pero con radio labelRadius
          // (un poco más lejos que el pentágono máximo).
          const lx = cx + labelRadius * Math.cos(p.angle);
          const ly = cy + labelRadius * Math.sin(p.angle);

          return (
            <SvgText
              key={i}
              x={lx}
              y={ly}
              fontSize={labelFontSize}
              fill={labelColor}
              textAnchor="middle" // centramos el texto respecto a x
              alignmentBaseline="middle" // centramos el texto respecto a y
            >
              {label}
            </SvgText>
          );
        })}

        {/* 16) Valor medio en el centro del gráfico.
                Mostramos la media (sobre 10), redondeada a 1 decimal. */}
        <SvgText
          x={cx}
          y={cy}
          fontSize={22}
          fontWeight="bold"
          fill={theme.colors.onSurface}
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {Math.round(average * 10) / 10 /* por ejemplo: 7.4 */}
        </SvgText>
      </Svg>
    </View>
  );
}

// 17) Estilos del contenedor externo. Solo afecta al <View>, no al SVG interno.
const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
