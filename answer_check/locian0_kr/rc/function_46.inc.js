import { rearrangeTree } from '../rc/function_61.inc.js';
export function mulCommutative(tree) {
    return rearrangeTree(tree, ['mulchain']);
}

/*
import {LatexToTree, compareMathTree} from '../checkmath.js';
let latex_1 = 'a\/b*c';
let tree_1 = LatexToTree(latex_1)
let tree_11 = mulCommutative(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
