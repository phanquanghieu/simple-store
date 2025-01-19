import { useTranslations } from 'next-intl'
import {
  ButtonHTMLAttributes,
  Dispatch,
  SetStateAction,
  forwardRef,
  useState,
} from 'react'
import { LuChevronDown, LuListFilter, LuX } from 'react-icons/lu'

import { isEmpty, uniqBy } from 'lodash'

import { sortByKeys } from '~/shared/libs/lodash'
import { zodt } from '~/shared/libs/zod'

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

import { useDeepCompareEffect } from '~/app/_hooks/common/use-deep-compare-effect'
import { useFallbackState } from '~/app/_hooks/common/use-fallback-state'

import { cn } from '~/app/_libs/utils'

import { IOption } from '~/app/_interfaces/common.interface'

import { Checkbox } from './checkbox'

export interface ISelect2Props<TValue = string | string[] | null>
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  variant?: 'default' | 'filter'
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
  isPopoverOpen?: boolean
  setIsPopoverOpen?: Dispatch<SetStateAction<boolean>>
  isClearable?: boolean
  isSearchable?: boolean
  isOptionLabelMessageKey?: boolean
  isError?: boolean
  placeholder?: TMessageKey
}

export const Select2 = forwardRef<HTMLButtonElement, ISelect2Props>(
  (
    {
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
      isPopoverOpen: propIsPopoverOpen,
      setIsPopoverOpen: propsSetIsPopoverOpen,
      isClearable = false,
      isSearchable = false,
      isOptionLabelMessageKey = false,
      isError,
      placeholder,
      className,
      ...props
    },
    ref,
  ) => {
    const [selectedOptions, setSelectedOptions] = useState<IOption[]>([])

    const [isPopoverOpen, setIsPopoverOpen] = useFallbackState(
      propIsPopoverOpen,
      propsSetIsPopoverOpen,
      false,
    )

    useDeepCompareEffect(() => {
      const _initOption = initOption ? zodt.toArray(initOption) : []
      const _value = value ? zodt.toArray(value) : []

      setSelectedOptions((prevSelectedOptions) =>
        sortByKeys(
          uniqBy(
            [..._initOption, ...prevSelectedOptions, ...options],
            'value',
          ).filter((option) => _value.includes(option.value)),
          _value,
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

        onChange?.(_value)
      } else {
        if (value !== option.value) {
          onChange?.(option.value)
        }
      }
    }

    const handleClearOption = (option?: IOption) => {
      if (!option) {
        onChange?.(isMultiSelect ? [] : null)
      } else {
        if (isMultiSelect) {
          let _value = [...(value as string[])]
          _value = _value.filter((value) => value !== option.value)
          onChange?.(_value)
        } else {
          onChange?.(null)
        }
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
      <Popover onOpenChange={setIsPopoverOpen} open={isPopoverOpen}>
        <PopoverTrigger
          onClick={() => setIsPopoverOpen((prev) => !prev)}
          asChild
          className={cn(className, {
            'border-destructive ring-destructive focus:ring-destructive focus-visible:ring-destructive':
              isError,
          })}
          ref={ref}
          {...props}
        >
          {variant === 'filter' ? (
            <SelectButtonFilter
              isOptionLabelMessageKey={isOptionLabelMessageKey}
              placeholder={placeholder}
              selectedOptions={selectedOptions}
            />
          ) : (
            <SelectButtonDefault
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
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
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
                    <div className='flex items-center justify-between'>
                      <CommandItem
                        onSelect={onLoadMore}
                        className='max-w-full flex-1 cursor-pointer justify-center'
                        disabled={isFetching}
                      >
                        {t('Admin.Common.loadMore')}
                      </CommandItem>
                    </div>
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
  },
)

Select2.displayName = 'Select2'

interface ISelectButtonFilterProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  selectedOptions: IOption[]
  className?: string
  isOptionLabelMessageKey?: boolean
  placeholder?: TMessageKey
}
const SelectButtonFilter = forwardRef<
  HTMLButtonElement,
  ISelectButtonFilterProps
>(
  (
    {
      selectedOptions,
      className,
      isOptionLabelMessageKey,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const t = useTranslations()
    return (
      <Button
        className={cn('border-dashed px-2 text-sm font-normal', className)}
        ref={ref}
        size={'sm'}
        type='button'
        variant={'outline'}
        {...props}
      >
        <LuListFilter />
        {placeholder && t(placeholder)}
        {selectedOptions.length > 0 && (
          <>
            <Separator className='h-4' orientation='vertical' />
            <div className='space-x-1'>
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
  },
)
SelectButtonFilter.displayName = 'SelectButtonFilter'

interface ISelectButtonDefaultProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  selectedOptions: IOption[]
  isMultiSelect?: boolean
  onClearOption?: (option?: IOption) => void
  isClearable?: boolean
  className?: string
  isOptionLabelMessageKey?: boolean
  placeholder?: TMessageKey
}
const SelectButtonDefault = forwardRef<
  HTMLButtonElement,
  ISelectButtonDefaultProps
>(
  (
    {
      selectedOptions,
      isMultiSelect,
      onClearOption,
      isClearable,
      className,
      isOptionLabelMessageKey,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const t = useTranslations()
    return (
      <Button
        className={cn(
          'relative flex h-auto min-h-9 w-full items-center justify-between py-1.5 pl-3 pr-8 hover:bg-background',
          className,
        )}
        ref={ref}
        type='button'
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
  },
)
SelectButtonDefault.displayName = 'SelectButtonDefault'
