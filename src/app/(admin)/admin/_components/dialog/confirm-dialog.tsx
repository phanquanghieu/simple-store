import { AlertDialogProps } from '@radix-ui/react-alert-dialog'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/app/_components/ui/alert-dialog'

export function ConfirmDialog({
  title = 'Are you absolutely sure?',
  description = 'Action can’t be undone.',
  cancelTitle = 'Cancel',
  actionTitle = 'Delete',
  actionVariant = 'destructive',
  onAction,
  ...props
}: {
  title?: string
  description?: string
  cancelTitle?: string
  actionTitle?: string
  actionVariant?: React.ComponentProps<typeof AlertDialogAction>['variant']
  onAction?: () => void
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
          <AlertDialogAction onClick={onAction} variant={actionVariant}>
            {actionTitle}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
