import { LuPen, LuTrash } from 'react-icons/lu'

import { IBulkActionDef, IRowActionDef } from './data-table.interface'

export const BULK_ACTION_COMMON: Record<
  string,
  Pick<IBulkActionDef, 'label' | 'icon'>
> = {
  UPDATE: {
    label: 'Common.update',
    icon: <LuPen className='text-info' />,
  },
  DELETE: {
    label: 'Common.delete',
    icon: <LuTrash className='text-destructive' />,
  },
}

export const ROW_ACTION_COMMON: Record<
  string,
  Pick<IRowActionDef<unknown>, 'icon'>
> = {
  UPDATE: {
    icon: <LuPen className='text-info' />,
  },
  DELETE: {
    icon: <LuTrash className='text-destructive' />,
  },
}
