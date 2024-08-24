import { randomUUID } from 'crypto'

import SidebarDesktop from 'app/ui/components/sidebar/sidebar-desktop'
import type { SidebarMenuItem } from 'app/lib/definitions'
import withTranslations from '@/ui/components/hoc/withTranslations/server'
import { Translations } from '../hoc/withTranslations/types'

const navMenuItems = ({ t }: Translations): SidebarMenuItem[] => ([
  {
    key: randomUUID(),
    text: t('homepage'),
    route: '/',
  },
  {
    key: randomUUID(),
    text: t('why-us'),
    route: '/about',
  },
  {
    key: randomUUID(),
    text: t('services'),
    route: '/services',
  },
  {
    key: randomUUID(),
    text: t('cases'),
    route: '/',
  },
  {
    key: randomUUID(),
    text: t('faq'),
    route: '/faq',
  },
  {
    key: randomUUID(),
    text: t('contact'),
    route: '/contact',
  },
])

type Props = {} & Translations
async function Sidebar({ t }: Props) {
  return (
    <SidebarDesktop menuItems={navMenuItems({ t })}></SidebarDesktop>
  )
}

export default withTranslations(Sidebar)
