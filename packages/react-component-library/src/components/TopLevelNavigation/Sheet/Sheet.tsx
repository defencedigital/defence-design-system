import React from 'react'
import { Placement } from '@floating-ui/react-dom'

import {
  FLOATING_BOX_PLACEMENT,
  FloatingBox,
} from '../../../primitives/FloatingBox'
import { ComponentWithClass } from '../../../common/ComponentWithClass'
import { SheetButtonProps } from './SheetButton'
import { useExternalId } from '../../../hooks/useExternalId'
import { useHideShow } from '../../../hooks/useHideShow'

export interface SheetProps extends ComponentWithClass {
  button: React.ReactElement<SheetButtonProps>
  children: React.ReactElement
  placement?: Placement
  closeDelay?: number
  id?: string
  initialIsOpen?: boolean
}

export const Sheet = ({
  button,
  children,
  placement = FLOATING_BOX_PLACEMENT.RIGHT,
  closeDelay = 250,
  id: externalId,
  initialIsOpen = false,
  ...rest
}: SheetProps) => {
  const id = useExternalId('sheet', externalId)
  const { floatingBoxChildrenRef, isVisible, mouseEvents } = useHideShow(
    true,
    closeDelay,
    initialIsOpen
  )

  const SheetTarget = () => {
    return React.cloneElement(button as React.ReactElement, {
      ...button.props,
      ...mouseEvents,
      'aria-expanded': isVisible,
      'aria-owns': id,
    })
  }

  return (
    <FloatingBox
      isVisible={isVisible}
      placement={placement}
      renderTarget={<SheetTarget />}
      scheme="dark"
      {...rest}
    >
      <div ref={floatingBoxChildrenRef}>
        {React.cloneElement(children, {
          id,
        })}
      </div>
    </FloatingBox>
  )
}

Sheet.displayName = 'Sheet'
