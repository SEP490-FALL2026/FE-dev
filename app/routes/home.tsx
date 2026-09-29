import { HomePage } from '~/features/home/home-page'
import { i18n } from '~/shared/i18n/i18n'

export function meta() {
  return [
    { title: i18n.t('brand', { ns: 'common' }) },
    {
      name: 'description',
      content: i18n.t('metaDescription', { ns: 'landing' })
    }
  ]
}

export default function Home() {
  return <HomePage />
}
