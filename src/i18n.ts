import { _, addMessages, init } from '@sveltia/i18n'
import {
  type AppLocale,
  type CatalogItem
} from './catalog'

const viMessages = {
  'app.brand': 'Phòng thí nghiệm sân vườn',
  'home.skip': 'Đi tới danh sách thí nghiệm',
  'home.eyebrow': '{$count} thí nghiệm khoa học tương tác',
  'home.lead': 'Em hãy chọn một thí nghiệm để bắt đầu nhé!',
  'home.intro': 'Quan sát từng thay đổi, kéo và thả dụng cụ, rồi tự nói lên điều em khám phá được.',
  'home.choose': 'Chọn thí nghiệm',
  'home.catalog': 'Danh sách tám thí nghiệm',
  'stats.heading': 'Thống kê tiêu đề',
  'stats.total': '{$count} tiêu đề',
  'stats.available': '{$count} bài đã mở',
  'stats.plant': '{$count} bài thực vật',
  'stats.animal': '{$count} bài động vật',
  'stats.details': 'Chi tiết độ dài',
  'stats.average': 'Tiêu đề dài trung bình {$count} ký tự.',
  'stats.longest': 'Thí nghiệm {$number} có tiêu đề dài nhất: {$count} ký tự.',
  'group.plant.title': 'Thực vật',
  'group.plant.intro': 'Theo dõi cây sống, trao đổi chất và sinh sản.',
  'group.animal.title': 'Động vật',
  'group.animal.intro': 'Quan sát nhu cầu sống và vòng đời của động vật.',
  'card.number': 'Thí nghiệm {$number}',
  'card.start': 'Bắt đầu khám phá',
  'card.startLabel': 'Bắt đầu khám phá thí nghiệm {$number}: {$title}',
  'card.coming': 'Sắp có',
  'garden.label': 'Vườn khoa học 3D',
  'garden.caption': 'Vườn khoa học 3D: nơi em chọn bài và bắt đầu quan sát.',
  'footer.drag': 'Kéo và thả dụng cụ, quan sát và rút ra kết luận.',
  'footer.score': 'Không có điểm số, em cứ thoải mái thử nhé!',
  'experiment.title': 'THÍ NGHIỆM {$number}: {$title}',
  'catalog.exp1.title': '5 yếu tố cần thiết cho sự sống và phát triển của thực vật',
  'catalog.exp1.sub': 'Cây đậu xanh',
  'catalog.exp2.title': 'Trao đổi khí, nước và chất khoáng của thực vật với môi trường',
  'catalog.exp2.sub': 'Cây xanh trong chậu',
  'catalog.exp3.title': '5 yếu tố cần thiết cho sự sống và phát triển của động vật',
  'catalog.exp3.sub': 'Gà con',
  'catalog.exp4.title': 'Trao đổi nước, không khí và thức ăn của động vật với môi trường',
  'catalog.exp4.sub': 'Chuột bạch',
  'catalog.exp5.title': 'Cơ quan sinh sản của thực vật có hoa và quá trình tạo quả, hạt',
  'catalog.exp5.sub': 'Hoa cà chua',
  'catalog.exp6.title': 'Sự hình thành cây con từ hạt, rễ, thân và lá của thực vật',
  'catalog.exp6.sub': 'Đậu xanh - Khoai lang - Khoai tây - Thuốc bỏng',
  'catalog.exp7.title': 'Sinh sản và vòng đời của động vật đẻ trứng',
  'catalog.exp7.sub': 'Bướm',
  'catalog.exp8.title': 'Sinh sản và vòng đời của động vật đẻ con',
  'catalog.exp8.sub': 'Heo'
} as const

type MessageKey = keyof typeof viMessages

try {
  localStorage.removeItem('lab.locale')
} catch (error) {
  console.warn('Không xóa được lựa chọn ngôn ngữ cũ; giao diện vẫn dùng tiếng Việt.', error)
}

addMessages('vi', viMessages)
init({
  fallbackLocale: 'vi',
  initialLocale: 'vi',
  handleMissingMessage(key, missingLocale) {
    console.error(`Thiếu bản dịch "${key}" cho locale "${missingLocale}".`)
  }
})

export function t(key: MessageKey, values?: Record<string, unknown>): string {
  return _(key, values ? { values } : undefined)
}

export function getLocale(): AppLocale {
  return 'vi'
}

function translatedPart(id: string, part: 'title' | 'sub', fallback: string): string {
  const key = `catalog.${id}.${part}` as MessageKey
  return key in viMessages ? _(key, { default: fallback }) : fallback
}

export function localizeCatalog(catalog: readonly CatalogItem[]): CatalogItem[] {
  return catalog.map((item) => ({
    ...item,
    title: translatedPart(item.id, 'title', item.title),
    sub: translatedPart(item.id, 'sub', item.sub)
  }))
}

export function getDocumentTitle(): string {
  return t('app.brand')
}

export function getExperimentTitle(id: string, fallback: string): string {
  const number = Number.parseInt(id.replace(/^exp/, ''), 10)
  const title = translatedPart(id, 'title', fallback)
  return Number.isFinite(number)
    ? t('experiment.title', { number, title })
    : fallback
}

export function getGroupTitle(group: 'plant' | 'animal'): string {
  return t(group === 'plant' ? 'group.plant.title' : 'group.animal.title')
}

