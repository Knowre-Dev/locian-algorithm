import {rearrangeTree} from '../rc/function_61.inc.js';

export function addCommutative(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        tree_1 = rearrangeTree(tree_1, ['addchain']);
    }
    return tree_1;
}


