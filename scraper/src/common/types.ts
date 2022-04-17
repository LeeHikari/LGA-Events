export type LGAEvent = {
  title: string
  description: string | null
  startDate: Date
  endDate: Date | null
  category: string | null // should be an array `categories`
  id: string
  imageUrl: string
  url: string
  lga: 'parramatta' | 'innerwest' | 'campbelltown'
}
