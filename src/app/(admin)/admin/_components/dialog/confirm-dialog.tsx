import { useTransition } from 'react'

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
import { Button } from '~/app/_components/ui/button'
import { Spinner } from '~/app/_components/ui/spinner'

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
  onAction?: () => Promise<void>
} & AlertDialogProps) {
  const [isPending, startTransition] = useTransition()

  const handleAction = () => {
    startTransition(async () => {
      await onAction?.()

      startTransition(() => {
        props.onOpenChange?.(false)
      })
    })
  }

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
            onClick={handleAction}
            disabled={isPending}
          >
            {isPending && <Spinner />}
            {actionTitle}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
