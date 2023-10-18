import {Laco} from '../libs/common.inc.js';

import {addNegaToSub} from '../rc/function_204.inc.js';

export function 고정(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    laco.initialize(tree_1);
    laco.apply(addNegaToSub);
    tree_1 = laco.finalize();
    
    
    return tree_1;
}

/*
import {LatexToTree} from '../checkmath.js';
var latex_1 = '(-2)+(-2)';
var latex_2 = '-2+(-2)';
var tree_1 = LatexToTree(latex_1);
var tree_2 = LatexToTree(latex_2);
var tree_11 =  고정(tree_1);
var tree_21 =  고정(tree_2);
var result_1 = JSON.stringify(tree_11, null, 4);
var result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 == result_2);
console.log(result_1);
console.log(result_2);
*/