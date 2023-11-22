import _ from 'lodash'

export function nthrootToSquareroot (tree = null) {
  if (!Array.isArray(tree)) {
    return tree
  }

  let operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []
  if (operator === 'nthroot' && JSON.stringify(tree_1[0]) === JSON.stringify([])) {
    operator = 'squareroot'
    newOperand = [tree_1[1]]
  } else {
    for (const v of tree_1) {
      newOperand.push(nthrootToSquareroot(v))
    }
  }
  return [operator].concat(newOperand)
}
/*
import {LatexToTree} from '../checkmath.js';
let latex = '\\nthroot[]{2}';
let tree1 = LatexToTree(latex);
let tree11 = nthrootToSquareroot(tree1);
let result1 = JSON.stringify(tree11, null, 4);
console.log(result1);
*/
