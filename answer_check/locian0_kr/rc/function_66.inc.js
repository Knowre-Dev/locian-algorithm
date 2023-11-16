import {rearrangeTree} from '../rc/function_61.inc.js';
import _ from 'lodash';

export function ineqIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    tree_1 = rearrangeTree(tree_1, ['inequality']);

    return tree_1;
}

/*
import {LatexToTree, match_all} from '../checkmath.js';
var latex_1 = '1\\le \\frac{x}{2}+3\\le 3.4';
var tree_1 = LatexToTree(latex_1)
var tree_11 = ineqIdentity(tree_1);
var result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/