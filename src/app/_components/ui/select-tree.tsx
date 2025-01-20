import { useTranslations } from 'next-intl'
import {
  ButtonHTMLAttributes,
  Dispatch,
  SetStateAction,
  forwardRef,
  useMemo,
  useState,
} from 'react'
import { LuChevronRight } from 'react-icons/lu'

import { CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { isEmpty, isNull, range, uniqBy } from 'lodash'

import { sortByKeys, zodt } from '~/shared/libs'

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

import { useDeepCompareEffect, useFallbackState } from '~/app/_hooks'

import { treeUtil } from '~/app/_libs/tree'
import { cn } from '~/app/_libs/utils'

import { IOptionTree } from '~/app/_interfaces/common.interface'

import { Checkbox } from './checkbox'
import { Collapsible, CollapsibleContent } from './collapsible'
import { SelectButtonDefault, SelectButtonFilter } from './select2'

export interface ISelectTreeProps<TValue = string | string[] | null>
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'onChange' | 'value' | 'name'
  > {
  variant?: 'default' | 'filter'
  isMultiSelect?: boolean
  options?: IOptionTree[]
  initOption?: IOptionTree[] | IOptionTree
  value?: TValue
  onChange?: (value: TValue) => void
  isFetching?: boolean
  openSelect?: boolean
  setOpenSelect?: Dispatch<SetStateAction<boolean>>
  disableValue?: string // root node value of tree must be disabled
  disableNodeLevel?: number // nodeLevel of tree must be disabled
  isClearable?: boolean
  isSearchable?: boolean
  isOptionLabelMessageKey?: boolean
  isError?: boolean
  placeholder?: TMessageKey
}

export const SelectTree = forwardRef<HTMLButtonElement, ISelectTreeProps>(
  (
    {
      variant = 'default',
      isMultiSelect = false,
      options,
      initOption,
      value,
      onChange,
      isFetching,
      openSelect: propOpenSelect,
      setOpenSelect: propsSetOpenSelect,
      disableValue,
      disableNodeLevel,
      isClearable,
      isSearchable,
      isOptionLabelMessageKey,
      isError,
      placeholder,
      className,
      ...props
    },
    ref,
  ) => {
    const [selectedOptions, setSelectedOptions] = useState<IOptionTree[]>([])

    const [search, setSearch] = useState('')
    const [openSelect, setOpenSelect] = useFallbackState(
      propOpenSelect,
      propsSetOpenSelect,
      false,
    )

    const searchedOptions = useMemo(
      () => treeUtil.search(options, search),
      [options, search],
    )

    useDeepCompareEffect(() => {
      const initOptions = initOption ? zodt.toArray(initOption) : []
      const values = value ? zodt.toArray(value) : []

      setSelectedOptions((prevSelectedOptions) => {
        const _options = uniqBy(
          [
            ...initOptions,
            ...prevSelectedOptions,
            ...values
              .map((v) => treeUtil.findNode(options, v, 'value'))
              .filter((option) => !isNull(option)),
          ],
          'value',
        )
        return sortByKeys(
          _options.filter((option) => values.includes(option.value)),
          values,
          'value',
        )
      })
    }, [value, options, initOption])

    const handleSelectOption = (option: IOptionTree) => {
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

    const handleClearOption = (option?: IOptionTree) => {
      if (option) {
        if (isMultiSelect) {
          onChange?.((value as string[]).filter((v) => v !== option.value))
        } else {
          onChange?.(null)
        }
      } else {
        onChange?.(isMultiSelect ? [] : null)
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
          onEscapeKeyDown={() => setOpenSelect(false)}
          align='start'
          className='w-auto min-w-60 p-0'
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
                {searchedOptions.length === 0 && (
                  <div className='flex h-20 items-center justify-center text-muted-foreground'>
                    {isFetching
                      ? t('Common.loading')
                      : t('Admin.Common.noResultFound')}
                  </div>
                )}
                {searchedOptions.map((option) => (
                  <TreeNode
                    onSelectOption={handleSelectOption}
                    disableNodeLevel={disableNodeLevel}
                    disableValue={disableValue}
                    isMultiSelect={isMultiSelect}
                    isOptionLabelMessageKey={isOptionLabelMessageKey}
                    key={option.value}
                    option={option}
                    value={value}
                  />
                ))}
              </CommandGroup>
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

SelectTree.displayName = 'SelectTree'

interface ITreeNodeProps
  extends Pick<
    ISelectTreeProps,
    | 'isMultiSelect'
    | 'value'
    | 'disableValue'
    | 'disableNodeLevel'
    | 'isOptionLabelMessageKey'
  > {
  option: IOptionTree
  onSelectOption: (option: IOptionTree) => void
  disabled?: boolean
  nodeLevel?: number
}
const TreeNode = (props: ITreeNodeProps) => {
  const {
    isMultiSelect,
    value,
    disableValue,
    disableNodeLevel,
    isOptionLabelMessageKey,
    option,
    onSelectOption,
    nodeLevel = 1,
    disabled = false,
  } = props

  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations()

  const isSelected = !value
    ? false
    : isMultiSelect
      ? (value as string[]).includes(option.value)
      : (value as string) === option.value

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
          onSelect={() => onSelectOption(option)}
          className='cursor-pointer'
          disabled={isDisabled}
          value={option.value}
        >
          {range(nodeLevel).map((index) => (
            <div className='size-4 flex-shrink-0' key={index} />
          ))}
          <Checkbox
            checked={isSelected}
            variant={isMultiSelect ? 'default' : 'circle'}
          />
          <span className='max-w-full truncate'>
            {isOptionLabelMessageKey
              ? t(option.label as TMessageKey)
              : option.label}
          </span>
        </CommandItem>
        <CollapsibleContent>
          {option.children?.map((optionChild) => (
            <TreeNode
              {...props}
              disabled={isDisabled}
              key={optionChild.value}
              nodeLevel={nodeLevel + 1}
              option={optionChild}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </>
  )
}
