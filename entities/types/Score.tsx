const scores = ["very low", "low", "medium", "high", "very high"] as const;

export type Score = (typeof scores)[number];
export default Score;
