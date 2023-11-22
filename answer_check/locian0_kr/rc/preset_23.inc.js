import { Laco } from '../libs/common.inc.js'
import _ from 'lodash'

export function same (tree = null) {
  const laco = new Laco()

  laco.initialize(tree)
  return laco.finalize()
}
/*
import {LatexToTree, match_all} from '../checkmath.js';
let latex_1 = '(A\\cup B)\\cap U';
let latex_2 = 'U\\cup (A\\cap B)';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = same(tree_1);
let tree_21 = same(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(result_1);
console.log(result_2);
*/
