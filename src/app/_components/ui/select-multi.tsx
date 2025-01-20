import { useTranslations } from 'next-intl'
import {
  ButtonHTMLAttributes,
  Dispatch,
  SetStateAction,
  forwardRef,
  useState,
} from 'react'
import { LuChevronDown, LuX } from 'react-icons/lu'

import { uniqBy } from 'lodash'

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

export interface ISelectMultiProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  options: IOption[]
  initOptions?: IOption[]
  value?: string[]
  onChange: (value: string[]) => void
  search?: string
  onSearchChange?: (search: string) => void
  hasMore?: boolean
  onLoadMore?: () => void
  isFetching?: boolean
  isPopoverOpen?: boolean
  setIsPopoverOpen?: Dispatch<SetStateAction<boolean>>
  isOptionLabelMessageKey?: boolean
  className?: string
  isError?: boolean
  placeholder?: TMessageKey
}

export const SelectMulti = forwardRef<HTMLButtonElement, ISelectMultiProps>(
  (
    {
      options,
      initOptions = [],
      value = [],
      onChange,
      search,
      onSearchChange,
      hasMore,
      onLoadMore,
      isFetching,
      isPopoverOpen: propIsPopoverOpen,
      setIsPopoverOpen: propsSetIsPopoverOpen,
      isOptionLabelMessageKey = false,
      className,
      isError,
      placeholder,
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
      setSelectedOptions((prevSelectedOptions) =>
        uniqBy(
          [...initOptions, ...prevSelectedOptions, ...options].filter(
            (option) => value.includes(option.value),
          ),
          'value',
        ),
      )
    }, [value, options, initOptions])

    const toggleOption = (option: IOption) => {
      const newValue = value.includes(option.value)
        ? value.filter((value) => value !== option.value)
        : [...value, option.value]
      onChange(newValue)
    }

    const handleClear = () => {
      setSelectedOptions([])
      onChange([])
    }

    const t = useTranslations()
    return (
      <Popover onOpenChange={setIsPopoverOpen} open={isPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={() => setIsPopoverOpen((prev) => !prev)}
            className={cn(
              'flex h-auto min-h-9 w-full items-center justify-between rounded-md border px-3 py-1.5 text-sm shadow-sm ring-offset-background hover:bg-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-auto',
              {
                'border-destructive ring-destructive focus:ring-destructive focus-visible:ring-destructive':
                  isError,
              },
              className,
            )}
            variant={'outline'}
          >
            {selectedOptions.length > 0 ? (
              <div className='flex w-full items-center justify-between'>
                <div className='flex flex-wrap items-center gap-1.5'>
                  {selectedOptions.map((option) => (
                    <Badge
                      className={'h-[23px] p-0 pl-2 font-normal'}
                      key={option.value}
                      variant={'outline'}
                    >
                      {isOptionLabelMessageKey
                        ? t(option.label as TMessageKey)
                        : option.label}
                      <div
                        onClick={(event) => {
                          event.stopPropagation()
                          toggleOption(option)
                        }}
                        className='flex h-5 w-6 cursor-pointer items-center justify-center transition-colors hover:text-destructive'
                      >
                        <LuX />
                      </div>
                    </Badge>
                  ))}
                </div>
                <div className='ml-2 flex items-center justify-between'>
                  <LuX
                    onClick={(event) => {
                      event.stopPropagation()
                      handleClear()
                    }}
                    className='cursor-pointer text-muted-foreground transition-colors hover:text-destructive'
                  />
                </div>
              </div>
            ) : (
              <div className='mx-auto flex w-full items-center justify-between'>
                <span className='text-sm font-normal text-muted-foreground'>
                  {placeholder}
                </span>
                <LuChevronDown className='cursor-pointer text-muted-foreground' />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
          align='start'
          className='w-auto p-0'
        >
          <Command shouldFilter={false}>
            <CommandInput
              onValueChange={onSearchChange}
              isLoading={isFetching}
              placeholder={t('Common.search')}
              value={search}
            />
            <CommandList>
              {options.length === 0 && (
                <div className='flex h-20 items-center justify-center text-muted-foreground'>
                  {isFetching
                    ? t('Common.loading')
                    : t('Admin.Common.noResultFound')}
                </div>
              )}
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = value.includes(option.value)
                  return (
                    <CommandItem
                      onSelect={() => toggleOption(option)}
                      className='cursor-pointer'
                      key={option.value}
                      value={option.value}
                    >
                      <Checkbox checked={isSelected} />
                      <span>{option.label}</span>
                    </CommandItem>
                  )
                })}
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
            <CommandSeparator alwaysRender />
            <CommandGroup>
              <div className='flex items-center justify-between'>
                {value.length > 0 && (
                  <>
                    <CommandItem
                      onSelect={handleClear}
                      className='flex-1 cursor-pointer justify-center'
                    >
                      {t('Common.clear')}
                    </CommandItem>
                    <Separator
                      className='flex h-full min-h-6'
                      orientation='vertical'
                    />
                  </>
                )}
                <CommandItem
                  onSelect={() => setIsPopoverOpen(false)}
                  className='max-w-full flex-1 cursor-pointer justify-center'
                >
                  {t('Common.close')}
                </CommandItem>
              </div>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)

SelectMulti.displayName = 'SelectMulti'
