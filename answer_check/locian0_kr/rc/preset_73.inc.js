import {Laco} from '../libs/common.inc.js';

import {mulCommutative} from '../rc/function_46.inc.js';

export function 곱셈_교환법칙(tree =  null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();;
    laco.initialize(tree_1);
        
    laco.apply(mulCommutative);
    tree_1 = laco.finalize();
       

    return tree_1;
}


import {LatexToTree, is_equal_tree} from '../checkmath.js';
var latex_1 = 'x^2+y^2';
var latex_2 = 'a';
var tree_1 = LatexToTree(latex_1);
var tree_2 = LatexToTree(latex_2);
var tree_11 = 곱셈_교환법칙(tree_1);
var tree_21 = 곱셈_교환법칙(tree_2);
console.log(is_equal_tree(tree_11, tree_21));
var result_1 = JSON.stringify(tree_11, null, 4);
var result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1);
console.log(result_2);