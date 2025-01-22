import { useTranslations } from 'next-intl'
import {
  ButtonHTMLAttributes,
  Dispatch,
  ReactNode,
  RefAttributes,
  SetStateAction,
  useState,
} from 'react'
import { LuChevronDown, LuListFilter, LuMove, LuX } from 'react-icons/lu'

import { isEmpty, unionBy } from 'lodash'

import { sortByKeys, zodt } from '~/shared/libs'

import { Badge } from '~/app/_components/ui/badge'
import { Button } from '~/app/_components/ui/button'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '~/app/_components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/app/_components/ui/popover'
import { Separator } from '~/app/_components/ui/separator'

import { useDeepCompareEffect, useFallbackState } from '~/app/_hooks'

import { cn } from '~/app/_libs/utils'

import { IOption } from '~/app/_interfaces/common.interface'

import { Checkbox } from './checkbox'
import { Sortable, SortableDragHandle, SortableItem } from './sortable'

export interface ISelect2Props<TValue = string | string[] | null>
  extends RefAttributes<HTMLButtonElement>,
    Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      'onChange' | 'value' | 'name'
    > {
  variant?: 'default' | 'filter' | 'button' | 'sortable'
  isMultiSelect?: boolean
  options?: IOption[]
  initOption?: IOption[] | IOption
  value?: TValue
  onChange?: (value: TValue) => void
  isFetching?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  search?: string
  setSearch?: Dispatch<SetStateAction<string>>
  openSelect?: boolean
  setOpenSelect?: Dispatch<SetStateAction<boolean>>
  isClearable?: boolean
  isSearchable?: boolean
  isOptionLabelMessageKey?: boolean
  isError?: boolean
  placeholder?: TMessageKey
  triggerIcon?: ReactNode
}

