'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../../sanity.config'
import { useEffect } from 'react'

export default function StudioPage() {
  useEffect(() => {
    // Hide header and footer when studio loads
    const header = document.querySelector('[class*="sticky top-0 z-40"]') as HTMLElement
    const footer = document.querySelector('footer') as HTMLElement

    if (header) header.style.display = 'none'
    if (footer) footer.style.display = 'none'

    // Cleanup when component unmounts
    return () => {
      if (header) header.style.display = ''
      if (footer) footer.style.display = ''
    }
  }, [])

  return <NextStudio config={config} />
}
