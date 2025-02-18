import React, { useMemo } from 'react'

import { ComponentWithClass } from '../../common/ComponentWithClass'
import { useClickMenu, ClickType, CLICK_BUTTON } from '../../hooks/useClickMenu'
import { StyledContextMenu } from './partials/StyledContextMenu'

export interface ContextMenuProps extends ComponentWithClass {
  /**
   * A ref object for the element associated with the component.
   */
  attachedToRef: React.RefObject<HTMLElement>
  /**
   * Should the menu display when the user uses a left or right mouse click.
   */
  clickType?: ClickType
  /**
   * Toggles whether the menu is open on first render.
   */
  initialIsOpen?: boolean
  /**
   * Optional handler function to be invoked when the component is hidden.
   */
  onHide?: (event: MouseEvent) => void
  /**
   * Optional handler function to be invoked when the component is displayed.
   */
  onShow?: (event: MouseEvent) => void
}

export const ContextMenu = ({
  attachedToRef,
  children,
  clickType = CLICK_BUTTON.RIGHT,
  initialIsOpen = false,
  onHide,
  onShow,
  ...rest
}: ContextMenuProps) => {
  const { isOpen, floatingElementRef, styles } = useClickMenu({
    attachedToRef,
    clickType,
    initialIsOpen,
    onHide,
    onShow,
  })

  const hasIcons = useMemo(() => {
    return !!React.Children.toArray(children).filter(
      (child: React.ReactNode) => (child as React.ReactElement)?.props?.icon
    ).length
  }, [children])

  return (
    <StyledContextMenu
      ref={floatingElementRef}
      $hasIcons={hasIcons}
      $isOpen={isOpen}
      style={styles}
      data-testid="context-menu"
      role="menu"
      {...rest}
    >
      {children}
    </StyledContextMenu>
  )
}

ContextMenu.displayName = 'ContextMenu'
