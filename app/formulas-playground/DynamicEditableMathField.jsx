'use client'

import React, { useEffect } from 'react'
import { EditableMathField, addStyles } from 'react-mathquill'

export default function DynamicEditableMathField({ latex, onChange, className }) {
  useEffect(() => {
    addStyles()
  }, [])

  return (
    <EditableMathField
      latex={latex}
      onChange={onChange}
      className={className}
    />
  )
}

