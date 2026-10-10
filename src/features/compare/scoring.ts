import { compareRows, compareColumns } from '@/shared/config/site'
import type { CompareMark } from '@/shared/types/site'

export interface CompareScore {
  lead: string[]
  behind: string[]
  tie: string[]
}

// Honest scoreboard from the comparison table: full beats partial beats none.
// Rows that are notes only (no mark) don't count.
const rank: Record<string, number> = { yes: 2, part: 1, no: 0 }
export function scoreFor(key: string): CompareScore {
  const col = compareColumns.indexOf(key) + 2
  const out: CompareScore = { lead: [], behind: [], tie: [] }
  compareRows.forEach((g) => g.rows.forEach((r) => {
    const a = rank[(r[1] as [CompareMark, string?])[0] as string], b = rank[(r[col] as [CompareMark, string?] | undefined)?.[0] as string]
    if (a === undefined || b === undefined) return
    out[a > b ? 'lead' : a < b ? 'behind' : 'tie'].push(r[0] as string)
  }))
  return out
}
