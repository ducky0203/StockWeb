import { createContext, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { DragEvent as ReactDragEvent } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  ViewportPortal,
  applyNodeChanges,
  getNodesBounds,
  getViewportForBounds,
  useReactFlow,
} from '@xyflow/react'
import type { Node, NodeChange, NodeProps } from '@xyflow/react'
import { toPng } from 'html-to-image'
import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignHorizontalSpaceAround,
  AlignStartHorizontal,
  AlignStartVertical,
  AlignVerticalSpaceAround,
  Download,
  Grid3x3,
  LayoutGrid,
  Lock,
  Maximize,
  RotateCcw,
  Search,
  Unlock,
  X,
} from 'lucide-react'
import { groupTrucQuanByDay } from '@/utils/groupTrucQuanByDay'
import type { TrucQuanGroup } from '@/utils/groupTrucQuanByDay'
import { formatNumber, parsePhanTram } from '@/utils/tableFormat'
import { fetchNLTrucQuan } from '@/features/nguyen_lieu/reducer'
import { useAppDispatch, useAppSelector } from '@/store'
import { ViTriDetailModal } from '@/features/nguyen_lieu/components/viTriShared'
import { LEGEND, fillLevel } from '@/features/nguyen_lieu/components/viTriFill'

interface SoDoKhoProps {
  kho: any
}

interface Pos {
  x: number
  y: number
}

type ViTriNodeData = { row: Record<string, unknown> }
type ViTriNode = Node<ViTriNodeData, 'viTri'>

// Kích thước node & bố cục tự động
const NODE_W = 150
const NODE_H = 64
const COL_GAP = 14
const ROW_GAP = 48
const LABEL_W = 88
const PAD = 24

const DND_MIME = 'application/vitri'

// Khoảng cách (px) đủ gần thì node "dính" vào node bên cạnh
const SNAP_DIST = 12

// Bước lưới khi bật chế độ hít lưới
const GRID = 16

// Đường gióng hỗ trợ căn chỉnh khi kéo node
type Guide = { axis: 'x' | 'y'; pos: number; start: number; end: number }

/**
 * Hít node đang kéo vào các node khác theo 3 cạnh (trái/giữa/phải, trên/giữa/dưới)
 * và trả về đường gióng để hiển thị trực quan lúc kéo.
 */
function computeSnap(
  pos: Pos,
  id: string,
  nodes: ViTriNode[],
): { pos: Pos; guides: Guide[] } {
  const dEX = [pos.x, pos.x + NODE_W / 2, pos.x + NODE_W]
  const dEY = [pos.y, pos.y + NODE_H / 2, pos.y + NODE_H]
  let x = pos.x
  let y = pos.y
  let bestX = SNAP_DIST
  let bestY = SNAP_DIST
  let matchX: { line: number; partner: ViTriNode } | null = null
  let matchY: { line: number; partner: ViTriNode } | null = null

  for (const o of nodes) {
    if (o.id === id) continue
    const oEX = [o.position.x, o.position.x + NODE_W / 2, o.position.x + NODE_W]
    const oEY = [o.position.y, o.position.y + NODE_H / 2, o.position.y + NODE_H]
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const dx = Math.abs(dEX[i] - oEX[j])
        if (dx < bestX) {
          bestX = dx
          x = pos.x + (oEX[j] - dEX[i])
          matchX = { line: oEX[j], partner: o }
        }
        const dy = Math.abs(dEY[i] - oEY[j])
        if (dy < bestY) {
          bestY = dy
          y = pos.y + (oEY[j] - dEY[i])
          matchY = { line: oEY[j], partner: o }
        }
      }
    }
  }

  const guides: Guide[] = []
  if (matchX) {
    const p = matchX.partner
    guides.push({
      axis: 'x',
      pos: matchX.line,
      start: Math.min(y, p.position.y),
      end: Math.max(y + NODE_H, p.position.y + NODE_H),
    })
  }
  if (matchY) {
    const p = matchY.partner
    guides.push({
      axis: 'y',
      pos: matchY.line,
      start: Math.min(x, p.position.x),
      end: Math.max(x + NODE_W, p.position.x + NODE_W),
    })
  }
  return { pos: { x, y }, guides }
}

function snapToNeighbors(pos: Pos, id: string, nodes: ViTriNode[]): Pos {
  return computeSnap(pos, id, nodes).pos
}

