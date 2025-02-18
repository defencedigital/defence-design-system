import React, { useEffect, useRef } from 'react'

import { VirtualElement } from '@floating-ui/react-dom'
import { useOpenClose } from './useOpenClose'
import { useFloatingElement } from './useFloatingElement'

export const CLICK_BUTTON = {
  LEFT: 'left',
  RIGHT: 'right',
} as const

export type ClickType = (typeof CLICK_BUTTON)[keyof typeof CLICK_BUTTON]

interface UseClickMenuParams {
  attachedToRef: React.RefObject<HTMLElement>
  clickType: ClickType
  initialIsOpen: boolean
  onHide?: (e: MouseEvent) => void
  onShow?: (e: MouseEvent) => void
}

type UseClickMenuReturnType = {
  isOpen: boolean
} & ReturnType<typeof useFloatingElement>

function createVirtualElement(): {
  virtualElement: VirtualElement
  setClientPosition: (event: MouseEvent) => void
} {
  let clientX = 0
  let clientY = 0

  const setClientPosition = (event: MouseEvent) => {
    clientX = event.clientX
    clientY = event.clientY
  }

  const virtualElement: VirtualElement = {
    getBoundingClientRect() {
      return {
        top: clientY,
        right: clientX,
        bottom: clientY,
        left: clientX,
        width: 0,
        height: 0,
      } as DOMRect
    },
  }

  return {
    virtualElement,
    setClientPosition,
  }
}

export const useClickMenu = ({
  attachedToRef,
  clickType,
  initialIsOpen,
  onHide,
  onShow,
}: UseClickMenuParams): Omit<
  UseClickMenuReturnType,
  'arrowStyles' | 'floatingPlacement' | 'forceUpdate'
> => {
  const { open, setOpen } = useOpenClose<boolean>(initialIsOpen)

  const {
    current: { virtualElement, setClientPosition },
  } = useRef(createVirtualElement())

  const {
    targetElementRef,
    floatingElement,
    floatingElementRef,
    forceUpdate,
    arrowElementRef,
    styles,
  } = useFloatingElement('auto-end', 'fixed', virtualElement)

  const displayMenu = (e: MouseEvent): void => {
    if (
      !(e.target instanceof Node) ||
      !attachedToRef.current?.contains(e.target)
    ) {
      if (open) {
        setOpen(false)
        onHide?.(e)
      }

      return
    }

    // Click was within bounds of target area
    e.preventDefault()
    e.stopPropagation()

    setClientPosition(e)
    setOpen(true)

    forceUpdate?.()
    onShow?.(e)
  }

  const hideMenu = (e: MouseEvent): void => {
    if (!open || !floatingElement) {
      return
    }

    if (e.target instanceof Node && floatingElement.contains(e.target)) {
      return
    }

    setOpen(false)
    onHide?.(e)
  }

  useEffect(() => {
    if (clickType === 'left') {
      document.addEventListener('click', displayMenu)
    }

    if (clickType === 'right') {
      document.addEventListener('contextmenu', displayMenu)
      document.addEventListener('click', hideMenu)
    }

    return () => {
      document.removeEventListener('contextmenu', displayMenu)
      document.removeEventListener('click', displayMenu)
      document.removeEventListener('click', hideMenu)
    }
  })

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'auto'
  }, [open])

  return {
    isOpen: open,
    targetElementRef,
    floatingElement,
    floatingElementRef,
    arrowElementRef,
    styles,
  }
}
