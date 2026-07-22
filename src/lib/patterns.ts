import rawPatterns from "../../public/data/patterns.json";
import type { Pattern } from "./types";

export const PATTERNS: Pattern[] = rawPatterns as Pattern[];

const PATTERNS_BY_ID = new Map(PATTERNS.map((p) => [p.id, p]));

export function getPatternById(id: string): Pattern | undefined {
  return PATTERNS_BY_ID.get(id);
}

export function fillTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] ?? "");
}
