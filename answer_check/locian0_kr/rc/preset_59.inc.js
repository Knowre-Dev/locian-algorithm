import { Laco } from '../libs/common.inc.js'

import { varReverse } from '../rc/function_64.inc.js'
import _ from 'lodash'

export function 역순가능 (tree = null) {
  const laco = new Laco()
  laco.initialize(tree)
  laco.apply(varReverse)
  return laco.finalize()
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = 'GD';
let latex_2 = 'DG';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = 역순가능(tree_1);
let tree_21 = 역순가능(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(result_1);
console.log(result_2);
*/
