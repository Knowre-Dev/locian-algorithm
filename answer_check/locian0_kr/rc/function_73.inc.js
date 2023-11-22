import { addNegative } from '../rc/function_71.inc.js'
import _ from 'lodash'

export function eqMulNeg (tree) {
  if (!Array.isArray(tree)) {
    return tree
  }

  const operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []
  if (operator === 'equation' &&
        (tree_1[0][0] === 'negative' || (tree_1[0][0] === 'addchain' && tree_1[0][1][0] === 'sub'))) {
    tree_1[0][0] === 'negative'
      ? newOperand.push(tree_1[0][1])
      : newOperand.push(addNegative(['negative', tree_1[0]]))

    tree_1[1][0] === 'negative'
      ? newOperand.push(tree_1[1][1])
      : tree_1[1][0] === 'addchain'
        ? newOperand.push(addNegative(['negative', tree_1[1]]))
        : (tree_1[1][0] === 'natural' && tree_1[1][1] === '0')
            ? newOperand.push(tree_1[1])
            : newOperand.push(['negative', tree_1[1]])
  } else {
    newOperand = tree_1
  }
  return [operator].concat(newOperand)
}
