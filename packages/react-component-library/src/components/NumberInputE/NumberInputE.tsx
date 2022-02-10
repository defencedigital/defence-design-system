import React from 'react'
import { isNil } from 'lodash'
import { v4 as uuidv4 } from 'uuid'

import { Buttons } from './Buttons'
import { COMPONENT_SIZE, ComponentSizeType } from '../Forms'
import { getId, hasClass } from '../../helpers'
import { Input } from './Input'
import { InputValidationProps } from '../../common/InputValidationProps'
import { ComponentWithClass } from '../../common/ComponentWithClass'
import { useChangeHandlers } from './useChangeHandlers'
import { useFocus } from '../../hooks/useFocus'
import { useEarlyValidation } from './useEarlyValidation'
import { useValue } from './useValue'
import { StyledIcon } from './partials/StyledIcon'
import { StyledDivider } from './partials/StyledDivider'
import { StyledFootnote } from './partials/StyledFootnote'
import { StyledNumberInput } from './partials/StyledNumberInput'
import { StyledOuterWrapper } from './partials/StyledOuterWrapper'
import { StyledPrefix } from './partials/StyledPrefix'
import { StyledSuffix } from './partials/StyledSuffix'

interface NumberInputBaseProps
  extends ComponentWithClass,
    InputValidationProps {
  /**
   * Toggles whether to focus the input on initial render.
   */
  autoFocus?: boolean
  /**
   * Optional text footnote to display below the component.
   */
  footnote?: string
  /**
   * Optional HTML `id` attribute to apply to the internal input.
   */
  id?: string
  /**
   * Toggles whether the component is disabled or not (preventing user interaction).
   */
  isDisabled?: boolean
  /**
   * Optional descriptive text label to display within the component.
   */
  label?: string
  /**
   * Maximum value selectable by the component (upper bound).
   */
  max?: number
  /**
   * Minimum value selectable by the component (lower bound).
   *
   * To disable the entry of negative numbers, set this to `0` or
   * greater.
   */
  min?: number
  /**
   * HTML `name` attribute to apply to the internal input.
   */
  name: string
  /**
   * Optional handler called when the `onBlur` event is emitted.
   */
  onBlur?: (event: React.FormEvent) => void
  /**
   * Handler called when the entered value changes.
   *
   * Note that `newValue` could be `NaN` if negative numbers
   * are allowed and a single `-` is entered.
   */
  onChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement>,
    newValue: number | null
  ) => void
  /**
   * Optional placeholder text to display within the component.
   */
  placeholder?: string
  /**
   * Size of the component.
   */
  size?: ComponentSizeType
  /**
   * Stepped increment amount by which to increase/decrese component value.
   */
  step?: number
  /**
   * Currently selected value displayed by the component.
   */
  value?: number
}

export interface NumberInputWithIconProps extends NumberInputBaseProps {
  /**
   * Optional icon to display to the left of the input value.
   */
  icon?: React.ReactNode
  prefix?: never
  suffix?: never
}

export interface NumberInputWithPrefixProps extends NumberInputBaseProps {
  icon?: never
  /**
   * Optional value to display next to the component value.
   */
  prefix?: string
  suffix?: never
}

export interface NumberInputWithSuffixProps extends NumberInputBaseProps {
  icon?: never
  prefix?: never
  /**
   * Optional value to display next to the component value.
   */
  suffix?: string
}

export type NumberInputEProps =
  | NumberInputWithIconProps
  | NumberInputWithPrefixProps
  | NumberInputWithSuffixProps

function formatValue(
  displayValue: string | null,
  prefix?: string,
  suffix?: string
): string {
  if (isNil(displayValue)) {
    return 'Not set'
  }

  if (prefix) {
    return `${prefix} ${displayValue}`
  }

  if (suffix) {
    return `${displayValue} ${suffix}`
  }

  return displayValue
}

export const NumberInputE: React.FC<NumberInputEProps> = ({
  className,
  footnote,
  icon,
  id = uuidv4(),
  isDisabled = false,
  isInvalid,
  label,
  max,
  min,
  name,
  onBlur,
  onChange,
  placeholder = '',
  prefix,
  size = COMPONENT_SIZE.FORMS,
  step = 1,
  suffix,
  value,
  ...rest
}) => {
  const isNegativeAllowed = isNil(min) || min < 0
  const { committedValue, setCommittedValue } = useValue(
    value ? String(value) : null
  )
  const { hasFocus, onLocalFocus, onLocalBlur } = useFocus(onBlur)
  const { handleBeforeInput, handlePaste } =
    useEarlyValidation(isNegativeAllowed)
  const { handleButtonClick, handleInputChange } = useChangeHandlers(
    isNegativeAllowed,
    min,
    max,
    onChange,
    setCommittedValue
  )

  const numberInputId = getId('number-input')
  const isCommittedValueInvalid =
    committedValue && !Number.isFinite(parseFloat(committedValue))

  return (
    <StyledNumberInput
      aria-label={label || 'Number input'}
      className={className}
      data-testid="number-input"
      id={numberInputId}
      role="spinbutton"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Number(committedValue) || 0}
      aria-valuetext={String(formatValue(committedValue, prefix, suffix))}
    >
      <StyledOuterWrapper
        data-testid="number-input-outer-wrapper"
        $hasFocus={hasFocus}
        $isDisabled={isDisabled}
        $isInvalid={
          isInvalid ||
          isCommittedValueInvalid ||
          hasClass(className, 'is-invalid')
        }
        $size={size}
      >
        {icon && (
          <StyledIcon data-testid="number-input-icon">{icon}</StyledIcon>
        )}

        {prefix && (
          <>
            <StyledPrefix data-testid="number-input-prefix">
              {prefix}
            </StyledPrefix>
            <StyledDivider $size={size} />
          </>
        )}

        <Input
          aria-labelledby={numberInputId}
          hasFocus={hasFocus}
          id={id}
          isDisabled={isDisabled}
          label={label}
          name={name}
          onBeforeInput={handleBeforeInput}
          onChange={handleInputChange}
          onPaste={handlePaste}
          onBlur={onLocalBlur}
          onFocus={onLocalFocus}
          placeholder={placeholder}
          size={size}
          value={committedValue}
          {...rest}
        />

        {suffix && (
          <>
            <StyledDivider $size={size} />
            <StyledSuffix data-testid="number-input-suffix">
              {suffix}
            </StyledSuffix>
          </>
        )}

        <Buttons
          isDisabled={isDisabled}
          max={max}
          min={min}
          name={name}
          onClick={handleButtonClick}
          size={size}
          step={step}
          value={committedValue}
        />
      </StyledOuterWrapper>

      {footnote && (
        <StyledFootnote data-testid="number-input-footnote">
          {footnote}
        </StyledFootnote>
      )}
    </StyledNumberInput>
  )
}

NumberInputE.displayName = 'NumberInputE'
