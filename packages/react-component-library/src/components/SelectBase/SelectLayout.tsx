import React, { useMemo, useState } from 'react'
import { UseSelectReturnValue, UseComboboxReturnValue } from 'downshift'

import { ArrowButton } from '../SelectE/ArrowButton'
import { ClearButton } from '../SelectE/ClearButton'
import { ComponentWithClass } from '../../common/ComponentWithClass'
import { getId } from '../../helpers'
import { SelectChildType } from './types'
import { StyledInlineButtons } from './partials/StyledInlineButtons'
import { StyledInput } from './partials/StyledInput'
import { StyledInputWrapper } from './partials/StyledInputWrapper'
import { StyledLabel } from '../TextInputE/partials/StyledLabel'
import { StyledOptions } from './partials/StyledOptions'
import { StyledOptionsWrapper } from './partials/StyledOptionsWrapper'
import { StyledOuterWrapper } from './partials/StyledOuterWrapper'
import { StyledSelect } from './partials/StyledSelect'
import { StyledTextInput } from './partials/StyledTextInput'

export interface SelectLayoutProps extends ComponentWithClass {
  hasLabelFocus?: boolean
  hasSelectedItem: boolean
  id: string
  inputProps: ReturnType<
    UseComboboxReturnValue<SelectChildType>['getInputProps']
  >
  inputWrapperProps?: ReturnType<
    UseComboboxReturnValue<SelectChildType>['getComboboxProps']
  >
  isDisabled?: boolean
  isInvalid?: boolean
  isOpen: boolean
  label: string
  menuProps:
    | ReturnType<UseComboboxReturnValue<SelectChildType>['getMenuProps']>
    | ReturnType<UseSelectReturnValue<SelectChildType>['getMenuProps']>
  onChange?: (value: string | null) => void
  onClearButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  toggleButtonProps:
    | ReturnType<
        UseComboboxReturnValue<SelectChildType>['getToggleButtonProps']
      >
    | ReturnType<UseSelectReturnValue<SelectChildType>['getToggleButtonProps']>
  value?: string
}

export const SelectLayout: React.FC<SelectLayoutProps> = ({
  children,
  hasLabelFocus,
  hasSelectedItem,
  id,
  inputProps,
  inputWrapperProps,
  isDisabled,
  isInvalid,
  isOpen,
  label,
  menuProps,
  onClearButtonClick,
  toggleButtonProps,
  value,
  ...rest
}) => {
  const [hasHover, setHasHover] = useState<boolean>(false)
  const labelId = useMemo(() => getId('label'), [])

  return (
    <StyledSelect data-testid="select" aria-labelledby={labelId}>
      <StyledTextInput data-testid="text-input-container">
        <StyledOuterWrapper
          $hasFocus={isOpen}
          $isDisabled={isDisabled}
          $isInvalid={isInvalid}
          data-testid="select-outer-wrapper"
        >
          <StyledInputWrapper
            data-testid="text-input-input-wrapper"
            {...inputWrapperProps}
          >
            <StyledLabel
              $hasContent={hasSelectedItem}
              $hasFocus={hasLabelFocus}
              htmlFor={id}
              id={labelId}
              data-testid="select-label"
            >
              {label}
            </StyledLabel>
            <StyledInput
              $hasLabel
              data-testid="select-input"
              disabled={isDisabled}
              value={value}
              onMouseEnter={() => {
                if (!isDisabled) {
                  setHasHover(true)
                }
              }}
              onMouseLeave={() => setHasHover(false)}
              {...rest}
              {...inputProps}
              aria-labelledby={labelId}
              id={id}
            />
          </StyledInputWrapper>
          <StyledInlineButtons>
            {hasSelectedItem && (
              <ClearButton
                isDisabled={isDisabled}
                onClick={onClearButtonClick}
              />
            )}
            <ArrowButton
              hasHover={hasHover}
              isDisabled={isDisabled}
              isOpen={isOpen}
              {...toggleButtonProps}
            />
          </StyledInlineButtons>
        </StyledOuterWrapper>
      </StyledTextInput>
      <StyledOptionsWrapper $isVisible={isOpen}>
        <StyledOptions {...menuProps}>{children}</StyledOptions>
      </StyledOptionsWrapper>
    </StyledSelect>
  )
}

SelectLayout.displayName = 'SelectLayout'