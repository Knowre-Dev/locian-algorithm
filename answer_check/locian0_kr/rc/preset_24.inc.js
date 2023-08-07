import {Laco} from '../libs/common.inc.js';

import {evaluateEx_new} from '../rc/function_152.inc.js';

function equivalent(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    tree_1 = tree_1 ? tree_1 : laco.parse('ba+3xy+\overline{SCEAG}');
    
    laco.initialize(tree_1);
    laco.apply(evaluateEx_new);
    tree_1 = laco.finalize();
   
    
    return tree_1;
}
/*
import {LatexToTree, match_all} from '../checkmath.js';
var latex_1 = '3x+4';
var latex_2 = '4+3x';
var tree_1 = LatexToTree(latex_1);
var tree_2 = LatexToTree(latex_2);
var tree_11 = equivalent(tree_1);
var tree_21 = equivalent(tree_2);
var result_1 = JSON.stringify(tree_11, null, 4);
var result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 == result_2);
console.log(result_1);
console.log(result_2);
*/