import { addCommutative } from '../rc/function_47.inc.js'
import { addFactor } from '../rc/function_72.inc.js'
import { sub_mulCommutative } from '../rc/function_126.inc.js'
import _ from 'lodash'

export function powAddFactoredForm (tree = null) {
  if (!Array.isArray(tree)) {
    return tree
  }

  let operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []

  if (operator === 'power') {
    let base = addCommutative(tree_1[0])
    base = sub_mulCommutative(base)
    const expo = tree_1[1]

    if (base[0] === 'addchain' && expo[0] === 'natural') {
      const fact = addFactor(base)
      if (fact[0] === 'mulchain') {
        operator = 'mulchain'
        fact.shift()

        newOperand = []
        for (const f of fact) {
          newOperand.push([f[0], ['power', f[1], expo]])
        }
      } else {
        newOperand = [base, expo]
      }
    } else {
      newOperand = [base, expo]
    }
  } else {
    for (const v of tree_1) {
      newOperand.push(powAddFactoredForm(v))
    }
  }
  return [operator].concat(newOperand)
}
