import { iLikeContains } from './utils'

/* eslint-disable @typescript-eslint/no-explicit-any */
function traversal<T = any>(
  trees: T[] = [],
  actionFn: (node: T) => void,
  propertyChildren: keyof T = 'children' as keyof T,
): void {
  trees.forEach((tree) => {
    actionFn(tree)
    const children = tree[propertyChildren]
    if (Array.isArray(children)) {
      traversal(children, actionFn, propertyChildren)
    }
  })
}

function findNode<T = any>(
  trees: T[] = [],
  value: string,
  propertyKey: keyof T = 'id' as keyof T,
  propertyChildren?: keyof T,
): T | null {
  let result: T | null = null
  traversal<T>(
    trees,
    (node) => {
      if (node[propertyKey] === value) {
        result = node
      }
    },
    propertyChildren,
  )
  return result
}

function transform<TSource = any, TTarget = any>(
  sourceTrees: TSource[],
  mappings?: {
    sourceLabel: keyof TSource
    sourceValue: keyof TSource
    sourceChildren: keyof TSource
    targetLabel: keyof TTarget
    targetValue: keyof TTarget
    targetChildren: keyof TTarget
  },
): TTarget[] {
  const {
    sourceLabel = 'name' as keyof TSource,
    sourceValue = 'id' as keyof TSource,
    sourceChildren = 'children' as keyof TSource,
    targetLabel = 'label' as keyof TTarget,
    targetValue = 'value' as keyof TTarget,
    targetChildren = 'children' as keyof TTarget,
  } = mappings ?? {}

  return sourceTrees.map((sourceTree) => {
    const transformedNode: TTarget = {
      [targetLabel]: sourceTree[sourceLabel],
      [targetValue]: sourceTree[sourceValue],
    } as TTarget

    if (Array.isArray(sourceTree[sourceChildren])) {
      transformedNode[targetChildren] = transform(
        sourceTree[sourceChildren],
        mappings,
      ) as TTarget[keyof TTarget]
    }

    return transformedNode
  })
}

function search<T = any>(
  trees: T[] = [],
  searchValue: string,
  propertyLabel: keyof T = 'label' as keyof T,
  propertyValue: keyof T = 'value' as keyof T,
  propertyChildren: keyof T = 'children' as keyof T,
): T[] {
  return trees
    .map((tree) => {
      const children = search(
        tree[propertyChildren] as T[],
        searchValue,
        propertyLabel,
        propertyValue,
        propertyChildren,
      )
      const isSatisfy = iLikeContains(
        tree[propertyLabel] as string,
        searchValue,
      )
      if (isSatisfy || children.length) {
        return { ...tree, [propertyChildren]: children }
      } else {
        return null
      }
    })
    .filter((node) => node !== null) as T[]
}

export const treeUtil = {
  traversal,
  findNode,
  transform,
  search,
}
