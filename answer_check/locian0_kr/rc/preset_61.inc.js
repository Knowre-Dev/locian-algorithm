import {Laco} from '../libs/common.inc.js';

import {mfracEquiv} from '../rc/function_110.inc.js';

export function 대분수_가능(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    //tree_1 = tree_1 ? tree_1 : laco.parse('\mfrac[1]{1}{2}');
    laco.initialize(tree_1);
    laco.apply(mfracEquiv);
    tree_1 = laco.finalize();
    

    return tree_1;
}
/*
import {LatexToTree} from '../checkmath.js';
var latex_1 = '\\mfrac[1]{1}{2}';
var latex_2 = '\\mfrac[1]{7}{4}';
var tree_1 = LatexToTree(latex_1);
var tree_2 = LatexToTree(latex_2);
var tree_11 = 대분수_가능(tree_1);
var tree_21 = 대분수_가능(tree_2);
var result_1 = JSON.stringify(tree_11, null, 4);
var result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 == result_2);
console.log(result_1);
console.log(result_2);
*/