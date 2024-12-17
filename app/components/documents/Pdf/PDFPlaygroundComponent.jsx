'use client'
import dynamic from 'next/dynamic'

const AverPDF = dynamic(() => import('@/app/components/ui/AverPDF'), {
  ssr: false,
})

export default function PDFPlaygroundComponent({document}) {
  
  const fallbackData = {
    title: document.name,
    paragraphs: document.content
  }

  return <AverPDF initialContent={fallbackData} />
}