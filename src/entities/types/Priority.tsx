export const priorities = [
  "very low",
  "low",
  "medium",
  "high",
  "very high",
] as const;
export type Priority = (typeof priorities)[number];

export function isPriority(value: string): value is Priority {
  return (priorities as readonly string[]).includes(value);
}

export default Priority;
