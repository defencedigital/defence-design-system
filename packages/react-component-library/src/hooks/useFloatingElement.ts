import React from 'react'
import {
  arrow,
  Placement,
  Strategy,
  useFloating,
  VirtualElement,
} from '@floating-ui/react-dom'

import { useStatefulRef } from './useStatefulRef'

export const useFloatingElement = (
  placement: Placement = 'bottom',
  strategy: Strategy = 'fixed',
  externalTargetElement: Element | VirtualElement | null = null
): {
  arrowElementRef: (node: HTMLElement | null) => void
  arrowStyles: React.CSSProperties
  floatingElement: HTMLElement | null
  floatingElementRef: (node: HTMLElement | null) => void
  floatingPlacement: Placement
  forceUpdate: () => void
  styles: React.CSSProperties
  targetElementRef: (node: Element | null) => void
} => {
  const [arrowElement, arrowElementRef] = useStatefulRef<HTMLElement>()

  const {
    middlewareData,
    placement: floatingPlacement,
    update,
    refs,
    styles,
  } = useFloating({
    placement,
    strategy,
    elements: {
      reference: externalTargetElement,
    },
    middleware: [
      arrow({
        element: arrowElement,
        padding: 20,
      }),
    ],
  })

  const arrowStyles = {
    left: middlewareData.arrow?.x == null ? '' : `${middlewareData.arrow.x}px`,
    top: middlewareData.arrow?.y == null ? '' : `${middlewareData.arrow.y}px`,
  }

  return {
    arrowElementRef,
    arrowStyles,
    floatingElement: refs.floating.current,
    floatingElementRef: refs.floating,
    floatingPlacement,
    forceUpdate: update,
    styles,
    targetElementRef: refs.reference,
  }
}
