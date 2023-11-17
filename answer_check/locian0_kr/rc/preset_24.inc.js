import {Laco} from '../libs/common.inc.js';
import {evaluateEx_new} from '../rc/function_152.inc.js';
import _ from 'lodash';

export function equivalent(tree = null) {
    
    let laco = new Laco();
    //tree_1 = tree_1 ? tree_1 : laco.parse('ba+3xy+\overline{SCEAG}');
    
    laco.initialize(tree);
    laco.apply(evaluateEx_new);
    return laco.finalize();
}
/*
import {LatexToTree, match_all} from '../checkmath.js';
let latex_1 = '3x+4';
let latex_2 = '4+3x';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = equivalent(tree_1);
let tree_21 = equivalent(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(result_1);
console.log(result_2);
*/