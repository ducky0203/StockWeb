export interface FillLevel {
  label: string
  bg: string
  bar: string
  border: string
}

/** Màu sắc theo mức lấp đầy (%) của một vị trí kho. Dùng chung cho Trực quan & Sơ đồ kho. */
export function fillLevel(phanTram: number): FillLevel {
  if (phanTram <= 0) return { label: 'Trống', bg: '#f9fafb', bar: '#e5e7eb', border: '#e5e7eb' }
  if (phanTram < 40) return { label: '< 40%', bg: '#f0fdf4', bar: '#22c55e', border: '#86efac' }
  if (phanTram < 70) return { label: '40–70%', bg: '#fefce8', bar: '#eab308', border: '#fde047' }
  if (phanTram < 90) return { label: '70–90%', bg: '#fff7ed', bar: '#f97316', border: '#fdba74' }
  return { label: '≥ 90%', bg: '#fef2f2', bar: '#ef4444', border: '#fca5a5' }
}

export const LEGEND: { label: string; color: string }[] = [
  { label: 'Trống', color: '#e5e7eb' },
  { label: '< 40%', color: '#22c55e' },
  { label: '40–70%', color: '#eab308' },
  { label: '70–90%', color: '#f97316' },
  { label: '≥ 90%', color: '#ef4444' },
]
