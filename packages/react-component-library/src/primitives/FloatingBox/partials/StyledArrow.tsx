import styled, { css } from 'styled-components'
import { Placement } from '@floating-ui/react-dom'

interface StyledArrowProps {
  $placement?: Placement
}

const placementStyleMap = {
  bottom: css`
    &::before,
    &::after {
      border-width: 0 5px 5px;
    }

    &::before {
      top: -6px;
    }

    &::after {
      top: -5px;
    }
  `,
  top: css`
    bottom: -6px;

    &::before,
    &::after {
      border-width: 5px 5px 0;
    }

    &::before {
      z-index: 0;
      top: -5px;
    }

    &::after {
      z-index: 1;
      top: -6px;
    }
  `,
  left: css`
    right: -2px;

    &::before,
    &::after {
      border-width: 0 5px 5px;
      transform: rotate(90deg);
    }

    &::before {
      left: 1px;
    }

    &::after {
      left: 0;
    }
  `,
  right: css`
    left: -2px;

    &::before,
    &::after {
      border-width: 0 5px 5px;
      transform: rotate(-90deg);
    }

    &::before {
      left: -1px;
    }

    &::after {
      left: 0;
    }
  `,
}

export const StyledArrow = styled.div<StyledArrowProps>`
  position: absolute;
  height: 20px;
  width: 20px;
  background-color: deeppink;

  &::before,
  &::after {
    border-style: solid;
    content: '';
    display: block;
    position: absolute;
    width: 0;
    margin-left: -5px;
  }

  &::before {
    z-index: 0;
  }

  &::after {
    z-index: 1;
  }

  ${({ $placement = 'bottom' }) => placementStyleMap[$placement]}
`
