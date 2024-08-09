import { Laco } from '../libs/common.inc.js';
import { varReverseShift } from '../rc/function_63.inc.js';

export function geometry_polygon(tree = null) {
    const laco = new Laco();
    laco.initialize(tree);
    laco.apply(varReverseShift);
    return laco.finalize();
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '3x';
let latex_2 = '4x-x';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 =  geometry_polygon(tree_1);
let tree_21 =  geometry_polygon(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(result_1);
console.log(result_2);
*/