export function Select2<TValue = string | string[] | null>({
  variant = 'default',
  isMultiSelect = false,
  options = [],
  initOption,
  value,
  onChange,
  isFetching,
  hasMore,
  onLoadMore,
  search,
  setSearch,
  openSelect: propOpenSelect,
  setOpenSelect: propsSetOpenSelect,
  isClearable = false,
  isSearchable = false,
  isOptionLabelMessageKey = false,
  isError,
  placeholder,
  triggerIcon,
  className,
  ...props
}: ISelect2Props<TValue>) {
  const [selectedOptions, setSelectedOptions] = useState<IOption[]>([])

  const [openSelect, setOpenSelect] = useFallbackState(
    propOpenSelect,
    propsSetOpenSelect,
    false,
  )

  useDeepCompareEffect(() => {
    const initOptions = initOption ? zodt.toArray(initOption) : []
    const values = value ? zodt.toArray(value) : []

    setSelectedOptions((prevSelectedOptions) =>
      sortByKeys(
        unionBy(initOptions, prevSelectedOptions, options, 'value').filter(
          (option) => values.includes(option.value),
        ),
        values,
        'value',
      ),
    )
  }, [value, options, initOption])

  const handleSelectOption = (option: IOption) => {
    if (isMultiSelect) {
      let _value = value ? [...(value as string[])] : []
      if (_value.includes(option.value)) {
        _value = _value.filter((value) => value !== option.value)
      } else {
        _value.push(option.value)
      }

      onChange?.(_value as TValue)
    } else {
      if (value !== option.value) {
        onChange?.(option.value)
        setOpenSelect(false)
      }
    }
  }

  const handleClearOption = (option?: IOption) => {
    if (option) {
      if (isMultiSelect) {
        onChange?.(
          (value as string[]).filter((v) => v !== option.value) as TValue,
        )
      } else {
        onChange?.(null as TValue)
      }
    } else {
      onChange?.((isMultiSelect ? [] : null) as TValue)
    }
  }

  const checkIsSelected = (option: IOption) => {
    if (!value) {
      return false
    } else {
      return isMultiSelect
        ? (value as string[]).includes(option.value)
        : (value as string) === option.value
    }
  }

  const t = useTranslations()
  return (
    <Popover onOpenChange={setOpenSelect} open={openSelect}>
      <PopoverTrigger
        onClick={() => setOpenSelect((prev) => !prev)}
        asChild
        className={cn(className, {
          'border-destructive ring-destructive focus:ring-destructive focus-visible:ring-destructive':
            isError,
        })}
        {...props}
      >
        {variant === 'filter' ? (
          <SelectTriggerFilter
            isOptionLabelMessageKey={isOptionLabelMessageKey}
            placeholder={placeholder}
            selectedOptions={selectedOptions}
          />
        ) : variant === 'button' ? (
          <SelectTriggerButton
            placeholder={placeholder}
            triggerIcon={triggerIcon}
          />
        ) : variant === 'sortable' ? (
          <SelectTriggerSortable
            onChange={(value) => onChange?.(value as TValue)}
            onClearOption={handleClearOption}
            isClearable={isClearable}
            isOptionLabelMessageKey={isOptionLabelMessageKey}
            placeholder={placeholder}
            selectedOptions={selectedOptions}
          />
        ) : (
          <SelectTriggerDefault
            onClearOption={handleClearOption}
            isClearable={isClearable}
            isMultiSelect={isMultiSelect}
            isOptionLabelMessageKey={isOptionLabelMessageKey}
            placeholder={placeholder}
            selectedOptions={selectedOptions}
          />
        )}
      </PopoverTrigger>
      <PopoverContent
        onEscapeKeyDown={() => setOpenSelect(false)}
        align='start'
        className='w-auto min-w-36 p-0'
      >
        <Command shouldFilter={false}>
          {isSearchable && (
            <CommandInput
              onValueChange={setSearch}
              isLoading={isFetching}
              placeholder={t('Common.search')}
              value={search}
            />
          )}
          <CommandList>
            <CommandGroup>
              {options.length === 0 && (
                <div className='flex h-20 items-center justify-center text-muted-foreground'>
                  {isFetching
                    ? t('Common.loading')
                    : t('Admin.Common.noResultFound')}
                </div>
              )}
              {options.map((option) => (
                <CommandItem
                  onSelect={() => handleSelectOption(option)}
                  className='cursor-pointer'
                  key={option.value}
                  value={option.value}
                >
                  <Checkbox
                    checked={checkIsSelected(option)}
                    variant={isMultiSelect ? 'default' : 'circle'}
                  />
                  <span className='truncate'>
                    {isOptionLabelMessageKey
                      ? t(option.label as TMessageKey)
                      : option.label}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            {hasMore && (
              <>
                <CommandSeparator alwaysRender />
                <CommandGroup>
                  <CommandItem
                    onSelect={onLoadMore}
                    className='cursor-pointer justify-center'
                    disabled={isFetching}
                  >
                    {t('Admin.Common.loadMore')}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
          {isClearable && !isEmpty(value) && (
            <>
              <CommandSeparator alwaysRender />
              <CommandGroup>
                <CommandItem
                  onSelect={() => handleClearOption()}
                  className='cursor-pointer justify-center'
                >
                  {t('Common.clear')}
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface ISelectTriggerFilterProps
  extends RefAttributes<HTMLButtonElement>,
    ButtonHTMLAttributes<HTMLButtonElement> {
  selectedOptions: IOption[]
  isOptionLabelMessageKey?: boolean
  placeholder?: TMessageKey
}
export function SelectTriggerFilter({
  selectedOptions,
  className,
  isOptionLabelMessageKey,
  placeholder,
  ...props
}: ISelectTriggerFilterProps) {
  const t = useTranslations()
  return (
    <Button
      className={cn('border-dashed px-2', className)}
      size={'sm'}
      variant={'outline'}
      {...props}
    >
      <LuListFilter />
      {placeholder && t(placeholder)}
      {selectedOptions.length > 0 && (
        <>
          <Separator className='h-4' orientation='vertical' />
          <div className='max-w-96 space-x-1 truncate'>
            {selectedOptions.map((option) => (
              <Badge
                className='rounded-sm px-1.5 font-normal shadow-sm'
                key={option.value}
                variant='secondary'
              >
                <span className='max-w-36 truncate'>
                  {isOptionLabelMessageKey
                    ? t(option.label as TMessageKey)
                    : option.label}
                </span>
              </Badge>
            ))}
          </div>
        </>
      )}
    </Button>
  )
}

interface ISelectTriggerButtonProps
  extends RefAttributes<HTMLButtonElement>,
    ButtonHTMLAttributes<HTMLButtonElement> {
  triggerIcon?: ReactNode
  placeholder?: TMessageKey
}
export function SelectTriggerButton({
  triggerIcon,
  className,
  placeholder,
  ...props
}: ISelectTriggerButtonProps) {
  const t = useTranslations()
  return (
    <Button
      className={cn('pl-2', className)}
      size={'sm'}
      variant={'outline'}
      {...props}
    >
      {triggerIcon}
      {placeholder && t(placeholder)}
    </Button>
  )
}

interface SelectTriggerSortableProps
  extends RefAttributes<HTMLButtonElement>,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  selectedOptions: IOption[]
  onChange?: (value: string[]) => void
  onClearOption?: (option?: IOption) => void
  isClearable?: boolean
  isOptionLabelMessageKey?: boolean
  placeholder?: TMessageKey
}
export function SelectTriggerSortable({
  selectedOptions,
  onChange,
  onClearOption,
  isClearable,
  className,
  isOptionLabelMessageKey,
  placeholder,
  ...props
}: SelectTriggerSortableProps) {
  const t = useTranslations()
  return (
    <Button
      asChild
      className={cn(
        'relative flex h-auto min-h-11 w-full items-center justify-between py-[7px] pl-3 pr-8 hover:bg-background',
        className,
      )}
      variant={'outline'}
      {...props}
    >
      <div>
        <div className='w-full'>
          {selectedOptions.length > 0 ? (
            <>
              <Sortable
                onValueChange={(value) => onChange?.(value.map(({ id }) => id))}
                orientation='mixed'
                value={selectedOptions.map(({ value }) => ({ id: value }))}
              >
                <div className='flex w-full flex-wrap items-center gap-1.5'>
                  {selectedOptions.map((option) => (
                    <SortableItem
                      asChild
                      key={option.value}
                      value={option.value}
                    >
                      <Badge
                        className='h-7 gap-1 rounded-sm p-0 font-normal shadow-sm'
                        variant={'outline'}
                      >
                        <SortableDragHandle
                          className='size-7 text-muted-foreground hover:bg-transparent hover:text-info'
                          variant={'ghost'}
                        >
                          <LuMove />
                        </SortableDragHandle>
                        <span className='max-w-36 truncate'>
                          {isOptionLabelMessageKey
                            ? t(option.label as TMessageKey)
                            : option.label}
                        </span>
                        <Button
                          onClick={(event) => {
                            event.stopPropagation()
                            onClearOption?.(option)
                          }}
                          className='size-7 text-muted-foreground'
                          size={'icon'}
                          variant={'ghost-destructive'}
                        >
                          <LuX />
                        </Button>
                      </Badge>
                    </SortableItem>
                  ))}
                </div>
              </Sortable>
            </>
          ) : (
            <div className='truncate text-start font-normal text-muted-foreground'>
              {placeholder && t(placeholder)}
            </div>
          )}
        </div>
        <div className='absolute right-0 z-10 flex size-8 items-center justify-center text-muted-foreground'>
          {isClearable && selectedOptions.length > 0 ? (
            <div
              onClick={(event) => {
                event.stopPropagation()
                onClearOption?.()
              }}
              className='flex size-8 items-center justify-center transition-colors hover:text-destructive'
            >
              <LuX />
            </div>
          ) : (
            <LuChevronDown />
          )}
        </div>
      </div>
    </Button>
  )
}

interface ISelectTriggerDefaultProps
  extends RefAttributes<HTMLButtonElement>,
    ButtonHTMLAttributes<HTMLButtonElement> {
  selectedOptions: IOption[]
  isMultiSelect?: boolean
  onClearOption?: (option?: IOption) => void
  isClearable?: boolean
  isOptionLabelMessageKey?: boolean
  placeholder?: TMessageKey
}
export function SelectTriggerDefault({
  selectedOptions,
  isMultiSelect,
  onClearOption,
  isClearable,
  className,
  isOptionLabelMessageKey,
  placeholder,
  ...props
}: ISelectTriggerDefaultProps) {
  const t = useTranslations()
  return (
    <Button
      className={cn(
        'relative flex h-auto min-h-9 w-full items-center justify-between py-1.5 pl-3 pr-8 hover:bg-background',
        className,
      )}
      variant={'outline'}
      {...props}
    >
      <div className='w-full'>
        {selectedOptions.length > 0 ? (
          <>
            {isMultiSelect ? (
              <div className='flex w-full flex-wrap items-center gap-1.5'>
                {selectedOptions.map((option) => (
                  <Badge
                    className='h-[22px] rounded-sm p-0 pl-2 font-normal shadow-sm'
                    key={option.value}
                    variant={'outline'}
                  >
                    <span className='max-w-36 truncate'>
                      {isOptionLabelMessageKey
                        ? t(option.label as TMessageKey)
                        : option.label}
                    </span>
                    <div
                      onClick={(event) => {
                        event.stopPropagation()
                        onClearOption?.(option)
                      }}
                      className='flex h-5 w-6 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-destructive'
                    >
                      <LuX />
                    </div>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className='truncate text-start font-normal'>
                {isOptionLabelMessageKey
                  ? t(selectedOptions[0].label as TMessageKey)
                  : selectedOptions[0].label}
              </div>
            )}
          </>
        ) : (
          <div className='truncate text-start font-normal text-muted-foreground'>
            {placeholder && t(placeholder)}
          </div>
        )}
      </div>
      <div className='absolute right-0 z-10 flex size-8 items-center justify-center text-muted-foreground'>
        {isClearable && selectedOptions.length > 0 ? (
          <div
            onClick={(event) => {
              event.stopPropagation()
              onClearOption?.()
            }}
            className='flex size-8 items-center justify-center transition-colors hover:text-destructive'
          >
            <LuX />
          </div>
        ) : (
          <LuChevronDown />
        )}
      </div>
    </Button>
  )
}
