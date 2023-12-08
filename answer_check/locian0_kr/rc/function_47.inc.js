import { rearrangeTree } from '../rc/function_61.inc.js';

export function addCommutative(tree) {
    return Array.isArray(tree) ? rearrangeTree(tree, ['addchain'])
        : tree;
}