type AlignOp =
  | 'left'
  | 'hcenter'
  | 'right'
  | 'top'
  | 'vcenter'
  | 'bottom'
  | 'dist-h'
  | 'dist-v'

/**
 * Căn chỉnh / phân bố đều các node đang được chọn.
 * Mọi node cùng kích thước nên căn theo toạ độ góc trên-trái là đủ chính xác.
 */
function alignNodes(nodes: ViTriNode[], op: AlignOp): ViTriNode[] {
  const sel = nodes.filter((n) => n.selected)
  if (sel.length < 2) return nodes
  const xs = sel.map((n) => n.position.x)
  const ys = sel.map((n) => n.position.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const move = new Map<string, Pos>()

  switch (op) {
    case 'left':
      sel.forEach((n) => move.set(n.id, { x: minX, y: n.position.y }))
      break
    case 'right':
      sel.forEach((n) => move.set(n.id, { x: maxX, y: n.position.y }))
      break
    case 'hcenter': {
      const c = (minX + maxX) / 2
      sel.forEach((n) => move.set(n.id, { x: c, y: n.position.y }))
      break
    }
    case 'top':
      sel.forEach((n) => move.set(n.id, { x: n.position.x, y: minY }))
      break
    case 'bottom':
      sel.forEach((n) => move.set(n.id, { x: n.position.x, y: maxY }))
      break
    case 'vcenter': {
      const c = (minY + maxY) / 2
      sel.forEach((n) => move.set(n.id, { x: n.position.x, y: c }))
      break
    }
    case 'dist-h': {
      const sorted = [...sel].sort((a, b) => a.position.x - b.position.x)
      const step = (maxX - minX) / (sorted.length - 1)
      sorted.forEach((n, i) => move.set(n.id, { x: minX + step * i, y: n.position.y }))
      break
    }
    case 'dist-v': {
      const sorted = [...sel].sort((a, b) => a.position.y - b.position.y)
      const step = (maxY - minY) / (sorted.length - 1)
      sorted.forEach((n, i) => move.set(n.id, { x: n.position.x, y: minY + step * i }))
      break
    }
  }

  return nodes.map((n) => (move.has(n.id) ? { ...n, position: move.get(n.id)! } : n))
}

function viTriKey(row: Record<string, unknown>): string {
  return String(row.id_ViTriKho ?? row.ma_ViTriKho ?? '')
}

function storageKey(idKho: unknown): string {
  return `nl-sodo-kho:${idKho ?? 'all'}`
}

function loadSaved(idKho: unknown): Record<string, Pos> {
  try {
    const raw = localStorage.getItem(storageKey(idKho))
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function saveNodes(idKho: unknown, ns: ViTriNode[]) {
  try {
    const map: Record<string, Pos> = {}
    for (const n of ns) map[n.id] = { x: n.position.x, y: n.position.y }
    localStorage.setItem(storageKey(idKho), JSON.stringify(map))
  } catch {
    /* localStorage đầy hoặc bị chặn — bỏ qua */
  }
}

/** Toạ độ tự động: mỗi dãy một hàng, các vị trí trong dãy xếp thành cột. */
function autoLayout(groups: TrucQuanGroup[]): Record<string, Pos> {
  const out: Record<string, Pos> = {}
  groups.forEach((group, r) => {
    const y = PAD + r * (NODE_H + ROW_GAP)
    group.items.forEach((item, c) => {
      out[viTriKey(item)] = { x: PAD + LABEL_W + c * (NODE_W + COL_GAP), y }
    })
  })
  return out
}

function makeNode(row: Record<string, unknown>, position: Pos): ViTriNode {
  return { id: viTriKey(row), type: 'viTri', position, data: { row } }
}

// Khoá thao tác (ẩn nút × trên node khi khoá)
const LockedContext = createContext(false)

// Id node đang được làm nổi bật tạm thời (sau khi tìm kiếm)
const FlashContext = createContext<string | null>(null)

// ---- Custom node: thẻ vị trí kho trên canvas ----
const ViTriNodeCard = memo(({ id, data, selected }: NodeProps<ViTriNode>) => {
  const { row } = data
  const locked = useContext(LockedContext)
  const flashId = useContext(FlashContext)
  const { deleteElements } = useReactFlow()
  const phanTram = parsePhanTram(row.phanTram) ?? 0
  const level = fillLevel(phanTram)
  const hasStock = phanTram > 0
  const soLuongMax = row.soLuong_Max
  const flashing = flashId === id

  return (
    <div
      className={`group relative rounded-md border shadow-sm transition-shadow hover:shadow-md ${
        selected ? 'ring-2 ring-blue-500 ring-offset-1' : ''
      } ${flashing ? 'animate-pulse ring-2 ring-pink-500 ring-offset-2' : ''}`}
      style={{ width: NODE_W, height: NODE_H, backgroundColor: level.bg, borderColor: level.border }}
      title={`Vị trí ${String(row.ma_ViTriKho ?? '')}${
        row.tenKhachHang ? ` · ${row.tenKhachHang}` : ''
      } · ${hasStock ? `${phanTram}%` : 'Trống'}`}
    >
      {/* Nút đưa về danh sách (ẩn khi khoá) */}
      {!locked && (
        <button
          type="button"
          className="nodrag absolute -right-2 -top-2 hidden rounded-full bg-white p-0.5 text-gray-400 shadow ring-1 ring-gray-200 hover:text-red-500 group-hover:block"
          title="Đưa về danh sách"
          onClick={(e) => {
            e.stopPropagation()
            void deleteElements({ nodes: [{ id }] })
          }}
        >
          <X size={11} />
        </button>
      )}

      <div className="flex h-full flex-col justify-between p-1.5">
        <div className="flex items-center justify-between gap-1">
          <span className="truncate text-[11px] font-semibold text-gray-800">
            {String(row.ma_ViTriKho ?? '—')}
          </span>
          <span
            className="shrink-0 rounded px-1 py-0.5 text-[9px] font-semibold text-white"
            style={{ backgroundColor: level.bar }}
          >
            {hasStock ? `${phanTram}%` : 'Trống'}
          </span>
        </div>
        {hasStock ? (
          <span className="truncate text-[10px] text-gray-500">
            {(row.tenKhachHang as string) || (row.maHang as string) || formatNumber(row.soLuong)}
          </span>
        ) : (
          <span className="text-[10px] text-gray-300">—</span>
        )}
        <div className="h-1.5 overflow-hidden rounded-full bg-white/70">
          <div
            className="h-full rounded-full"
            style={{ width: `${Math.min(phanTram, 100)}%`, backgroundColor: level.bar }}
            title={soLuongMax ? `${formatNumber(row.soLuong)} / ${formatNumber(soLuongMax)}` : undefined}
          />
        </div>
      </div>
    </div>
  )
})
ViTriNodeCard.displayName = 'ViTriNodeCard'

const nodeTypes = { viTri: ViTriNodeCard }

// ---- Chip trong bảng danh sách (kéo được) ----
function PaletteChip({ row }: { row: Record<string, unknown> }) {
  const phanTram = parsePhanTram(row.phanTram) ?? 0
  const level = fillLevel(phanTram)
  const hasStock = phanTram > 0
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(DND_MIME, viTriKey(row))
        e.dataTransfer.effectAllowed = 'move'
      }}
      className="flex cursor-grab items-center justify-between gap-1 rounded border px-1.5 py-1 text-[11px] active:cursor-grabbing"
      style={{ backgroundColor: level.bg, borderColor: level.border }}
      title={`Vị trí ${String(row.ma_ViTriKho ?? '')}${hasStock ? ` · ${phanTram}%` : ' · Trống'}`}
    >
      <span className="truncate font-semibold text-gray-800">{String(row.ma_ViTriKho ?? '—')}</span>
      <span
        className="shrink-0 rounded px-1 text-[9px] font-semibold text-white"
        style={{ backgroundColor: level.bar }}
      >
        {hasStock ? `${phanTram}%` : '–'}
      </span>
    </div>
  )
}

