import { AlertDialogProps } from '@radix-ui/react-alert-dialog'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/app/_components/ui/alert-dialog'
import { Button, ButtonProps } from '~/app/_components/ui/button'
import { Spinner } from '~/app/_components/ui/spinner'

export function ConfirmDialog({
  title = 'Are you absolutely sure?',
  description,
  cancelTitle = 'Cancel',
  actionTitle = 'Save',
  actionVariant = 'default',
  isActionPending = false,
  onAction,
  ...props
}: {
  title?: string
  description?: string
  cancelTitle?: string
  actionTitle?: string
  actionVariant?: ButtonProps['variant']
  isActionPending?: boolean
  onAction?: () => Promise<void>
} & AlertDialogProps) {
  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelTitle}</AlertDialogCancel>
          <Button
            variant={actionVariant}
            onClick={onAction}
            disabled={isActionPending}
          >
            {isActionPending && <Spinner />}
            {actionTitle}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
