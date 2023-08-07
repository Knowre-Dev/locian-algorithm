import {rearrangeTree} from '../rc/function_61.inc.js';

export function eqIdentity(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        tree_1 = rearrangeTree(tree_1, ['equation']);
    }
    return tree_1;
}
