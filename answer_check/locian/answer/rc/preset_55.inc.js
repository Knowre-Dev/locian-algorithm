import { Laco } from '../libs/common.inc.js';

import { addNegaToSub } from '../rc/function_204.inc.js';

export function 고정(tree = null) {
    const laco = new Laco();
    laco.initialize(tree);
    laco.apply(addNegaToSub);
    return laco.finalize();
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '(-2)+(-2)';
let latex_2 = '-2+(-2)';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 =  고정(tree_1);
let tree_21 =  고정(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(result_1);
console.log(result_2);
*/
