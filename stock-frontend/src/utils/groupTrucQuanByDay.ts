export interface TrucQuanGroup {
  day: string
  items: Record<string, unknown>[]
}

export function groupTrucQuanByDay(rows: Record<string, unknown>[] | null | undefined): TrucQuanGroup[] {
  if (!rows?.length) return []
  const map = new Map<string, Record<string, unknown>[]>()
  for (const row of rows) {
    const day = row['day'] != null && row['day'] !== '' ? String(row['day']) : '—'
    if (!map.has(day)) map.set(day, [])
    map.get(day)!.push(row)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b, 'vi', { numeric: true, sensitivity: 'base' }))
    .map(([day, items]) => ({
      day,
      items: items.sort((x, y) => {
        const ax = x['stt_ViTriKho'] ?? x['ma_ViTriKho'] ?? ''
        const by = y['stt_ViTriKho'] ?? y['ma_ViTriKho'] ?? ''
        return String(ax).localeCompare(String(by), 'vi', { numeric: true })
      }),
    }))
}