// ---- Nội dung chính (bên trong ReactFlowProvider) ----
function FlowInner({
  groups,
  rowsByKey,
  idKho,
}: {
  groups: TrucQuanGroup[]
  rowsByKey: Map<string, Record<string, unknown>>
  idKho: unknown
}) {
  const initialNodes = useMemo(() => {
    const saved = loadSaved(idKho)
    const out: ViTriNode[] = []
    for (const [key, pos] of Object.entries(saved)) {
      const row = rowsByKey.get(key)
      if (row) out.push(makeNode(row, pos))
    }
    return out
  }, [rowsByKey, idKho])

  const [nodes, setNodes] = useState<ViTriNode[]>(initialNodes)
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null)
  const [locked, setLocked] = useState(false)
  const [spaceHeld, setSpaceHeld] = useState(false)
  const [guides, setGuides] = useState<Guide[]>([])
  const [gridSnap, setGridSnap] = useState(false)
  const [query, setQuery] = useState('')
  const [flashId, setFlashId] = useState<string | null>(null)
  const { screenToFlowPosition, setCenter, fitView } = useReactFlow()

  // Giữ tham chiếu tới danh sách node mới nhất để tính đường gióng lúc kéo
  const nodesRef = useRef<ViTriNode[]>(nodes)
  nodesRef.current = nodes
  const flowWrapperRef = useRef<HTMLDivElement>(null)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (flashTimer.current) clearTimeout(flashTimer.current)
  }, [])

  const selectedCount = useMemo(() => nodes.filter((n) => n.selected).length, [nodes])

  // Chỉ cho phép kéo chuột di chuyển khung nhìn khi đang giữ phím cách
  useEffect(() => {
    const isTypingTarget = (el: EventTarget | null) => {
      const node = el as HTMLElement | null
      if (!node) return false
      const tag = node.tagName
      return tag === 'INPUT' || tag === 'TEXTAREA' || node.isContentEditable
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isTypingTarget(e.target)) {
        e.preventDefault()
        setSpaceHeld(true)
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setSpaceHeld(false)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  const onNodesChange = useCallback(
    (changes: NodeChange<ViTriNode>[]) => {
      // Tính đường gióng dựa trên node đang kéo (dragging=true)
      const cur = nodesRef.current
      let dragging = false
      const nextGuides: Guide[] = []
      for (const c of changes) {
        if (c.type === 'position' && c.position && c.dragging) {
          dragging = true
          nextGuides.push(...computeSnap(c.position, c.id, cur).guides)
        }
      }
      setGuides(dragging ? nextGuides : [])

      setNodes((nds) => {
        // Hít node vào node lân cận — cả khi đang kéo lẫn lúc nhả chuột (dragging=false)
        const adjusted = changes.map((c) =>
          c.type === 'position' && c.position
            ? { ...c, position: snapToNeighbors(c.position, c.id, nds) }
            : c,
        )
        const next = applyNodeChanges(adjusted, nds)
        // Lưu ngay khi thêm/bớt node (kéo di chuyển lưu ở onNodeDragStop)
        if (changes.some((c) => c.type === 'remove')) saveNodes(idKho, next)
        return next
      })
    },
    [idKho],
  )

  const placedIds = useMemo(() => new Set(nodes.map((n) => n.id)), [nodes])

  const palette = useMemo(
    () =>
      groups
        .map((g) => ({ day: g.day, items: g.items.filter((it) => !placedIds.has(viTriKey(it))) }))
        .filter((g) => g.items.length),
    [groups, placedIds],
  )

  const addNode = (row: Record<string, unknown>, position: Pos) => {
    setNodes((nds) => {
      if (nds.some((n) => n.id === viTriKey(row))) return nds
      const pos = snapToNeighbors(position, viTriKey(row), nds)
      const next = nds.concat(makeNode(row, pos))
      saveNodes(idKho, next)
      return next
    })
  }

  const onDrop = (e: ReactDragEvent) => {
    if (locked) return
    e.preventDefault()
    const key = e.dataTransfer.getData(DND_MIME)
    const row = key ? rowsByKey.get(key) : undefined
    if (!row) return
    const p = screenToFlowPosition({ x: e.clientX, y: e.clientY })
    addNode(row, { x: p.x - NODE_W / 2, y: p.y - NODE_H / 2 })
  }

  const onDragOver = (e: ReactDragEvent) => {
    if (locked) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const autoPlaceAll = () => {
    const auto = autoLayout(groups)
    const all = groups.flatMap((g) =>
      g.items.map((it) => makeNode(it, auto[viTriKey(it)] ?? { x: PAD, y: PAD })),
    )
    setNodes(all)
    saveNodes(idKho, all)
  }

  const clearAll = () => {
    setNodes([])
    try {
      localStorage.removeItem(storageKey(idKho))
    } catch {
      /* bỏ qua */
    }
  }

  const runAlign = (op: AlignOp) => {
    setNodes((nds) => {
      const next = alignNodes(nds, op)
      saveNodes(idKho, next)
      return next
    })
  }

  const fitToSelection = () => {
    const sel = nodesRef.current.filter((n) => n.selected)
    if (!sel.length) return
    void fitView({ nodes: sel.map((n) => ({ id: n.id })), padding: 0.3, duration: 400 })
  }

  const flash = (id: string) => {
    setFlashId(id)
    if (flashTimer.current) clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setFlashId(null), 1600)
  }

  const focusNode = (id: string) => {
    const n = nodesRef.current.find((x) => x.id === id)
    if (!n) return
    setNodes((nds) => nds.map((x) => ({ ...x, selected: x.id === id })))
    void setCenter(n.position.x + NODE_W / 2, n.position.y + NODE_H / 2, {
      zoom: 1.4,
      duration: 500,
    })
    flash(id)
  }

  // Kết quả tìm kiếm theo mã vị trí (cả đã xếp lẫn chưa xếp)
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return [] as { row: Record<string, unknown>; placed: boolean }[]
    const out: { row: Record<string, unknown>; placed: boolean }[] = []
    for (const [key, row] of rowsByKey) {
      const ma = String(row.ma_ViTriKho ?? '').toLowerCase()
      if (ma.includes(q)) out.push({ row, placed: placedIds.has(key) })
      if (out.length >= 8) break
    }
    return out
  }, [query, rowsByKey, placedIds])

  const goToResult = (row: Record<string, unknown>, placed: boolean) => {
    const key = viTriKey(row)
    if (placed) {
      focusNode(key)
    } else {
      // Thêm node vào giữa khung nhìn hiện tại rồi focus
      const rect = flowWrapperRef.current?.getBoundingClientRect()
      const center = rect
        ? screenToFlowPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
        : { x: PAD, y: PAD }
      addNode(row, { x: center.x - NODE_W / 2, y: center.y - NODE_H / 2 })
      setTimeout(() => focusNode(key), 0)
    }
    setQuery('')
  }

  const exportPng = () => {
    const ns = nodesRef.current
    if (!ns.length) return
    const viewport = flowWrapperRef.current?.querySelector<HTMLElement>('.react-flow__viewport')
    if (!viewport) return
    const bounds = getNodesBounds(ns)
    const imageWidth = Math.max(Math.ceil(bounds.width) + 2 * PAD, 640)
    const imageHeight = Math.max(Math.ceil(bounds.height) + 2 * PAD, 480)
    const vp = getViewportForBounds(bounds, imageWidth, imageHeight, 0.2, 2, 0.12)
    void toPng(viewport, {
      backgroundColor: '#ffffff',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${vp.x}px, ${vp.y}px) scale(${vp.zoom})`,
      },
    }).then((dataUrl) => {
      const a = document.createElement('a')
      a.download = `so-do-kho-${idKho ?? 'all'}.png`
      a.href = dataUrl
      a.click()
    })
  }

  const total = rowsByKey.size

  return (
    <LockedContext.Provider value={locked}>
    <FlashContext.Provider value={flashId}>
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* Thanh công cụ + chú thích */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2">
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
          <span className="font-medium text-gray-500">Mức lấp đầy:</span>
          {LEGEND.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-600">
            Đã xếp <b className="text-gray-800">{nodes.length}</b>/{total}
          </div>
          {!locked && (
            <>
              <button
                type="button"
                onClick={autoPlaceAll}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                title="Tự xếp toàn bộ vị trí theo dãy"
              >
                <LayoutGrid size={13} />
                Tự xếp theo dãy
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                title="Đưa tất cả về danh sách"
              >
                <RotateCcw size={13} />
                Xoá bố cục
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setLocked((v) => !v)}
            aria-pressed={locked}
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
              locked
                ? 'border-amber-200 bg-amber-50 text-amber-600'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            title={locked ? 'Mở khoá để chỉnh sửa' : 'Khoá chế độ hiển thị'}
          >
            {locked ? <Lock size={13} /> : <Unlock size={13} />}
            {locked ? 'Đã khoá' : 'Khoá'}
          </button>
        </div>
      </div>

      {/* Danh sách (trái) + canvas (phải) */}
      <div className="flex min-h-0 flex-1 gap-3">
        {/* Bảng danh sách gộp theo dãy (ẩn khi khoá) */}
        {!locked && (
        <aside className="flex w-60 shrink-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-3 py-2 text-xs font-semibold text-gray-600">
            Danh sách vị trí · kéo ra sơ đồ
          </div>
          <div className="min-h-0 flex-1 space-y-3 overflow-auto p-2">
            {palette.length === 0 ? (
              <p className="px-2 py-6 text-center text-xs text-gray-400">Đã xếp hết vị trí</p>
            ) : (
              palette.map((g) => (
                <div key={g.day}>
                  <div className="mb-1 flex items-center justify-between px-0.5">
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-semibold text-blue-600">
                      Dãy {g.day}
                    </span>
                    <span className="text-[10px] text-gray-400">{g.items.length}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {g.items.map((it) => (
                      <PaletteChip key={viTriKey(it)} row={it} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
        )}

        {/* Vùng vẽ sơ đồ */}
        <div
          ref={flowWrapperRef}
          className="relative min-h-0 flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white"
          onDrop={onDrop}
          onDragOver={onDragOver}
          style={{ cursor: spaceHeld ? 'grab' : undefined }}
        >
          <ReactFlow<ViTriNode>
            nodes={nodes}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            onNodeClick={(_e, node) => setSelected(node.data.row)}
            onNodeDragStop={() => {
              setGuides([])
              setNodes((nds) => (saveNodes(idKho, nds), nds))
            }}
            nodesDraggable={!locked}
            elementsSelectable={!locked}
            deleteKeyCode={locked ? null : ['Backspace', 'Delete']}
            nodesConnectable={false}
            edgesFocusable={false}
            panOnDrag={spaceHeld}
            selectionOnDrag={!spaceHeld && !locked}
            selectionMode={SelectionMode.Partial}
            snapToGrid={gridSnap}
            snapGrid={[GRID, GRID]}
            onlyRenderVisibleElements
            elevateNodesOnSelect
            fitView
            fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
            minZoom={0.2}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
          >
            <ViewportPortal>
              {guides.map((g, i) =>
                g.axis === 'x' ? (
                  <div
                    key={`v-${i}`}
                    className="pointer-events-none"
                    style={{
                      position: 'absolute',
                      transform: `translate(${g.pos}px, ${g.start}px)`,
                      width: 1,
                      height: g.end - g.start,
                      backgroundColor: '#ec4899',
                      zIndex: 4,
                    }}
                  />
                ) : (
                  <div
                    key={`h-${i}`}
                    className="pointer-events-none"
                    style={{
                      position: 'absolute',
                      transform: `translate(${g.start}px, ${g.pos}px)`,
                      width: g.end - g.start,
                      height: 1,
                      backgroundColor: '#ec4899',
                      zIndex: 4,
                    }}
                  />
                ),
              )}
            </ViewportPortal>
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
            <Controls showInteractive={false} />
            <MiniMap
              pannable
              zoomable
              nodeColor={(n) => fillLevel(parsePhanTram((n.data as ViTriNodeData).row.phanTram) ?? 0).bar}
              nodeStrokeWidth={2}
            />

            {/* Tìm kiếm vị trí + xuất ảnh + hít lưới */}
            <Panel position="top-right" className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <Search
                    size={13}
                    className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchResults[0]) {
                        goToResult(searchResults[0].row, searchResults[0].placed)
                      }
                      if (e.key === 'Escape') setQuery('')
                    }}
                    placeholder="Tìm mã vị trí…"
                    className="w-44 rounded-md border border-gray-200 bg-white py-1.5 pl-7 pr-2 text-xs shadow-sm outline-none focus:border-blue-300"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setGridSnap((v) => !v)}
                  aria-pressed={gridSnap}
                  className={`inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs shadow-sm transition-colors ${
                    gridSnap
                      ? 'border-blue-200 bg-blue-50 text-blue-600'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Bật/tắt hít theo lưới"
                >
                  <Grid3x3 size={13} />
                </button>
                <button
                  type="button"
                  onClick={exportPng}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-600 shadow-sm hover:bg-gray-50"
                  title="Xuất sơ đồ ra ảnh PNG"
                >
                  <Download size={13} />
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="w-56 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                  {searchResults.map(({ row, placed }) => (
                    <button
                      key={viTriKey(row)}
                      type="button"
                      onClick={() => goToResult(row, placed)}
                      className="flex w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left text-xs hover:bg-blue-50"
                    >
                      <span className="truncate font-medium text-gray-800">
                        {String(row.ma_ViTriKho ?? '—')}
                      </span>
                      <span
                        className={`shrink-0 rounded px-1 py-0.5 text-[9px] font-semibold ${
                          placed ? 'bg-gray-100 text-gray-500' : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        {placed ? 'Đã xếp' : 'Thêm vào'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </Panel>

            {/* Căn chỉnh nhiều node được chọn */}
            {!locked && selectedCount >= 2 && (
              <Panel
                position="top-center"
                className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-1.5 py-1 shadow-md"
              >
                <span className="px-1 text-[11px] font-medium text-gray-500">
                  {selectedCount} vị trí
                </span>
                <span className="mx-0.5 h-4 w-px bg-gray-200" />
                {(
                  [
                    ['left', AlignStartVertical, 'Căn trái'],
                    ['hcenter', AlignCenterVertical, 'Căn giữa (ngang)'],
                    ['right', AlignEndVertical, 'Căn phải'],
                    ['top', AlignStartHorizontal, 'Căn trên'],
                    ['vcenter', AlignCenterHorizontal, 'Căn giữa (dọc)'],
                    ['bottom', AlignEndHorizontal, 'Căn dưới'],
                  ] as const
                ).map(([op, Icon, label]) => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => runAlign(op)}
                    title={label}
                    className="rounded p-1 text-gray-600 hover:bg-gray-100"
                  >
                    <Icon size={15} />
                  </button>
                ))}
                {selectedCount >= 3 && (
                  <>
                    <span className="mx-0.5 h-4 w-px bg-gray-200" />
                    <button
                      type="button"
                      onClick={() => runAlign('dist-h')}
                      title="Phân bố đều theo chiều ngang"
                      className="rounded p-1 text-gray-600 hover:bg-gray-100"
                    >
                      <AlignHorizontalSpaceAround size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => runAlign('dist-v')}
                      title="Phân bố đều theo chiều dọc"
                      className="rounded p-1 text-gray-600 hover:bg-gray-100"
                    >
                      <AlignVerticalSpaceAround size={15} />
                    </button>
                  </>
                )}
                <span className="mx-0.5 h-4 w-px bg-gray-200" />
                <button
                  type="button"
                  onClick={fitToSelection}
                  title="Phóng vừa vùng chọn"
                  className="rounded p-1 text-gray-600 hover:bg-gray-100"
                >
                  <Maximize size={15} />
                </button>
              </Panel>
            )}
          </ReactFlow>
        </div>
      </div>

      {selected && <ViTriDetailModal row={selected} onClose={() => setSelected(null)} />}
    </div>
    </FlashContext.Provider>
    </LockedContext.Provider>
  )
}

export default function SoDoKho({ kho }: SoDoKhoProps) {
  const dispatch = useAppDispatch()
  const { loading, listTrucQuan } = useAppSelector((state) => state.NguyenLieuReducer)

  const rows = listTrucQuan as Record<string, unknown>[]
  const groups = useMemo(() => groupTrucQuanByDay(rows), [rows])
  const rowsByKey = useMemo(() => {
    const m = new Map<string, Record<string, unknown>>()
    for (const r of rows) m.set(viTriKey(r), r)
    return m
  }, [rows])

  useEffect(() => {
    if (kho?.id_Kho < 0) return
    dispatch(fetchNLTrucQuan({ ...kho, search: '' }))
  }, [dispatch, kho])

  if (kho?.id_Kho < 0) {
    return <p className="px-4 py-8 text-center text-sm text-gray-400">Vui lòng chọn kho</p>
  }

  if (loading) {
    return <p className="px-4 py-8 text-center text-sm text-gray-400">Đang tải…</p>
  }

  if (!groups.length) {
    return <p className="px-4 py-8 text-center text-sm text-gray-400">Không có dữ liệu sơ đồ kho</p>
  }

  return (
    <ReactFlowProvider>
      <FlowInner
        key={`${kho?.id_Kho ?? 'all'}|${groups.length}`}
        groups={groups}
        rowsByKey={rowsByKey}
        idKho={kho?.id_Kho}
      />
    </ReactFlowProvider>
  )
}
