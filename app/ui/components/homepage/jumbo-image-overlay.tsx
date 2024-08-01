'use client'

import { v4 as createId } from 'uuid' 
import Link from 'next/link'

import Button from 'app/ui/components/core/button'
import { useState, useEffect, useId, useMemo } from 'react'
import { font_playfair } from 'app/ui/fonts'
import { languages } from 'app/i18n/settings'
import { useTranslation } from 'app/i18n/client'

interface JumbotronSlidingItem {
  key: string;
  backgroundImage: string;
  title: string;
  description: string;
  button: {
    text: string;
    link: string;
  };
  next: JumbotronSlidingItem;
}

type JumbotronSlidingItemData = Omit<JumbotronSlidingItem, 'key' | 'next'>;

class CircularQueueNode implements JumbotronSlidingItem {
  key = createId()
  next
  backgroundImage = ''
  title = ''
  description = ''
  button = {
    text: '',
    link: '',
  }

  constructor(params?: JumbotronSlidingItemData) {
    if (params) {
      this.set(params)
    }
    this.next = this as JumbotronSlidingItem
  }

  set(params: JumbotronSlidingItemData): this {
    this.backgroundImage = params.backgroundImage || ''
    this.title = params.title || ''
    this.description = params.description || ''
    this.button = params.button || { text: '', link: '' }
    return this
  }

  add(params: JumbotronSlidingItemData): this {
    const newNode = new CircularQueueNode(params)
    const head = this
    let cursor = head.next
    while (cursor.next.key !== head.key) {
      cursor = cursor.next
    }
    cursor.next = newNode
    newNode.next = head
    return this
  }
}

type TranslationItemIds = 
'ae6084b4-ee9e-439d-9b41-630c10b0f719'
| 'ace0134d-c3e8-454e-bd5b-a78fa05deeb1'
| '4e96acca-2af9-4f58-a607-f2cb65eb7333'

const ITEM_DATA: Record<TranslationItemIds, {
  backgroundImage: string
  route: string
}> = {
  'ae6084b4-ee9e-439d-9b41-630c10b0f719': {
    backgroundImage: '/pxfuel.jpg',
    route: '/about',
  },
  'ace0134d-c3e8-454e-bd5b-a78fa05deeb1': {
    backgroundImage: '/pxfuel-2.jpg',
    route: '/contact',
  },
  '4e96acca-2af9-4f58-a607-f2cb65eb7333': {
    backgroundImage: '/pxfuel.jpg',
    route: '/about',
  },
}

type TranslationItem = Pick<JumbotronSlidingItem, 'title' | 'description'> & {
  _id: TranslationItemIds
  buttonText: string
}

type Props = {
  id?: string;
}
export default function JumboImageOverlay({ id }: Props) {
  const [lng] = languages
  const { t } = useTranslation(lng)

  const headNode = useMemo(() => {
    const translations = t('jumbotron-items', { returnObjects: true }) as TranslationItem[]
    const head = new CircularQueueNode()
    translations.forEach((item, index) => {
      const data = ITEM_DATA[item._id]
      const params = {
        title: item.title,
        description: item.description,
        backgroundImage: data.backgroundImage,
        button: {
          text: item.buttonText,
          link: data.route,
        },
      }
      if (index === 0) {
        head.set(params)
      } else {
        head.add(params)
      }
    })
    return head
  }, [])

  const [currentItem, setCurrentItem] = useState<CircularQueueNode>(headNode)

  useEffect(() => {
    setTimeout(() => {
      setCurrentItem(currentItem.next as CircularQueueNode)
    }, 6000)
  }, [currentItem])

  return (
    <div className="w-full h-screen relative" id={id}>
      <div
        className="w-full h-screen jtron absolute"
        style={{ backgroundImage: `url(${currentItem.backgroundImage})` }}
      ></div>
      <div className="absolute bg-white px-12 py-10 mx-6 my-6 bottom-0 max-w-lg min-w-min anm" key={currentItem.key}>
        <h2 className={font_playfair.className + ' text-2xl mb-3 mobile-visible:whitespace-pre'}>{ currentItem.title }</h2>
        <p className="text-md text-gray-600 mb-6">{ currentItem.description }</p>
        <Link href={ currentItem.button.link }>
          <Button label={ currentItem.button.text }></Button>
        </Link>
      </div>
    </div>
  )
}
