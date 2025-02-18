import { DayPickerProps } from 'react-day-picker'
import { Placement } from '@floating-ui/react-dom'
import React, { useRef } from 'react'

import { DATE_FORMAT } from '../../constants'
import { DATE_VALIDITY } from './constants'
import { DatePickerProvider } from './useDatePickerContext'
import { FloatingCalendar } from './FloatingCalendar'
import { Input } from './Input'
import { type ComponentWithClass } from '../../common/ComponentWithClass'
import { type InputValidationProps } from '../../common/InputValidationProps'
import { type ValueOf } from '../../helpers'
import { useExternalId } from '../../hooks/useExternalId'
import { useStatefulRef } from '../../hooks/useStatefulRef'

export type DatePickerDateValidityType = ValueOf<typeof DATE_VALIDITY>

export interface DatePickerOnChangeData {
  startDate: Date | null
  startDateValidity: DatePickerDateValidityType | null
  endDate: Date | null
  endDateValidity: DatePickerDateValidityType | null
}

export interface DatePickerProps
  extends ComponentWithClass,
    InputValidationProps {
  /**
   * The end of the selected date range. (Only relevant if isRange is set.)
   *
   * If set, it should be kept updated with the `endDate` value provided
   * by the `onChange` callback.
   */
  endDate?: Date | null
  /**
   * Custom date format (e.g. `yyyy/MM/dd`).
   */
  format?: string
  /**
   * Optional unique ID to apply to the component.
   */
  id?: string
  /**
   * Toggles whether the component is disabled or not (preventing user interaction).
   */
  isDisabled?: boolean
  /**
   * Toggles whether the component is a range variant (allowing selection of start and end dates).
   */
  isRange?: boolean
  /**
   * Optional text label to display within the picker input.
   */
  label?: string
  /**
   * Optional HTML `name` attribute to apply to the component.
   */
  name?: string
  /**
   * Optional handler to be invoked when the blur event is emitted.
   */
  onBlur?: (event: React.FormEvent) => void
  /**
   * Optional handler to be invoked when the value of the component changes.
   *
   * Note: If an invalid date is typed, `data.startDate` will be set to an
   * invalid date object and the `data.startDateValidity` will be set to
   * `"invalid"`. (If you're using `yup` for validation, you may wish to
   * use the `.typeError()` chainer to display an appropriate error message.)
   *
   * If a date that is disabled using the `disabledDays` prop is typed,
   * `data.startDate` will be populated and `data.startDateValidity` will
   * be set to `"disabled"`. You should check for this and ensure an
   * appropriate error message is displayed.
   */
  onChange?: (data: DatePickerOnChangeData) => void
  /**
   * The selected date, or the start of the selected date range if `isRange`
   * is set.
   *
   * If set, it should be kept updated with the `startDate` provided
   * by the `onChange` callback.
   */
  startDate?: Date | null
  /**
   * Toggles whether the picker is open on first render.
   */
  initialIsOpen?: boolean
  /**
   * An array of dates to disabled within the picker, preventing them from
   * being selected in the date picker calendar.
   *
   * Note that these dates can still be manually typed in. You should still
   * check for them in your validation logic and display an appropriate
   * error message if they are received. See the `onChange` prop for more
   * information.
   */
  disabledDays?: DayPickerProps['disabled']
  /**
   * Optional month from which to display the picker calendar on first render.
   */
  initialMonth?: DayPickerProps['defaultMonth']
  /**
   * Initial value for `startDate`. Only used when the `startDate` prop is not set.
   */
  initialStartDate?: Date | null
  /**
   * Initial value for `endDate`. Only used when the `endDate` prop is not set.
   */
  initialEndDate?: Date | null
  /**
   * Position to display the picker relative to the input.
   * NOTE: This is now calculated automatically by default based on available screen real-estate.
   */
  placement?: Placement
  /**
   * Optional override for the date marked as today in the picker.
   * Can be used for e.g. visual regression testing.
   */
  today?: Date
  /**
   * Not used. Use `startDate` and `endDate` instead.
   */
  value?: never
  /**
   * Enable the Jump To Today button that sets the current date to today.
   */
  jumpToToday?: boolean
  /**
   * Enable navigation via the Month and Year grids.
   */
  navigateMonthYear?: boolean
}

export const DatePicker = ({
  className,
  disabledDays,
  endDate: externalEndDate,
  format: datePickerFormat = DATE_FORMAT.SHORT,
  id,
  initialEndDate = null,
  initialIsOpen = false,
  initialMonth,
  initialStartDate = null,
  isDisabled = false,
  isInvalid,
  isRange = false,
  jumpToToday = false,
  label = 'Date',
  navigateMonthYear = false,
  onBlur,
  onChange,
  placement = 'bottom-start',
  startDate: externalStartDate,
  today = new Date(),

  // Formik can pass value – drop it to stop it being forwarded to the input
  value: _,

  ...rest
}: DatePickerProps) => {
  const titleId = useExternalId('datepicker-title')
  const floatingBoxId = useExternalId('datepicker-contentId')

  const buttonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [floatingBoxTarget, setFloatingBoxTarget] = useStatefulRef()

  return (
    <DatePickerProvider
      datePickerFormat={datePickerFormat}
      endDate={externalEndDate}
      initialEndDate={initialEndDate}
      initialIsOpen={initialIsOpen}
      initialMonth={initialMonth}
      initialStartDate={initialStartDate}
      isRange={isRange}
      startDate={externalStartDate}
    >
      <Input
        buttonRef={buttonRef}
        className={className}
        disabledDays={disabledDays}
        floatingBoxId={floatingBoxId}
        format={datePickerFormat}
        id={id}
        inputRef={inputRef}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        isRange={isRange}
        label={label}
        onBlur={onBlur}
        onChange={onChange}
        setFloatingBoxTarget={setFloatingBoxTarget}
        titleId={titleId}
        {...rest}
      />
      <FloatingCalendar
        buttonRef={buttonRef}
        disabledDays={disabledDays}
        floatingBoxId={floatingBoxId}
        floatingBoxTarget={floatingBoxTarget}
        inputRef={inputRef}
        isRange={isRange}
        jumpToToday={jumpToToday}
        navigateMonthYear={navigateMonthYear}
        onChange={onChange}
        placement={placement}
        titleId={titleId}
        today={today}
      />
    </DatePickerProvider>
  )
}

DatePicker.displayName = 'DatePicker'
