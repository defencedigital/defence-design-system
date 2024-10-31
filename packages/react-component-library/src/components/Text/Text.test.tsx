import React from 'react'
import { fontSize } from '@royalnavy/design-tokens'
import { render } from '@testing-library/react'

import { TextE } from '.'
import { getTextStyles } from './textStyles'

it('renders with default styles', () => {
  const { container } = render(<TextE>Content</TextE>)
  expect(container).toHaveTextContent('Content')
})

it('sets the line height', () => {
  const { container } = render(<TextE>Content</TextE>)
  expect(container.firstChild).toHaveStyleRule('line-height', '24px')
})

it('sets the size for default body text', () => {
  const result = getTextStyles('p', 'body')
  expect(result.fontSize).toEqual(fontSize('m'))
})

it('sets the size for heading text', () => {
  const result = getTextStyles('h1')
  expect(result.fontSize).toEqual(fontSize('xxl'))
})

it.each([
  ['h1', '48px'],
  ['h2', '48px'],
  ['h3', '48px'],
  ['h4', '48px'],
  ['h5', '48px'],
  ['h6', '48px'],
  ['p', '24px'],
  ['span', '24px'],
])('sets the line height for %s', (el, expectedLineHeight) => {
  // @ts-ignore
  const { container } = render(<TextE el={el}>Content</TextE>)
  expect(container.firstChild).toHaveStyleRule(
    'line-height',
    expectedLineHeight
  )
})

it.each([
  ['p', '24px'],
  ['span', '24px'],
])('sets the line height for small %s', (el, expectedLineHeight) => {
  const { container } = render(
    // @ts-ignore
    <TextE el={el} variant="small">
      Content
    </TextE>
  )

  expect(container.firstChild).toHaveStyleRule(
    'line-height',
    expectedLineHeight
  )
})

it.each([
  ['h1', '72px'],
  ['h2', '48px'],
  // h3 ... h6 are not available in display variant they are rendered as default
  ['h3', '24px'],
  ['h4', '24px'],
  ['h5', '24px'],
  ['h6', '24px'],
  ['p', '48px'],
])('sets the line height for display %s', (el, expectedLineHeight) => {
  const { container } = render(
    // @ts-ignore
    <TextE el={el} variant="display">
      Content
    </TextE>
  )

  expect(container.firstChild).toHaveStyleRule(
    'line-height',
    expectedLineHeight
  )
})
