import _ from 'lodash'

export function powIdentity (tree) {
  if (!Array.isArray(tree)) {
    return tree
  }

  let operator = tree[0]
  const tree_1 = tree.slice(1)
  let newOperand = []
  if (operator === 'power') {
    if (tree_1[1][0] === 'natural' && tree_1[1][1] === '1') {
      operator = tree_1[0].shift()
      newOperand = tree_1[0]
    } else {
      newOperand = tree_1
    }
  } else {
    for (const v of tree_1) {
      newOperand.push(powIdentity(v))
    }
  }
  return [operator].concat(newOperand)
}
/*
import {LatexToTree, compareMathTree} from '../checkmath.js';
let tree1 = LatexToTree('x^2');
let tree2 = LatexToTree('x');
let tree11 = powIdentity(tree1);
let tree21 = powIdentity(tree2);
let result1 = JSON.stringify(tree11, null, 4);
let result2 = JSON.stringify(tree21, null, 4);
console.log(compareMathTree(result1, result2));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/
