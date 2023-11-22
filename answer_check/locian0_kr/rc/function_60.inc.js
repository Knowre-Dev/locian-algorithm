import _ from 'lodash'

export function rearrangeTreeEq (A, B) {
  if (Array.isArray(A) && !Array.isArray(B)) {
    return 1
  }
  if (!Array.isArray(A) && Array.isArray(B)) {
    return -1
  }
  if (!Array.isArray(A) && !Array.isArray(B)) {
    return typeof A > typeof B
      ? 1
      : typeof A < typeof B
        ? -1
        : A > B
          ? 1
          : A < B
            ? -1
            : 0
  }

  let operatorA
  let operandA
  if (A[0] === 'negative') {
    operatorA = A[1][0]
    operandA = A[1].slice(1)
  } else {
    operatorA = A[0]
    operandA = A.slice(1)
  }

  let operatorB
  let operandB
  if (B[0] === 'negative') {
    operatorB = B[1][0]

    operandB = B[1].slice(1)
  } else {
    operatorB = B[0]

    operandB = B.slice(1)
  }

  const place = [0, 0]
  let opflag
  const operator_entries = [operatorA, operatorB].entries()
  for (const [k, term] of operator_entries) {
    switch (term) {
      case 'add':
      case 'sub':
      case 'addsub':
      case 'subadd':
        opflag = false
        break
      case 'negative':
        place[k] = 1
        break
      case 'fraction':
        place[k] = 2
        break
      default:
        opflag = true
        break
    }
  }

  if (place[0] < place[1]) {
    return 1
  }
  if (place[0] > place[1]) {
    return -1
  }
  if (operatorA > operatorB) {
    return 1
  }
  if (operatorA < operatorB) {
    return -1
  }
  if (operandA.length > operandB.length) {
    return 1
  }
  if (operandA.length < operandB.length) {
    return -1
  }

  const operandA_entries = operandA.entries()
  for (const [k, v] of operandA_entries) {
    const temp = rearrangeTreeEq(v, operandB[k])
    if (temp !== 0) {
      return temp
    }
  }
  return 0
}
/*
import {LatexToTree, compareMathTree, is_equal_tree} from "../checkmath.js";

let tree_1 = LatexToTree("[1]");
let tree_2 = LatexToTree("[1]");

tree_1 = rearrangeTreeEq(tree_1);
tree_2 = rearrangeTreeEq(tree_2);
let result_1 = JSON.stringify(tree_1, null, 4);
let result_2 = JSON.stringify(tree_2, null, 4);
let result = compareMathTree(tree_1, tree_2);
console.log(result);
console.log(result_1);
console.log(result_2);
*/
