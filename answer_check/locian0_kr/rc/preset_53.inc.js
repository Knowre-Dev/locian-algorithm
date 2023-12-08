import { Laco } from '../libs/common.inc.js';

import { negParenthesis } from '../rc/function_50.inc.js';
import { posiSign } from '../rc/function_51.inc.js';
import { allAssociative, allCommutative } from '../rc/function_67.inc.js';
import { decElimZero } from '../rc/function_79.inc.js';

export function 소수만가능(tree = null) {
    const laco = new Laco();
    // tree_1 = tree_1 ? tree_1 : laco.parse('\frac{3}{2}x');

    /* KR Test */
    laco.initialize(tree);
    laco.apply(posiSign);
    laco.apply(negParenthesis);
    laco.apply(decElimZero);
    laco.apply(allAssociative);
    laco.apply(allCommutative);
    return laco.finalize();
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '42.0';
let latex_2 = '42';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 =  소수만가능(tree_1);
let tree_21 =  소수만가능(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(result_1);
console.log(result_2);
*/
