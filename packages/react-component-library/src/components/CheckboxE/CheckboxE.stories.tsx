import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { CheckboxE, CheckboxEProps } from '.'
import { CHECKBOX_VARIANT } from './constants'

export default {
  component: CheckboxE,
  title: 'Checkbox (Experimental)',
  parameters: {
    actions: { argTypesRegex: '^on.*' },
  },
} as ComponentMeta<typeof CheckboxE>

const Template: ComponentStory<typeof CheckboxE> = (props) => (
  <CheckboxE {...props} />
)

const MultipleItemsTemplate: ComponentStory<typeof CheckboxE> = (props) => {
  function getProps(i: number): CheckboxEProps {
    return {
      ...props,
      label: `${props.label} ${i}`,
      name: `${props.name}-${i}`,
    }
  }

  return (
    <>
      <CheckboxE {...getProps(1)} />
      <CheckboxE {...getProps(2)} />
      <CheckboxE {...getProps(3)} />
    </>
  )
}

export const Default = Template.bind({})
Default.args = {
  id: undefined,
  label: 'Default checkbox',
  name: 'default',
}

export const Checked = Template.bind({})
Checked.args = {
  id: undefined,
  defaultChecked: true,
  label: 'Checked',
  name: 'checked',
}

export const DisabledUnchecked = Template.bind({})
DisabledUnchecked.storyName = 'Disabled, unchecked'
DisabledUnchecked.args = {
  id: undefined,
  isDisabled: true,
  label: 'Disabled, unchecked',
  name: 'disabled',
}

export const DisabledChecked = Template.bind({})
DisabledChecked.storyName = 'Disabled, checked'
DisabledChecked.args = {
  id: undefined,
  defaultChecked: true,
  isDisabled: true,
  label: 'Disabled, checked',
  name: 'disabled',
}

export const Invalid = Template.bind({})
Invalid.args = {
  id: undefined,
  label: 'Invalid checkbox',
  name: 'invalid',
  isInvalid: true,
}

export const NoContainer = MultipleItemsTemplate.bind({})
NoContainer.args = {
  id: undefined,
  label: 'Item without container',
  name: 'no-container',
  variant: CHECKBOX_VARIANT.NO_CONTAINER,
}

export const WithDescription = Template.bind({})
WithDescription.args = {
  id: undefined,
  description:
    'She must have hidden the plans in the escape pod. Send a detachment down to retrieve them.',
  label: 'With description',
  name: 'with-description',
}
