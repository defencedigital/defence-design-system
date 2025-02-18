import React, { forwardRef, useLayoutEffect, useRef } from 'react'
import { Placement } from '@floating-ui/react-dom'
import { Transition } from 'react-transition-group'
import mergeRefs from 'react-merge-refs'

import { ComponentWithClass } from '../../common/ComponentWithClass'
import { FloatingBoxContent } from './FloatingBoxContent'
import { FloatingBoxSchemeType } from './types'
import { PositionType } from '../../common/Position'
import { StyledFloatingBox } from './partials/StyledFloatingBox'
import { StyledTarget } from './partials/StyledTarget'
import { StyledArrow } from './partials/StyledArrow'
import { useFloatingElement } from '../../hooks/useFloatingElement'
import { FLOATING_BOX_SCHEME } from './constants'
import { useExternalId } from '../../hooks/useExternalId'

export interface FloatingBoxBaseProps
  extends PositionType,
    ComponentWithClass,
    Pick<React.AriaAttributes, 'aria-label' | 'aria-labelledby'>,
    Pick<React.HTMLAttributes<HTMLDivElement>, 'id'> {
  role?: string
  contentId?: string
  scheme?: FloatingBoxSchemeType
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
  children?: React.ReactElement
  isVisible?: boolean
  placement?: Placement
}

export interface FloatingBoxWithExternalTargetProps
  extends FloatingBoxBaseProps {
  renderTarget?: never
  /**
   * External element that the floating box should attach to.
   */
  targetElement?: Element | null
}

export interface FloatingBoxWithEmbeddedTargetProps
  extends FloatingBoxBaseProps {
  /**
   * JSX to render, representing the element that the floating
   * box should attach to.
   */
  renderTarget?: React.ReactElement
  targetElement?: never
}

export type FloatingBoxProps =
  | FloatingBoxWithExternalTargetProps
  | FloatingBoxWithEmbeddedTargetProps

// forwardRef` is being used to replicate an issue when using React 19, because
// `ref` is a prop. When upgrading, `forwardRef` can be removed.
// https://react.dev/blog/2024/12/05/react-19#ref-as-a-prop
// https://github.com/Royal-Navy/design-system/issues/3969
export const FloatingBox = forwardRef<HTMLDivElement, FloatingBoxProps>(
  (
    {
      contentId: externalContentId,
      scheme = FLOATING_BOX_SCHEME.LIGHT,
      onMouseEnter,
      onMouseLeave,
      children,
      renderTarget,
      targetElement,
      isVisible,
      placement = 'auto',
      role = 'dialog',
      ...rest
    },
    ref
  ) => {
    const nodeRef = useRef<HTMLDivElement>(null)
    const contentId = useExternalId('floating-box', externalContentId)
    const {
      arrowElementRef,
      arrowStyles,
      floatingElementRef,
      floatingPlacement,
      styles,
      targetElementRef,
      forceUpdate,
    } = useFloatingElement(placement, undefined, targetElement)

    // Set `floatingBoxRest` to replicate what is happening in React 19 because
    // `ref` is a prop leading to the merged refs being overwritten with
    // `{...rest}`. When upgrading to React 19, `forwardRef` will be removed, and
    // we can revert to using `{...rest}` rather than setting `floatingBoxRest`.
    // https://react.dev/blog/2024/12/05/react-19#ref-as-a-prop
    // https://github.com/Royal-Navy/design-system/issues/3969
    const floatingBoxRest = {
      ...rest,
      ref,
    }

    useLayoutEffect(() => {
      forceUpdate()
    }, [forceUpdate])

    return (
      <>
        {renderTarget && (
          <StyledTarget
            ref={targetElementRef}
            data-testid="floating-box-styled-target"
          >
            {renderTarget}
          </StyledTarget>
        )}
        <Transition nodeRef={nodeRef} in={isVisible} timeout={0} unmountOnExit>
          {(state) => (
            <StyledFloatingBox
              $transitionStatus={state}
              style={styles}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              role={role}
              data-testid="floating-box"
              {...floatingBoxRest}
              ref={mergeRefs([nodeRef, floatingElementRef, ref])}
            >
              <FloatingBoxContent
                contentId={contentId}
                scheme={scheme}
                data-testid="floating-box-content"
              >
                <StyledArrow
                  $placement={floatingPlacement}
                  ref={arrowElementRef}
                  style={arrowStyles}
                />
                {children}
              </FloatingBoxContent>
            </StyledFloatingBox>
          )}
        </Transition>
      </>
    )
  }
)

FloatingBox.displayName = 'FloatingBox'
