import { fracSimp } from '../rc/function_67.inc.js'
import { addFactoredForm } from '../rc/function_70.inc.js'
import { fracSimpVar } from '../rc/function_77.inc.js'
import _ from 'lodash'

export function fracSeparation (tree) {
  if (!Array.isArray(tree)) {
    return tree
  }

  let operator = tree[0]
  const tree_1 = tree.slice(1)
  const newOperand = []
  if (operator === 'fraction' && tree_1[0][0] === 'addchain') {
    const top = addFactoredForm(tree_1[0])
    const base = addFactoredForm(tree_1[1])

    const merge = ['fraction'].concat([top, base])
    const simple1 = fracSimp(merge)
    const simple2 = fracSimpVar(merge)
    let simple
    if (JSON.stringify(simple1) === JSON.stringify(merge) && JSON.stringify(simple2) === JSON.stringify(merge)) {
      simple = true
    } else {
      simple = false
    }
    operator = 'addchain'
    const den = fracSeparation(tree_1[1])
    const term_0 = tree_1[0].slice(1)
    for (const term of term_0) {
      let sign
      let nden
      if (den[0] === 'negative') {
        sign = term[0] === 'add'
          ? 'sub'
          : term[0] === 'sub'
            ? 'add'
            : term[0]
        nden = den[1]
      } else if (den[0] === 'pm' || term[0] === 'addsub') {
        sign = 'addsub'
        nden = den[0] === 'pm' ? den[1] : den
      } else if (den[0] === 'mp' || term[0] === 'subadd') {
        sign = 'subadd'
        nden = den[0] === 'mp' ? den[1] : den
      } else {
        sign = term[0]
        nden = den
      }

      if (simple) {
        newOperand.push([sign, fracSimp(['fraction', fracSeparation(term[1]), nden])])
      } else {
        newOperand.push([sign, ['fraction', fracSeparation(term[1]), nden]])
      }
    }
  } else {
    for (const v of tree_1) {
      newOperand.push(fracSeparation(v))
    }
  }
  return [operator].concat(newOperand)
}
