import React, { useState } from 'react'
import {
  IconInfo,
  IconWarning,
  IconError,
  IconCheckCircle,
} from '@royalnavy/icon-library'
import { selectors } from '@royalnavy/design-tokens'
import { useToaster, toast, resolveValue } from 'react-hot-toast'

import { StyledToast } from './partials/StyledToast'
import { StyledHeader } from './partials/StyledHeader'
import { StyledTitle } from './partials/StyledTitle'
import { StyledLabel } from './partials/StyledLabel'
import { StyledTime } from './partials/StyledTime'
import { StyledButton } from './partials/StyledButton'
import { StyledContent } from './partials/StyledContent'
import { StyledDescription } from './partials/StyledDescription'
import { useExternalId } from '../../hooks/useExternalId'
import { ComponentWithClass } from '../../common/ComponentWithClass'
import { ValueOf } from '../../helpers'

export const TOAST_APPEARANCE = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const

export type Appearance = ValueOf<typeof TOAST_APPEARANCE>

export interface ToastProps extends Omit<ComponentWithClass, 'children'> {
  /**
   * Date and time of the event.
   */
  dateTime?: Date
  /**
   * Appearance of the Toast (success, error, warning, info).
   */
  appearance?: Appearance
  /**
   * Text to display at the top of the Toast.
   */
  label?: string
}

const getAppearanceIcon = (appearance: Appearance) => {
  const appearanceIconMap = {
    [TOAST_APPEARANCE.SUCCESS]: IconCheckCircle,
    [TOAST_APPEARANCE.ERROR]: IconError,
    [TOAST_APPEARANCE.WARNING]: IconWarning,
    [TOAST_APPEARANCE.INFO]: IconInfo,
  }

  return appearanceIconMap[appearance] || appearanceIconMap.info
}

const { spacing, zIndex } = selectors

export const Toast = (props: ToastProps) => {
  const { dateTime, label, appearance = TOAST_APPEARANCE.INFO, ...rest } = props

  const { toasts, handlers } = useToaster()
  const { startPause, endPause, updateHeight, calculateOffset } = handlers

  const [time] = useState<string>(
    (dateTime || new Date()).toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })
  )

  const titleId = useExternalId('toast-title')
  const descriptionId = useExternalId('toast-description')

  const Icon = getAppearanceIcon(appearance)

  return (
    <div
      onMouseEnter={startPause}
      onMouseLeave={endPause}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        padding: spacing('4'),
        zIndex: zIndex('overlay', 999),
      }}
    >
      {toasts.map((item) => {
        const { id, height = 0, visible, message, ariaProps } = item

        const offset = calculateOffset(item, {
          reverseOrder: true,
          gutter: 1,
        })

        const ref = (el: HTMLDivElement) => {
          if (el && typeof height !== 'number') {
            updateHeight(id, el.getBoundingClientRect().height)
          }
        }

        return (
          <div
            key={id}
            style={{
              transition: 'all 0.5s ease-out',
              opacity: visible ? 1 : 0,
              transform: `translateY(${offset - height}px)`,
            }}
            ref={ref}
          >
            <StyledToast
              $appearance={appearance}
              aria-labelledby={message ? titleId : undefined}
              aria-describedby={message ? descriptionId : undefined}
              data-testid="wrapper"
              {...rest}
              {...ariaProps}
            >
              <StyledHeader>
                <StyledTitle id={titleId}>
                  {label && (
                    <StyledLabel>
                      <Icon aria-hidden data-testid="icon" />
                      {label}
                    </StyledLabel>
                  )}
                  <StyledTime>{time}</StyledTime>
                </StyledTitle>
                <StyledButton
                  onClick={(_: React.MouseEvent<HTMLButtonElement>) =>
                    toast.dismiss(id)
                  }
                >
                  Dismiss
                </StyledButton>
              </StyledHeader>
              <StyledContent>
                <StyledDescription id={descriptionId}>
                  {resolveValue(message, item)}
                </StyledDescription>
              </StyledContent>
            </StyledToast>
          </div>
        )
      })}
    </div>
  )
}

export const showToast = (message: string, duration = 4000, options = {}) => {
  toast(message, {
    duration,
    ...options,
  })
}
