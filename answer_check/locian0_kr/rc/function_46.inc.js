import {rearrangeTree} from '../rc/function_61.inc.js';
import _ from 'lodash';

export function mulCommutative(tree) {
    let tree_1 = _.cloneDeep(tree);
    if (Array.isArray(tree_1)) {
        tree_1 = rearrangeTree(tree_1, ['mulchain']);
    }
    return tree_1;
}




/*
import {LatexToTree, compareMathTree} from '../checkmath.js';
let latex_1 = 'a\/b*c';
let tree_1 = LatexToTree(latex_1)
let tree_11 = mulCommutative(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/