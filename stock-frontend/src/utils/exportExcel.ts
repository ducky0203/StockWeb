import ExcelJS from 'exceljs'
import { formatDate } from './tableFormat'
import type { ColDescriptor } from './tableColumns'

const THIN_BORDER: ExcelJS.BorderStyle = 'thin'
const HEADER_BG = '4F46E5'

function cellBorders(): Partial<ExcelJS.Borders> {
  const side = { style: THIN_BORDER, color: { argb: 'E2E8F0' } } as ExcelJS.Border
  return { top: side, left: side, bottom: side, right: side }
}

function cellValueForExport(value: unknown, col: ColDescriptor): ExcelJS.CellValue {
  if (value == null || value === '') return null
  if (col.excelType === 'number') {
    const n = Number(value)
    return Number.isNaN(n) ? String(value) : n
  }
  if (col.excelType === 'date') {
    const iso = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (iso) {
      const d = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
      if (!Number.isNaN(d.getTime())) return d
    }
    const d = new Date(String(value))
    return Number.isNaN(d.getTime()) ? formatDate(value) : d
  }
  return String(value)
}

function autoColumnWidths(sheet: ExcelJS.Worksheet, columns: ColDescriptor[]) {
  sheet.columns.forEach((column, i) => {
    let max = (columns[i]?.title?.length || 8) + 2
    column.eachCell?.({ includeEmpty: false }, (cell) => {
      const text =
        cell.value instanceof Date
          ? formatDate(cell.value)
          : cell.value != null
            ? String(cell.value)
            : ''
      max = Math.max(max, text.length + 1)
    })
    column.width = Math.min(44, Math.max(10, max))
  })
}

export async function exportTableToExcel({
  columns,
  data,
  fileName,
  sheetName = 'Tồn kho',
}: {
  columns: ColDescriptor[]
  data: Record<string, unknown>[]
  fileName: string
  sheetName?: string
}): Promise<void> {
  if (!columns?.length) return

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'StockWeb'
  workbook.created = new Date()

  const sheet = workbook.addWorksheet(sheetName, {
    views: [{ state: 'frozen', ySplit: 1 }],
  })

  const headerRow = sheet.addRow(columns.map((c) => c.title))
  headerRow.height = 26
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFF' }, size: 11, name: 'Calibri' }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_BG } }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cell.border = cellBorders()
  })

  for (const row of data) {
    const values = columns.map((col) => cellValueForExport(row[col.field], col))
    const dataRow = sheet.addRow(values)
    dataRow.eachCell((cell, colNumber) => {
      const col = columns[colNumber - 1]
      cell.font = { size: 11, name: 'Calibri', color: { argb: '334155' } }
      cell.border = cellBorders()
      cell.alignment = {
        vertical: 'middle',
        horizontal: col?.excelType === 'number' ? 'right' : 'left',
        wrapText: true,
      }
      if (col?.excelType === 'number' && typeof cell.value === 'number') {
        cell.numFmt = '#,##0.##'
      }
      if (col?.excelType === 'date' && cell.value instanceof Date) {
        cell.numFmt = 'dd/mm/yyyy'
      }
    })
  }

  autoColumnWidths(sheet, columns)

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`
  link.click()
  URL.revokeObjectURL(url)
}
