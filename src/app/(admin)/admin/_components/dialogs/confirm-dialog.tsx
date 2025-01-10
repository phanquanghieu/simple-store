import { useTranslations } from 'next-intl'

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
  title,
  description,
  cancelTitle,
  actionTitle,
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
  onAction?: () => Promise<void> | void
} & AlertDialogProps) {
  const t = useTranslations()

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title ?? t('Common.areYouSure')}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {cancelTitle ?? t('Common.cancel')}
          </AlertDialogCancel>
          <Button
            variant={actionVariant}
            onClick={onAction}
            disabled={isActionPending}
          >
            {isActionPending && <Spinner />}
            {actionTitle ?? t('Common.save')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
