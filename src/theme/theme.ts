export const lightTheme = {
  colors: {
    primary: "#F6C5D8", // rosa pastel cálido (color principal)
    secondary: "#C9C7F4", // lavanda pastel suave

    background: "#FDFBFF", // blanco suave ligeramente rosado
    surface: "#FFFFFF", // tarjetas/fondos neutrales
    surfaceMuted: "#F7F4FA", // superficie secundaria
    text: "#3C3A4A", // gris oscuro violeta, suave y legible
    textSecondary: "#7E7B8A", // gris lavanda para texto secundario
    border: "#ECE9F2", // borde tenue lavanda grisáceo

    onPrimary: "#322232",
    onSecondary: "#2E273B",
    onBackground: "#3C3A4A",
    onSurface: "#3C3A4A",

    chartRing: "#E3DFED",
    chartAxis: "#D5D0E2",
    chartOutline: "#8F8AA3",
    chartFill: "rgba(246, 197, 216, 0.45)",
    chartPoint: "#F6C5D8",
    chartLabel: "#3C3A4A",

    transparent: "transparent",

    error: "#DC2626",
    success: "#10B981",

    // Priority levels
    priorityVeryLow: "#94A3B8",
    priorityLow: "#CBD5E1",
    priorityMedium: "#FCD34D",
    priorityHigh: "#FB923C",
    priorityVeryHigh: "#F87171",
  },
};

export const darkTheme = {
  colors: {
    primary: "#E6AFC8", // rosa pastel profundo, visible en oscuro
    secondary: "#B6B3F0", // lavanda pastel un poco más saturado

    background: "#1B1A22", // gris-azulado muy oscuro (no negro puro)
    surface: "#262530", // tarjetas y contenedores
    surfaceMuted: "#312F3C",
    text: "#ECE9F2", // texto claro con leve tono lavanda
    textSecondary: "#A7A4B6", // gris-lavanda para textos secundarios
    border: "#34323F", // bordes muy sutiles

    onPrimary: "#201320",
    onSecondary: "#1D1927",
    onBackground: "#ECE9F2",
    onSurface: "#ECE9F2",

    chartRing: "#3F3C4C",
    chartAxis: "#4B475A",
    chartOutline: "#BBB6CB",
    chartFill: "rgba(230, 175, 200, 0.45)",
    chartPoint: "#E6AFC8",
    chartLabel: "#ECE9F2",

    transparent: "transparent",

    error: "#DC2626",
    success: "#10B981",

    // Priority levels (same for dark mode)
    priorityVeryLow: "#94A3B8",
    priorityLow: "#CBD5E1",
    priorityMedium: "#FCD34D",
    priorityHigh: "#FB923C",
    priorityVeryHigh: "#F87171",
  },
};

// Color utility function for opacity
export const withOpacity = (color: string, opacity: number): string => {
  // Convert opacity (0-1) to hex (00-FF)
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");
  return `${color}${alpha}`;
};
