import { Laco } from '../libs/common.inc.js';

import { mulCommutative } from '../rc/function_46.inc.js';

export function 곱셈_교환법칙(tree = null) {
    const laco = new Laco();
    laco.initialize(tree);
    laco.apply(mulCommutative);
    return laco.finalize();
}

/*
import { LatexToTree, is_equal_tree } from '../checkmath.js';
let latex_1 = 'x^2+y^2';
let latex_2 = 'a';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = 곱셈_교환법칙(tree_1);
let tree_21 = 곱셈_교환법칙(tree_2);
console.log(is_equal_tree(tree_11, tree_21));
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1);
console.log(result_2);
*/
