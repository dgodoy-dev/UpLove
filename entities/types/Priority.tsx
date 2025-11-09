const priorities = ["very low", "low", "medium", "high", "very high"] as const;
export type Priority = (typeof priorities)[number];
export default Priority;
