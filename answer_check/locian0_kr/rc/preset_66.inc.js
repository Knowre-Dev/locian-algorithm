import { Laco } from '../libs/common.inc.js';

import { addCommutative } from '../rc/function_47.inc.js';
import { allAssociative } from '../rc/function_67.inc.js';
import { powerOne } from '../rc/function_120.inc.js';
import { mulPowSeparation } from '../rc/function_121.inc.js';
import { powerFrac } from '../rc/function_122.inc.js';
import { mulFracSeparation } from '../rc/function_123.inc.js';
import { sub_mulCommutative } from '../rc/function_126.inc.js';

export function 거듭제곱꼴만_가능(tree = null) {
    const laco = new Laco();
    laco.initialize(tree);
    laco.apply(powerFrac);// 분수 분모 분자 쪼갬
    laco.apply(powerOne);
    laco.apply(mulPowSeparation);
    laco.apply(mulFracSeparation);
    laco.apply(allAssociative);
    // laco.apply(allCommutative);
    laco.apply(addCommutative);
    laco.apply(sub_mulCommutative);
    return laco.finalize();
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
let latex_1 = '2^2\\times 3^2';
let latex_2 = '9\\times 4';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = 거듭제곱꼴만_가능(tree_1);
let tree_21 = 거듭제곱꼴만_가능(tree_2);
console.log(is_equal_tree(tree_11, tree_21));
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1);
console.log(result_2);
*/
