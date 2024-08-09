import { Laco } from '../libs/common.inc.js';

import { mulCommutative } from '../rc/function_46.inc.js';

export function 곱셈_교환법칙(tree = null) {
    const laco = new Laco();
    laco.initialize(tree);
    laco.apply(mulCommutative);
    return laco.finalize();
}
/*
import { LatexToTree } from '../checkmath.js';
const latex_1 = 'x^2+y^2';
const latex_2 = 'a';
const tree_1 = LatexToTree(latex_1);
const tree_2 = LatexToTree(latex_2);
const tree_11 = 곱셈_교환법칙(tree_1);
const tree_21 = 곱셈_교환법칙(tree_2);
const result_1 = JSON.stringify(tree_11, null, 4);
const result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1);
console.log(result_2);
*/
