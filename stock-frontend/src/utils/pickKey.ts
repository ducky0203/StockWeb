export function pickKey(row: Record<string, unknown> | undefined | null, candidates: string[]): string | undefined {
  if (!row) return undefined
  const keys = Object.keys(row)
  for (const cand of candidates) {
    const match = keys.find((k) => k.toLowerCase() === cand.toLowerCase())
    if (match) return match
  }
  return undefined
}
