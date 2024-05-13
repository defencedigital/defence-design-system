import '@tanstack/react-table'

import { TABLE_COLUMN_ALIGNMENT } from './constants'
import { ValueOf } from '../../helpers'

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: ValueOf<typeof TABLE_COLUMN_ALIGNMENT>
  }
}