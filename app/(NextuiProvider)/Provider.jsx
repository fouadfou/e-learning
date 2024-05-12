'use client'

import {NextUIProvider} from '@nextui-org/react'

export function Provider({children}) {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  )
}