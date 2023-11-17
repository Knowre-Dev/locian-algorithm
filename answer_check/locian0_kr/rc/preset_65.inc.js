import {Laco} from '../libs/common.inc.js';

import {natElimZero} from '../rc/function_119.inc.js';
import _ from 'lodash';

export function 자연수만_가능(tree = null) {
    
    let laco = new Laco();
    laco.initialize(tree);
    laco.apply(natElimZero);
    return laco.finalize();
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
let latex_1 = '010a + 20b';
let latex_2 = '20b + 10a';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = 자연수만_가능(tree_1);
let tree_21 = 자연수만_가능(tree_2);
console.log(is_equal_tree(tree_11, tree_21));
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1);
console.log(result_2);
*/