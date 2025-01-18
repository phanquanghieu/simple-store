import { useTranslations } from 'next-intl'
import {
  ButtonHTMLAttributes,
  Dispatch,
  SetStateAction,
  forwardRef,
  useMemo,
  useState,
} from 'react'
import { LuChevronDown, LuChevronRight, LuX } from 'react-icons/lu'

import { CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { range } from 'lodash'

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

import { treeUtil } from '~/app/_libs/tree'
import { cn } from '~/app/_libs/utils'

import { SPECIAL_OPTION, SPECIAL_STRING } from '~/app/_constant/common.constant'
import { IOptionTree } from '~/app/_interfaces/common.interface'

import { Checkbox } from './checkbox'
import { Collapsible, CollapsibleContent } from './collapsible'

export interface ISelectTreeProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  options: IOptionTree[]
  initOption?: IOptionTree | null
  value?: string
  onChange: (value: string) => void
  disableValue?: string // value of root tree must be disabled
  disableNodeLevel?: number // nodeLevel of tree must be disabled
  isFetching?: boolean
  isPopoverOpen?: boolean
  setIsPopoverOpen?: Dispatch<SetStateAction<boolean>>
  hasOptionNull?: boolean
  className?: string
  isError?: boolean
  placeholder?: TMessageKey
}

export const SelectTree = forwardRef<HTMLButtonElement, ISelectTreeProps>(
  (
    {
      options: propOptions,
      initOption,
      value,
      onChange,
      disableValue,
      disableNodeLevel,
      isFetching,
      isPopoverOpen: propIsPopoverOpen,
      setIsPopoverOpen: propsSetIsPopoverOpen,
      hasOptionNull = false,
      className,
      isError,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const [selectedOption, setSelectedOption] = useState<IOptionTree | null>(
      null,
    )
    const [search, setSearch] = useState('')
    const [isPopoverOpen, setIsPopoverOpen] = useFallbackState(
      propIsPopoverOpen,
      propsSetIsPopoverOpen,
      false,
    )

    const t = useTranslations()

    const options = useMemo(() => {
      let options = treeUtil.search(propOptions, search)

      if (hasOptionNull) {
        options = [
          {
            label: t(SPECIAL_OPTION.null.label),
            value: SPECIAL_OPTION.null.value,
          },
          ...options,
        ]
      }

      return options
    }, [propOptions, hasOptionNull, t, search])

    useDeepCompareEffect(() => {
      setSelectedOption((prevSelectedOption) => {
        let _selectedOption = null
        if (value) {
          if (initOption && initOption.value === value) {
            _selectedOption = initOption
          } else if (prevSelectedOption && prevSelectedOption.value === value) {
            _selectedOption = prevSelectedOption
          } else {
            _selectedOption = treeUtil.findNode(options, value, 'value')
          }
        }
        return _selectedOption
      })
    }, [value, options, initOption])

    const handleSelect = (option: IOptionTree) => {
      if (option.value !== selectedOption?.value) {
        onChange(option.value)
      }
    }

    const handleClear = () => {
      onChange(SPECIAL_STRING.null)
    }

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
            {selectedOption ? (
              <div className='flex w-full items-center justify-between'>
                <div className='flex flex-wrap items-center gap-1.5 font-normal'>
                  {selectedOption.label}
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
              onValueChange={setSearch}
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
                {options.map((option) => (
                  <TreeNode
                    onSelect={handleSelect}
                    disableNodeLevel={disableNodeLevel}
                    disableValue={disableValue}
                    key={option.value}
                    option={option}
                    value={selectedOption?.value}
                  />
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator alwaysRender />
            <CommandGroup>
              <div className='flex items-center justify-between'>
                {value && value !== SPECIAL_STRING.null && (
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

SelectTree.displayName = 'SelectTree'

const TreeNode = ({
  value,
  option,
  onSelect,
  disableValue,
  disableNodeLevel,
  disabled = false,
  nodeLevel = 1,
}: {
  value: string
  option: IOptionTree
  onSelect: (option: IOptionTree) => void
  disableValue?: string
  disableNodeLevel?: number
  disabled?: boolean
  nodeLevel?: number
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const isSelected = value === option.value
  const isDisabled =
    disabled === true ||
    disableValue === option.value ||
    (disableNodeLevel !== undefined && disableNodeLevel <= nodeLevel)

  return (
    <>
      <Collapsible
        onOpenChange={setIsOpen}
        className='relative'
        key={option.value}
        open={isOpen}
      >
        {!!option.children?.length && (
          <CollapsibleTrigger asChild>
            <div
              className='absolute z-10 m-1 flex size-6 items-center justify-center rounded-md hover:bg-secondary'
              style={{ left: `${(nodeLevel - 1) * 1.5}rem` }}
            >
              <LuChevronRight
                className='rotate-0 transition data-[open=true]:rotate-90'
                data-open={isOpen}
              />
            </div>
          </CollapsibleTrigger>
        )}
        <CommandItem
          onSelect={() => onSelect(option)}
          className='cursor-pointer'
          disabled={isDisabled}
          value={option.value}
        >
          {range(nodeLevel).map((index) => (
            <div className='size-4' key={index} />
          ))}
          <Checkbox checked={isSelected} variant={'circle'} />
          <span>{option.label}</span>
        </CommandItem>
        <CollapsibleContent>
          {option.children?.map((optionChild) => (
            <TreeNode
              onSelect={onSelect}
              disabled={isDisabled}
              disableNodeLevel={disableNodeLevel}
              disableValue={disableValue}
              key={optionChild.value}
              nodeLevel={nodeLevel + 1}
              option={optionChild}
              value={value}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}
