import _ from 'lodash'

import { array2ChainTree, findGCF, multFactor } from '../rc/function_152.inc.js'
import { mulNegative } from '../rc/function_160.inc.js'

export function eqMulProp (tree) {
  if (!Array.isArray(tree)) {
    return tree
  }

  const operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []
  if (operator === 'equation') {
    if (tree_1[0][0] === 'fraction') {
      newOperand.push(tree_1[0][1][0])
      // multiply tree[0][1][1] to tree[1];
    } else if (tree_1[0][0] === 'addchain' && tree_1[0][1][0][0] === 'fraction') {

    } else {
      newOperand = tree_1
    }
  } else {
    newOperand = tree_1
  }
  return [operator].concat(newOperand)
}

export function eqMulPropUS (tree) {
  if (!Array.isArray(tree)) {
    return tree
  }

  if (!['equation', 'inequality'].includes(tree[0])) {
    return tree
  }

  // Input now guaranteed to be a tree array representing equation or inequality

  // Find the common factors for all sides
  const gcfArr = findGCF(tree)
  // Here, elements in gcfArr are guaranteed to be positive,
  // so as to guarantee correct inequality directions
  let factor = []
  factor.push(['mul', gcfArr.const])
  const gcfArr_sym = gcfArr.sym
  for (const sym of gcfArr_sym) {
    factor.push(['mul', sym])
  }
  factor = array2ChainTree(factor)
  let newtree

  if (JSON.stringify(factor) === JSON.stringify(['natural', '1']) ||
        JSON.stringify(factor) === JSON.stringify(['natural', '0'])) {
    newtree = tree // No need to divide by 1
  } else {
    newtree = [tree[0]]
    const tree_1 = tree.slice(1)
    for (const subtree of tree_1) {
      if (!Array.isArray(subtree)) {
        // this block executes for inequality signs (e.g., 'le', 'ge')
        newtree.push(subtree)
        continue
      }
      const newsubtree = multFactor(subtree, ['div', factor], true)
      newtree.push(newsubtree)
    }
  }
  return mulNegative(newtree)

  // NOTE: This function does not support division by negative common factor
  //     Use this function in conjunction with eqMulNeg() and ineqMulNeg()
  //     to handle such cases
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '0=0';
let tree_1 = LatexToTree(latex_1);
let tree_11 = eqMulPropUS(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
