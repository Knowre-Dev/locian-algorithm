import { addNegative } from '../rc/function_71.inc.js'
import _ from 'lodash'

export function fracNegative (tree) {
  if (!Array.isArray(tree)) {
    return tree
  }

  let operator = tree[0]
  const tree_1 = tree.slice(1)
  let sign = 1
  let newOperand = []
  if (operator === 'negative') {
    newOperand.push(fracNegative(tree_1[0]))
    if (newOperand[0][0] === 'negative') {
      operator = newOperand[0][1].shift()
      newOperand = newOperand[0][1]
    }
  } else if (operator === 'fraction') {
    let num = fracNegative(tree_1[0])
    let den = fracNegative(tree_1[1])

    if (num[0] === 'negative') {
      sign = -1 * sign
      num = num[1]
    } else if (num[0] === 'addchain' && num[1][0] === 'sub') {
      sign = -1 * sign
      num = addNegative(['negative', num])
    }

    if (den[0] === 'negative') {
      sign = -1 * sign
      den = den[1]
    } else if (den[0] === 'addchain' && den[1][0] === 'sub') {
      sign = -1 * sign
      den = addNegative(['negative', den])
    }
    newOperand = [num, den]
  } else if (operator === 'addchain') {
    for (const term of tree_1) {
      if (term[1][0] === 'fraction') {
        const nterm = fracNegative(term[1])
        if (nterm[0] === 'negative') {
          if (term[0] === 'add') {
            newOperand.push(['sub', nterm[1]])
          } else if (term[0] === 'sub') {
            newOperand.push(['add', nterm[1]])
          } else {
            newOperand.push([term[0], nterm[1]])
          }
        } else {
          newOperand.push([term[0], nterm])
        }
      } else {
        newOperand.push(term)
      }
    }
  } else if (operator === 'mulchain') {
    for (const term of tree_1) {
      const nterm = fracNegative(term[1])
      if (nterm[0] === 'negative') {
        sign = -1 * sign
        newOperand.push([term[0], nterm[1]])
      } else {
        newOperand.push([term[0], nterm])
      }
    }
  } else {
    for (const v of tree_1) {
      newOperand.push(fracNegative(v))
    }
  }

  if (sign === -1) {
    newOperand = [[operator].concat(newOperand)]
    operator = 'negative'
  }
  return [operator].concat(newOperand)
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '\\frac{125\\pi}{\\pi}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = fracNegative(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(JSON.stringify(tree_11, null, 4));
*/
