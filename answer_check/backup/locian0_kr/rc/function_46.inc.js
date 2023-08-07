import {rearrangeTree} from '../rc/function_61.inc.js';

export function mulCommutative(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        tree_1 = rearrangeTree(tree_1, ['mulchain']);
    }
    return tree_1;
}

/*
import {LatexToTree, match_all} from '../checkmath.js';
var latex_1 = 'a\/b*c';
var tree_1 = LatexToTree(latex_1)
var tree_11 = mulCommutative(tree_1);
var result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/