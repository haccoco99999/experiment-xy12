export type ExperimentGroup = 'plant' | 'animal'
export const SUPPORTED_LOCALES = ['vi'] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export interface CatalogItem {
  n: number
  id: string
  group: ExperimentGroup
  emoji: string
  title: string
  sub: string
  available?: boolean
}

export interface MountHomeOptions {
  catalog: readonly CatalogItem[]
}

export interface TitleStats {
  total: number
  available: number
  plant: number
  animal: number
  averageLength: number
  longest: {
    id: string
    number: number
    length: number
  } | null
}

export function summarizeCatalogTitles(catalog: readonly CatalogItem[]): TitleStats {
  let available = 0
  let plant = 0
  let animal = 0
  let totalLength = 0
  let longest: TitleStats['longest'] = null

  for (const item of catalog) {
    const length = Array.from(item.title).length
    totalLength += length
    if (item.available !== false) available += 1
    if (item.group === 'plant') plant += 1
    else animal += 1

    if (!longest || length > longest.length) {
      longest = { id: item.id, number: item.n, length }
    }
  }

  return {
    total: catalog.length,
    available,
    plant,
    animal,
    averageLength: catalog.length ? Math.round(totalLength / catalog.length) : 0,
    longest
  }
}

export interface LabModernApi {
  mountHome(target: HTMLElement, options: MountHomeOptions): boolean
  unmountHome(): void
  isMounted(): boolean
  getLocale(): AppLocale
  getDocumentTitle(): string
  getExperimentTitle(id: string, fallback: string): string
}
