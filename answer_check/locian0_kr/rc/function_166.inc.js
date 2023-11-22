import { addAssociative } from '../rc/function_45.inc.js'
import _ from 'lodash'

export function setAssociative (tree) {
  if (!Array.isArray(tree)) {
    return tree
  }

  const operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []
  for (const v of tree_1) {
    const term = addAssociative(v)
    if (operator === term[0]) {
      term.shift()
      newOperand = newOperand.concat(term)
    } else {
      newOperand.push(term)
    }
  }
  return [operator].concat(newOperand)
}
